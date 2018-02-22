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


module.exports = {
  saveLights
}
