
# Hot Takes API for Project 6 of Web Developper training by OpenClassrooms

Piiquante is dedicated to the creation of spicy sauces, the company wants to create a web application where users can add their favorite sauces and like or dislike the sauces added by others.  

The front is developed upstream and is available in [this github repository](https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6)

## API Reference

I made a Open Api documentation in [SwaggerHub](https://app.swaggerhub.com/apis/ClementBellier/OC_Piiquante/1.0.0#/user/loginUser)


## Run Locally

Clone the project

```bash
  git clone https://github.com/ClementBellier/P6-Piiquante
```

Go to the project directory

```bash
  cd P6-Piiquante
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node server
```

The API is reachable in http://localhost:3000/


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`SECRET_TOKEN` a long string for secure tokens  
`TOKEN_EXPIRED` time ex: 24h  
`MONGODB_URL` a MongDB url to a database

I can provide you with the ones I used for this project by contacting me by email [clement.bellier@gmail.com](mailto:clement.bellier@gmail.com)


## Architecture

This is my first API but I try to make it in hexagonal architecture.  
I separated the domain, controllers and persistence parts.

I use nodeJs, express, and MongoDB
I secure the API with Helmet, express-rate-limit, express-mongo-sanitise.
It check users emails and passwords with validator and password-validator.
It crypt passwords with bcrypt and sign tokens with jsonwebtoken.

## Lessons Learned

This is the first time I work on backend with NodeJs.  
I was ignorant in software architectures, my mentor push me to made this project in hexagonal architecture. I tried, it's not perfect but it's my first try.  
I learned a lot in security and GDPR, I tried to have OWASP good practices.
