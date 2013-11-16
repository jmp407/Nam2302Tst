var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);

//rl.setPrompt('Sp> ');
rl.question('Enter a new 3 digit (1 decimal) set point: ', function(answer) {
  SetPoint = answer
  console.log('The new set point is ' + SetPoint + 'dF');
});
/*
rl.on('line', function(line) {
  switch(line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log('Say what? I might have heard `' + line.trim() + '`');
      break;
  }
  rl.prompt();
  
})
*/
rl.on('close', function() {
  console.log('Have a great day!  set point'+ answer);
  process.exit(0);
});
