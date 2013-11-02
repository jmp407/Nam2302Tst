var http = require('http')
var am2302 = require('am2302');
var MyCndInt=setInterval(myConditions, 5000);
var i=1;
function myConditions()
{
  //this will repeat every 5 seconds

 DhObj=am2302.read(7);
//console.log(DhObj);
 DhTxt=JSON.stringify(DhObj)+JSON.stringify(" ",i);
//console.log(DhTxt);
  //you can reset counter here
//  if (i>200){clearInterval(MyCndInt)};
  i++ ;
}
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  console.log(DhObj," ",i);
  res.end(DhTxt);
}).listen(8337, '10.0.0.4', Lcallback);
function Lcallback(){console.log('Server running at http://10.0.0.4:8337/')}
