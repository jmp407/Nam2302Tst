var am2302 = require('am2302');
var i=1;
var items = [];
var newItem = new item("humidity",100);
//items.push(newItem);

// a function to build each column value pair
// is it needed?
function item(Description, Svalue) {
    this.Description = Description;
    this.Svalue = Svalue;
}
exports.get_routes = [
    { path:'/getItems', handler: 'getItems'}
];
// Start of a asyncronous group of instructions
var MyCndInt=setInterval(myConditions, 5000);
function myConditions()
{
  //this will repeat every 5 seconds

//console.time('am2302');
//console.timeEnd('am2302');
var DhObj=am2302.read(7);
console.dir(DhObj);
items.push(new item("humidity",DhObj.h.toPrecision(4)));
items.push(new item("temp",DhObj.t.toPrecision(4)*9/5+32));
  //you can reset counter here
  if (i>2){clearInterval(MyCndInt);
	console.dir(items);}
  i++ ;
//console.dir(items);
} // end of the instruction group
//console.dir(items);
//var DhTxt=JSON.stringify(items);
//console.dir(DhTxt);

