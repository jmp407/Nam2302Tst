//  Can this call and handle a number of interface scripts?
var srvrhndlr = require('./FormServerHandler.js');
console.log(srvrhndlr);

var cp = require('child_process'); // This might allow coder to call a js as root
// The following calls sub.js which sends a message back
var n = cp.fork(__dirname + '/sub.js');  // Does this sub require the am2302 js?
// get the temperature and humidity via a child message
// and then kill the process
n.on('message', function(m) {
//  console.log('PARENT got message:', m);
  DhObj = m;
  console.log(m);
  n.kill('SIGHUP');  //May want to leave this open for taking a input from the setpoint form.
});
