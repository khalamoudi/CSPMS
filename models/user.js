const mongoose = require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    email: {type: String},
    password: {type: String},
    role: { type: String},
  }
);
schema.plugin(passportLocalMongoose, { usernameField : 'email' });
module.exports = mongoose.model('user', schema, 'user');
