const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()

const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')

const session = require('express-session')

const isSignedIn = require('./middleware/is-signed-in.js')
const passUserToView = require('./middleware/pass-user-to-view.js')

const PORT = process.env.PORT ? process.env.PORT : '3000'

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
	console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
)

app.use(passUserToView)

// Landing Page
app.get('/', (req, res) => {
	if (req.session.user) {
		console.log(req.session.user)
		res.redirect(`/users/${req.session.user._id}/applications`)
	} else {
		res.render('index.ejs')
	}
})

// Require and use Controller
const authController = require('./controller/auth')
const applicationsController = require('./controller/applications')

app.use('/auth', authController)
app.use(isSignedIn)
app.use('/users/:userId/applications', applicationsController)

app.listen(PORT, () => {
	console.log(`Running on localhost:${PORT}`)
})
