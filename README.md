# Angular Test Task

## Task

1. **Create a single page application using Angular framework**

2. **The application should contain a couple of components:**

- One component for adding/editing/deleting trades (entry date,entry price, exit date, exit price, profit - auto calculated)
- Second component for displaying cumulative balance as a chart over time for entered trades

_Notes:_

- No need to create database schema – all data can be stored in memory and lost after refreshing the page
- For chart any 3rd party library can be used
- For adding/editing the trades there should be validation for most obvious cases (for example, price can’t be less than zero, entry date should be less or equal to exit date)
- No need for authentication – any user should be able to open the application

3. **As a result,**

- Deploy project on your hosting OR send a link to Git repository with some README file to know how to run the application
- Provide a source code to validate

## Get started

### Clone the repo

```
git clone https://github.com/sergeynovik1/trading.git
cd trading-task
```

### Install npm packages

```
npm install
npm run start
```

The `npm start` command builds (compiles TypeScript and copies assets) the application into `dist/`, watches for changes to the source files, and runs `lite-server` on port `4200`.

Shut it down manually with `Ctrl-C`.
