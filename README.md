# Simple-Accounting React and Nodejs/Express app

## Description
This is a simple accounting application which allow you to store your accoutn balance.

Using application you can add(credit) funds to your account or subtract(debt) them.

For data storage we use simple JSON files.

When you visit a page, application set cookie with random ID which be using to store different files relative to the user session.

## To start app

Install all necassary node moules
```sh
  npm i
```
Run server API
```sh
  node app.js
```
Build react files
```sh
  npm run build
```

Now in your browser open `http://localhost:3000`

## Another Commands

To quckly setup a project. Run build and API server
```sh
npm run start
```
Rebuild production front end build when you changed files
```sh
npm run watch
```
Start front end development server(without api)
```sh
npm run front
```
Build production build(front end)
```sh
npm run build
```
Run front end tests
```sh
npm run test
```


