const mongoose = require('mongoose')

const googleSchema = new mongoose.Schema({
        username:{
            type: String,
            
        },
       
        googleId:{
            type: String
        }
})

const google = mongoose.model('google', googleSchema)
module.exports = google