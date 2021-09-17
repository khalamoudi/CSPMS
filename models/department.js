const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name:{type: String},
    description:{type:String},
    email:{type:String},
  }
);

module.exports = mongoose.model('department', schema, 'department');
 