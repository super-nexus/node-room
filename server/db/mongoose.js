const mongoose = require('mongoose');

//'mongodb://andrija:buva11@ds145438.mlab.com:45438/room' ||

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Room', {
});

module.exports = {mongoose};
