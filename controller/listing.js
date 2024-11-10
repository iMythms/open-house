const express = require('express')

const router = express.Router()

const Listing = require('../models/listing')

router.get('/', async (req, res) => {
	try {
		const populatedListing = await Listing.find().populate('owner')
		console.log('Populated Listing: ', populatedListing)
		res.render('listings/index.ejs', { listings: populatedListing })
	} catch (err) {
		console.log(err)
		res.redirect('/')
	}
})

router.get('/new', async (req, res) => {
	res.render('listings/new.ejs')
})

router.post('/', async (req, res) => {
	req.body.owner = req.session.user._id
	await Listing.create(req.body)
	res.redirect('/listings')
})

module.exports = router
