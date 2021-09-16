const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    id:{type: String},
    email:{type:String},
    status:{type:String},
  }
);

module.exports = mongoose.model('policystatus', schema, 'policystatus');
 