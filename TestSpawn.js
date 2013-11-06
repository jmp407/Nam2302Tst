// New file for testing
var spawn = require('child_process').spawn,
    grep = spawn('grep', ['ssh']);//,    Snode;
//    SnodeJsChld = cp.spawn('sudo /opt/node/bin/node /home/coder/node_modules/am2302/test.js');
console.log('Spawned child pid: ' + grep.pid);
grep.stdin.end();
