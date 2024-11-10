const express = require('express')
const router = express.Router()

const User = require('../models/user')

// API's Core functionality
router.get('/', async (req, res) => {
	try {
		const currentUser = await User.findById(req.session.user._id)
		res.render('applications/index.ejs', {
			applications: currentUser.applications,
		})
	} catch (error) {
		console.log(error)
		res.redirect('/')
	}
})

router.get('/new', async (req, res) => {
	res.render('applications/new.ejs')
})

router.get('/:applicationId', async (req, res) => {
	try {
		const currentUser = await User.findById(req.session.user._id)
		const application = currentUser.applications.id(req.params.applicationId)
		res.render('applications/show.ejs', { application: application })
	} catch (err) {
		console.log(err)
		res.redirect('/')
	}
})

router.get('/:applicationId/edit', async (req, res) => {
	try {
		const currentUser = await User.findById(req.session.user._id)
		const application = currentUser.applications.id(req.params.applicationId)
		res.render('applications/edit.ejs', { application: application })
	} catch (err) {
		console.log(err)
		res.redirect('/')
	}
})

router.put('/application', async (req, res) => {
	try {
		const currentUser = await User.findById(req.session.user._id)
		const application = currentUser.applications.id(req.params.applicationId)
		application.set(req.body)
		await currentUser.save()
		res.redirect(
			`/users/${currentUser._id}/applications/${req.params.applicationId}`
		)
	} catch (err) {
		console.log(err)
		res.redirect('/')
	}
})

router.post('/', async (req, res) => {
	try {
		const currentUser = await User.findById(req.session.user._id)
		currentUser.applications.push(req.body)
		await currentUser.save()
		res.redirect(`/users/${currentUser._id}/applications`)
	} catch (err) {
		console.log(err)
		res.redirect('/')
	}
})

module.exports = router
