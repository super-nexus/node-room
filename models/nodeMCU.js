const mongoose = require('mongoose');

var nodeSchema = new mongoose.Schema({

  mac_address:{
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
   switches: [

     {
       name: {
         type: String,
         required: true
       },

       state: {
         type: Number,
         enum: (1, 0),
         required: true
       },

       pin: {
         type: Number,
         required: true
       },

       id: {
         type: Number,
         required: true
       }

     }
  ],
  name: {
    type: String,
    required: true
  },

  area: {
    type: String,
    required: true
  },

  typeOfDevice: {
    type: String,
    enum: ['SE', 'SW'],
    default: 'SW'
  },
  changeInLights:{
    type: Boolean,
    default: false
  }

})

nodeSchema.statics.findByMacAddress = function(mac_address){
  var NodeMCU = this;

  nodeMCU.findOne({mac_address: mac_address}).then((doc) => {
    if(!doc){
      return new Promise.reject();
    }
    else{
      return doc;
    }
  })

}


var nodeMCU = mongoose.model('nodeMCU', nodeSchema);



module.exports = {nodeMCU};
