import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
    name: string;
    email: string;
    role: 'user' | 'admin';
    password?: string;
    matchPassword(enteredPassword: string): Promise<boolean>;
    getSignedJwtAccessToken(): string;
    getSignedJwtRefreshToken(): string;
}

const UserSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: 6,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

// Encrypt password using bcrypt
UserSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtAccessToken = function (this: IUser): string {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET || '', {
        expiresIn: process.env.JWT_EXPIRE || '15m',
    } as jwt.SignOptions);
};

UserSchema.methods.getSignedJwtRefreshToken = function (this: IUser): string {
    return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET || '', {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
    } as jwt.SignOptions);
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (this: IUser, enteredPassword: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
