//get ready to read the temperature and humidity
var am2302 = require('./');
// read the data and measure how long it takes
console.time('am2302');
var tAndh = am2302.read(7) ;
console.dir(tAndh);
console.timeEnd('am2302');
process.on('message', function(m) {
  console.log('CHILD got message:', m);
});
// send the temp and hum back to Mom
process.send(tAndh);
