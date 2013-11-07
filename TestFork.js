var cp = require('child_process');

var n = cp.fork(__dirname + '/sub.js');

console.log('PID ' + n.pid);

n.on('message', function(m) {
  console.log('PARENT got message:', m);
  n.kill('SIGHUP');
});

n.send({ hello: 'world' });
