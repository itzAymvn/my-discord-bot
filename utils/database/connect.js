const mongoose = require("mongoose")

const connectToDatabase = async () => {
	const conn = await mongoose.connect(process.env.MONGO_URI)
	return conn
}

module.exports = connectToDatabase
