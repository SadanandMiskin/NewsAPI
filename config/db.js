const mongoose = require('mongoose')
require('dotenv').config()


const dbconnect = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected')
    }
    catch(err)
    {
        console.log(err)
    }
}

module.exports = dbconnect()