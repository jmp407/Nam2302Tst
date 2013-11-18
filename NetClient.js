var net = require('net');
var client = net.connect({port: 8124},
    function() { //'connect' listener
  console.log('client connected');
//  client.write('world!\r\n');
//  client.write('The new SetPoint has been registered.\r\n');
});
client.on('data', function(data) {
  console.log(data.toString());// this appears to be data from the server.
  //  add some code here to capture the new SetPoint
  client.write('The new SetPoint has been registered.\r\n');
  // one of these keeps repeating
  // Move the next line to another function or ???
  //client.end();
});
client.on('end', function() {
  console.log('client disconnected');// because the server disconnected
});
