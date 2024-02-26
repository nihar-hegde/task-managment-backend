# Task managament backend

### Built using:-
1. Node.js
2. Typescript
3. Express
4. Mongodb

## Local Setup:-
1. clone the repo
2. add the .env files and add the following to it :-
   `
   PORT:8080
   MONGODB_URI:"YOUR MONGDB URI"
   JWT_SECRET:"ADD A SECURE SECRETE HERE (user openssl rand -base64 32 to generate a secrete
   `
3. run `npm install`
4. run `ts-node src/index.ts` to run the project on `PORT:8080`

## The backend is hosted on Render 
  render takes a log of time to spin up after some time of inactivity
