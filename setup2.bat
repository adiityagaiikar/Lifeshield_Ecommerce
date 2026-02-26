@echo off
mkdir backend
cd backend
call npm init -y
call npm install express mongoose dotenv cors helmet express-rate-limit bcrypt jsonwebtoken express-mongo-sanitize xss-clean winston joi
call npm install -D typescript @types/node @types/express @types/cors @types/bcrypt @types/jsonwebtoken nodemon ts-node
call npx tsc --init
cd ..
cd frontend
call npm install framer-motion @reduxjs/toolkit react-redux lucide-react axios clsx tailwind-merge
echo All dependencies installed!
