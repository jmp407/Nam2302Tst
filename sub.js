var am2302 = require('./');
console.time('am2302');
var tAndh = am2302.read(7) ;
console.dir(tAndh);
console.timeEnd('am2302');
process.on('message', function(m) {
  console.log('CHILD got message:', m);
});

process.send(tAndh);
