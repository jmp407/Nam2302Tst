var cp = require('child_process');
// Fork the process to read the meter
var n = cp.fork(__dirname + '/sub.js');
// find the process and print it's ID
console.log('PID ' + n.pid);
// get the temperature and humidity via a child message
// and then kill the process
n.on('message', function(m) {
  console.log('PARENT got message:', m);
  n.kill('SIGHUP');
});
// somewhere along the way, send the child a message.
n.send({ hello: 'world' });
