const mongoose = require('mongoose');

var lightSchema = new mongoose.Schema({

  id: {
    type: Number,
    required: true
  },

  mac_address:{
    type: String,
    required: true
  },

  state: {
    type: Number,
    required: true
  },

  pin: {
    type: Number,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  favourite: {
    type: Number,
    default: 0,
    enum: [1,0]
  }
});


var Light = mongoose.model('Light', lightSchema);

module.exports = {Light};
