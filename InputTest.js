var MyCndInt=setInterval(myLogTest, 10000);

var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);
//
rl.on('line', function() {
//
    rl.question('Enter a new 3 digit (1 decimal) set point: ', function(answer) {
    var SetPoint = answer;
    console.log('The new set point is ' + SetPoint + ' dF');
//    rl.prompt();
    });
});  
rl.on('close', function() {
  console.log('Have a great day! ');
  process.exit(0);
});
function myLogTest(){
    console.log('it works '+ new Date());
};
