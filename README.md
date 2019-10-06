# Monitoring_Excercise
Endpoint monitoring application

# Application

This is a  microservice, which allows you to monitor your desired endpoints and provide you the results. Multiple users can use the service at the same time.

# Installation

#### Setup mySQL database:
- Install `XAMPP`
- Open `https://localhost/phpmyadmin`
- Create new database named `monitoring`, select it
- Click `Import`
- Under "File to import", browse for *`.../Monitoring_Excercise/monitoring.sql`* file
- Select it and hit `Go`
- Information about the database is located in `src/index.ts`. You can set your username and password in and `.env` file.

#### Install dependencies:
- >`npm install`

# Getting started

### Start the server with:
>`npm start`

### Perform requests:

Using `Postman` or `Insomnia` is reccommended.

- >`GET http://localhost:8080/user`
    - returns list of users, without the need of authentication.

Further requests require having **Bearer athentication** set up. Each user is allowed to see only his/her content.
Alternatively, a header `authorization` can be setup with the token as it's value.
- >`GET http://localhost:8080/endpoints`
    - lists endpoints, belonging to the authorized user
- >`GET http://localhost:8080/endpoints/{id}`
    - returns endpoint with `{id}`, belonging to the authorized user
- >`GET http://localhost:8080/results`
    - lists 10 most recent monitoring results collected, belonging to the authorized user
- >`GET http://localhost:8080/results/{id}`
    - returns list of 10 most recent monitoring results of endpoint with `{id}`, belonging to the authorized user
- >`POST http://localhost:8080/endpoints`
    - creates new monitored endpoint for the authorized user.
    - body is of type JSON, containing elements:
        - `name`: name of the endpoint
        - `url`: URL endpoint
        - `monitorInterval`: monitoring time interval in seconds
- >`DELETE http://localhost:8080/endpoints/{:id}`
    - deletes endpoint with `{id}`, if it belongs to the authorized user.

### Run tests

>`npm run test`

# Tech stack

- Built in `Node.js` framework
- Using `TypeScript`
- `MySQL` is used as the database
- REST framework - `Restify`
- Tests are written using `Jest`
- Possibility to run in `Docker`





