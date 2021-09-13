const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  name: { type: String },
  description: { type: String },
  category:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category'
},

  file_url: {
    type: String,
  },
  thumbnail_url: {
    type: String,
  },
})

module.exports = mongoose.model('policy', schema, 'policy')
