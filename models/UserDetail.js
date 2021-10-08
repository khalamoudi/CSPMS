const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    verified:false,
    email: { type: String },
    userName: { type: String },
    role: { type: String },
    phone:{ type: String },
    Department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department'
    },
  }
);
module.exports = mongoose.model('UserDetail', schema,'userdetails');