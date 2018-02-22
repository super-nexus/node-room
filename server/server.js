const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {nodeMCU} = require('./models/nodeMCU');
var {Light} = require('./models/light');
var exec = require('./methods/exec');
var application = require('./methods/application');

var app = express();

var testUrl = 'https://requestb.in/17pzkl51';
var Url = 'http://192.168.1.102:80/switch';

const successResponse = 'OK';

var port = process.env.PORT;

var saveLights = (lightsArray, mac_address, res) => {
  console.log('savingLights');
  for(var i = 0; i < lightsArray.length; i++){

    var currentLight = lightsArray[i];
    currentLight.mac_address = mac_address;

    var light = new Light(currentLight);

    light.save().then((doc) => {
      console.log('Light saved: ', doc);
    }).catch((err) => {
      console.log(err);
      res.status(400).send(err);
    })
  }
}


app.use(bodyParser.json());

app.post('/switch', (req, res) => {
  console.log("POST switch recieved");
  console.log(req.body);
  var pin = req.body.pin.toString();
  var state = req.body.state.toString();

  //console.log(pin, state);

  var objectToSend = {
    pin,
    state
  };

  //var obj = '{"pin" :"' + pin + '", "state" : "' + state + '"}';
  var jsonString = JSON.stringify(objectToSend);
  var contentLength = Buffer.byteLength(jsonString, 'utf8');

  console.log(jsonString);
  console.log('contentLength: ' + contentLength.toString());
  request.post({
    url: Url,
    form: jsonString,
     headers: {
       'Content-Type' : 'application/json',
       'Content-Length' : contentLength
     }
  },(err, response, body) => {
    console.log(body);
    res.status(200).send(body);
  })

})

app.get('/testing', (req, res) => {

  nodeMCU.findOne({
    mac_address: "5C:CF:7F:8C:11:9B",
    switches: {
      $elemMatch: {id: 1}
    }
  }).then((node) => {
    res.status(200).send(JSON.stringify(node));
  }).catch(err => {console.log(err);})

})

app.post('/setupApp', (req, res) => {

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

});

app.post('/setupApp2', (req, res) => {

  nodeMCU.find({}).then((doc) => {

    if(!doc){return new Promise.reject("!doc");}
    var stringToSend = JSON.stringify(doc);

    console.log('Sending: ' + stringToSend);

    res.status(200).send(stringToSend);

  }).catch((err) => {console.log(err);})

})

app.post('/setupNodeMCU', (req, res) => {

  if(!req.body){
    console.log('Body empty');
    res.status(400).send('Body empty');
  }
  else{
    console.log(JSON.stringify(req.body));
    var nodemcu =  new nodeMCU(_.pick(req.body, ['mac_address', 'ip', 'name', 'typeOfDevice','area', 'switches']));

    var lightsArray = req.body.switches;
    var mac_address = req.body.mac_address;
    console.log('Lights array', lightsArray);

    nodeMCU.findOne({mac_address: req.body.mac_address}).then((data) => {
      if(!data){
        console.log('No node mcu with this mac address found: ', req.body.mac_address);
        nodemcu.save().then(() => {
          saveLights(lightsArray, mac_address, res);
          res.status(200).send(successResponse);
        })
        return;
      }
      if(req.body.changeInLights){
        saveLights(lightsArray, mac_address, res);
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

})

app.post('/returnLightsForArea', (req, res) => {

  var area = req.body.area;
  console.log("Area recieved: " + area);

  nodeMCU.find({area}).then((doc) => {

    console.log("Document recieved: " + JSON.stringify(doc));

    if(!doc){ return new Promise.reject("Document returned is empty or null"); }

    var holderArray = [];

    //console.log(JSON.stringify(doc[0].switches));

    for(var i = 0; i < doc.length; i++){

      holderArray = holderArray.concat(doc[i].switches);

    }
    console.log("\n Sending the array for area: " + area + "Array: " + holderArray );



    res.status(200).send(JSON.stringify(holderArray));

  }).catch((err) => {
    console.log("Error on return lights for area: " + err );
    res.status(400).send(err);
  })


})

app.post('/switchLight', (req, res) => {

  var recievedLight = req.body;

  // We need: ip address, pin , state

  console.log('Light recieved' + JSON.stringify(recievedLight));

  nodeMCU.findOne({mac_address: recievedLight.mac_address}).then((doc) => {

    if(!doc){return new Promise.reject('no document recieved');}
    else{

        var index = recievedLight.id -1;
        var wantedLightObject = doc.switches[index];
        var pin = wantedLightObject.pin;
        var state = ((wantedLightObject.state == 0)? 1 : 0);

        var objectToSend = {
          pin, state
        }

        var jsonString = JSON.stringify(objectToSend);
        var contentLength = Buffer.byteLength(jsonString, 'utf8');

        request.post({
          url: Url,
          form: jsonString,
          headers: {
            'Content-Type' : 'application/json',
            'Content-Length' : contentLength
          }
        }, (error, response, body) => {
          console.log(body);
          res.status(200).send(body);

          if(body == "OK"){

            doc.switches[index].state = state;
            doc.save().then((newLight) => {

              console.log(newLight);

            }).catch((err) => {console.log(err);});

          }

        })



    }

  }).catch((err) => {
    console.log(err);
  })


})

app.get('/home', (req, res) => {
  res.send("Hello world");
})

app.post('/test', (req, res) => {
  console.log(req.body);
  if(req.body){
    res.status(200).send();
  }
  else{
    res.status(400).send();
  }
})

app.post('/testOnline', (req, res) => {

  var ip = req.body.ip;

  var url = 'http://' + ip + '/random'

  console.log("url: " + url);

  request.post({
    url,
    form: '{"hola" : "hola"}',
    headers:{
      'Content-Type' : 'application/json',
      'Content-Length' : contentLength
    }
  })


})

app.listen(port || 3000, () => {
  console.log('Server started at:' + (port || 3000));
})
