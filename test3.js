var am2302 = require('am2302');
var i=1;
var items = [];
var newItem = new item("humidity",100);
items.push(newItem);

// a function to build each column value pair

function item(description, Svalue) {
    this.Description = description;
    this.Svalue = Svalue;
}
exports.get_routes = [
    { path:'/getItems', handler: 'getItems'}
];
var MyCndInt=setInterval(myConditions, 5000);

function myConditions()
{
  //this will repeat every 5 seconds

//console.time('am2302');
//console.timeEnd('am2302');
var DhObj=am2302.read(7);
console.dir(DhObj);

  //you can reset counter here
  if (i>2){clearInterval(MyCndInt)}
  i++ ;
}
var DhTxt=JSON.stringify('DhObj');
console.dir(DhTxt);

