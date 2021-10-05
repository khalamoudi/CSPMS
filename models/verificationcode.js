const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    code:{type:String},
    email:{type:String}
  }
);

module.exports = mongoose.model('verificationcode', schema, 'verificationcode');
 