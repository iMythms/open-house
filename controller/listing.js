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

router.get('/:listingId', async (req, res) => {
	try {
		const populatedListing = await Listing.findById(
			req.params.listingId
		).populate('owner')

		const userHasLiked = populatedListing.likedByUsers.some((user) =>
			user.equals(req.session.user._id)
		)
		res.render('listings/show.ejs', {
			listings: populatedListing,
			userHasLiked: userHasLiked,
		})
	} catch (err) {
		console.log(err)
		res.redirect('/')
	}
})

router.get('/:listingId/edit', async (req, res) => {
	try {
		const populatedListing = await Listing.findById(
			req.params.listingId
		).populate('owner')
		res.render('listings/edit.ejs', { listing: populatedListing })
	} catch (err) {
		console.log(err)
		res.redirect('/')
	}
})

router.put('/:listingId', async (req, res) => {
	try {
		const populatedListing = await Listing.findById(
			req.params.listingId
		).populate('owner')
		populatedListing.set(req.body)
		await populatedListing.save()
		res.redirect('/listings')
	} catch (err) {
		console.log(err)
		res.redirect('/')
	}
})

router.delete('/:listingId', async (req, res) => {
	try {
		const listing = await Listing.findById(req.params.listingId)
		if (listing.owner.equals(req.session.user._id)) {
			await listing.deleteOne()
			res.redirect('/listings')
		} else {
			res.send("You don't have permission to do that.")
		}
	} catch (error) {
		console.error(error)
		res.redirect('/')
	}
})

router.post('/:listingId/liked-by/:userId', async (req, res) => {
	try {
		await Listing.findByIdAndUpdate(req.params.listingId, {
			$push: { likedByUsers: req.params.userId },
		})
		res.redirect(`/listings/${req.params.listingId}`)
	} catch (error) {
		console.error(error)
		res.redirect('/')
	}
})

module.exports = router
