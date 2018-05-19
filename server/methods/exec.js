const request = require('request');

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


var sendPostRequest = (jsonObject, ip, path, done) => {

  var url = 'http://' + ip + path;
  var jsonString = JSON.stringify(jsonObject);
  var contentLength = Buffer.byteLength(jsonString, 'utf8');

  request.post({
    url,
    form: jsonString,
    timeout: 1000,
    headers: {
      'Content-Type' : 'application/json',
      'Content-Length' : contentLength
    }
  }, (error, response, body) => {
      console.log(body);

      done(body);

      if(body == 'OK'){
        return true;
      }
      else{
        return false;
      }

  });

}


module.exports = {
  saveLights,
  sendPostRequest
}
