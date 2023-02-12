// mongoose
const mongoose = require('mongoose')
mongoose.set("strictQuery", false);

// Connect to mongodb
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

// export
module.exports = connectDB