## Quickstart

```
# Install node.js
git clone https://github.com/woonsocket/bqbl.git
cd bqbl
npm install
firebase login
ng serve
# Navigate to localhost:4200
```

## Deploy
```
ng build --prod && firebase deploy
```

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

NOTE(harveyj): we don't have tests yet.
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Running unit tests

<install tslint>
tslint -c tslint.json 'src/**/*.ts' --fix