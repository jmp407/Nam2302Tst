var http = require('http')
var am2302 = require('am2302');
var MyCndInt=setInterval(myConditions, 5000);
var i=1;
var h=50;
var t=70;
var DhObj=null;
var DhTxt="humidity and temperature"
var txHum;
var txTemp;
function myConditions()
{
  //this will repeat every 5 seconds

 DhObj=am2302.read(7);
 h=DhObj.h;//.toPrecision(4);
 t=32+1.8*DhObj.t;//.toPrecision(4)*9/5+32;
 txHum="The humidity is: "+ h.toPrecision(4)+"\n";
 txTemp="The temperature is: " + t.toPrecision(4)+"\n";
//console.log(DhObj);
 DhTxt=JSON.stringify(DhObj)+" "+i+"\n";
//console.log(DhTxt);
  //you can reset counter here
//  if (i>200){clearInterval(MyCndInt)};
  i++ ;
}
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  response.sendDate;
  console.log(DhObj," ",i);
  res.write(DhTxt);
  res.write(txHum);
  res.write(txTemp);
  res.end(JSON.stringify(DhObj));
}).listen(8337, '10.0.0.4', Lcallback);
function Lcallback(){console.log('Server running at http://10.0.0.4:8337/')}
