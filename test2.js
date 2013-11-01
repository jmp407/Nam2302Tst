var am2302 = require('am2302');
var i=1;
var MyCndInt=setInterval(myConditions, 5000);
function myConditions()
{
  //this will repeat every 5 seconds

//console.time('am2302');
console.dir(am2302.read(7));
//console.timeEnd('am2302');
  //you can reset counter here
  if (i>500){clearInterval(MyCndInt)}
  i++ ;
}

