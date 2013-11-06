// New file for testing
var spawn = require('child_process').spawn,
    grep = spawn('grep', ['ssh']);//,    Snode;
//    SnodeJsChld = cp.spawn('sudo /opt/node/bin/node /home/coder/node_modules/am2302/test.js');
console.log('Spawned child pid: ' + grep.pid);
grep.on('close',function (code, signal) {
console.log('child process terminated due to receipt of signal '+ signal);
});
// send SIGHUP to process
grep.kill('SIGHUP');

//grep.stdin.end();
