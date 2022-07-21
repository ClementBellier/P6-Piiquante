const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const path = require('path')
const dotenv = require('dotenv')

const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user')

const app = express()
dotenv.config()

mongoose.connect(`${process.env.MONGODB_URL}`,
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }))
app.use(express.json())
app.use(mongoSanitize())

//Limit each IP to 100 requests per 15 minutes
app.use(rateLimit({windowMs: 15*60*1000, max:100, standardHeaders: true,legacyHeaders: false}))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/auth', userRoutes)
app.use('/api/sauces', saucesRoutes)

module.exports = app