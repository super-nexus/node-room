const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://andrija:buva11@ds145438.mlab.com:45438/room' || 'mongodb://localhost:27017/Room', {
});

module.exports = {mongoose};
