var {nodeMCU} = require('../models/nodeMCU');
var {Light} = require('../models/light');

var setupApp = function(req, res){

  console.log('Setting up app');

  Light.find({}).then((doc) => {

    if(!doc){
      return new Promsie.reject("document returned is empty");
    }
    else{

      var jsonToSend = JSON.stringify(doc);

      console.log(jsonToSend);

      res.set("Content-Type", "application/json");

      res.status(200).send(jsonToSend);

    }

  }, (err) => {

    res.status(400).send(err);

  })

}

module.exports = {
  setupApp
}
