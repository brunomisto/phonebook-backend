require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGODB_URI);

// Person schema
const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true,
	},
	number: {
		type: String,
		minLength: 8,
		required: true,
		validate: /^\d{2,3}-\d+$/,
	},
});

personSchema.set("toJSON", {
	transform: (doc, ret) => {
		ret.id = String(ret._id);
		delete ret._id;
		delete ret.__v;
	},
});

// Person factory
const Person = mongoose.model("Person", personSchema);

module.exports = Person;
