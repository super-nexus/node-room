var {nodeMCU} = require('../models/nodeMCU');
var {Light} = require('../models/light');

var setupNodeMCU = function(req, res){
  if(!req.body){
    console.log('Body empty');
    res.status(400).send('Body empty');
  }
  else{
    console.log(JSON.stringify(req.body));
    var nodemcu =  new nodeMCU(_.pick(req.body, ['mac_address', 'ip', 'name', 'typeOfDevice']));

    var lightsArray = req.body.switches;
    var mac_address = req.body.mac_address;
    console.log('Lights array', lightsArray);

    nodeMCU.findOne({mac_address: req.body.mac_address}).then((data) => {
      if(!data){
        console.log('No node mcu with this mac address found: ', req.body.mac_address);
        nodemcu.save().then(() => {
          exec.saveLights(lightsArray, mac_address, res);
          res.status(200).send(successResponse);
        })
        return;
      }
      if(req.body.changeInLights){
        exec.saveLights(lightsArray, mac_address, res);
      }
      if (data.ip == req.body.ip) {
        res.status(200).send(successResponse);
      }
      else if(data.ip != req.body.ip){
        nodeMCU.findOneAndUpdate({mac_address: body.req.mac_address}, {$set: {ip: req.body.ip}}).then((data) => {
          if(!data){
            console.log('no data recieved');
            return res.status(400).send('no data recieved');
          }
          else{
            console.log(JSON.stringify(data));
            res.status(200).send(successResponse);
          }
        })
      }

    }).catch((err) => {
      console.log(err);
      res.status(400).send(err);
    })

  }

}

module.exports = {setupNodeMCU};
