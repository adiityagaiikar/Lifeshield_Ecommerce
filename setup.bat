@echo off
echo Starting setup...
npx -y create-next-app@14.2.15 frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
mkdir backend
cd backend
call npm init -y
call npm install express mongoose dotenv cors helmet express-rate-limit bcrypt jsonwebtoken express-mongo-sanitize xss-clean winston joi
call npm install -D typescript @types/node @types/express @types/cors @types/bcrypt @types/jsonwebtoken nodemon ts-node
call npx tsc --init
echo Setup complete!
