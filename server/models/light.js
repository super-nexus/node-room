const mongoose = require('mongoose');

var lightSchema = new mongoose.Schema({

  mac_address: {
    type: String,
    required: true
  },

  state:{
    type: Number,
    enum: [1, 0],
    required: true
  },

  pin: {
    type: Number,
    required: true
  },

  id: {
    type: Number,
    required: true
  },

  name: {
    type: String,
    required: true
  }

});


var Light = mongoose.model('Light', lightSchema);

module.exports = {Light};
