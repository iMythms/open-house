const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema(
	{
		streetAddress: {
			type: String,
			require: true,
		},
		city: {
			type: String,
			require: true,
		},
		price: {
			type: Number,
			require: true,
			min: 0,
		},
		size: {
			type: Number,
			require: true,
			min: 0,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		likedByUsers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{
		timestamps: true,
	}
)

const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing
