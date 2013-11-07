//  A node.js script to read the humidity and temperature
//  Need to add a calc to change Rh and temp to dew point or lbmH2O/lbmDryAir.
//  Need to call PID script
//  Added Date/Time to h and t Read

var http = require('http');
var cp = require('child_process');
//var am2302 = require('am2302');
var MyCndInt=setInterval(myConditions, 5000);
var DhObj=am2302.read(7);
//var DhObj={ h: 58.233, t: 23.80067 };
var i=1;
var h=DhObj.h;//.toPrecision(4);
var t=32+1.8*DhObj.t;//.toPrecision(4)*9/5+32;
//var h=50;
//var t=70;
//var DhObj=null;
var Hum = h;
var HumAvg1m = h;
var HumAvg5m = h;
var HumAvg15m = h;
var Temp = t;
var TempAvg1m = t;
var TempAvg5m = t;
var TempAvg15m = t;
var DhTxt="humidity and temperature"
var txHum;
var txHumAvg1m;
var txHumAvg5m;
var txHumAvg15m;
var txTemp;
var txTempAvg1m;
var txTempAvg5m;
var txTempAvg15m;
function myConditions()
{
  //this will repeat every 5 seconds
// Fork the process to read the meter
var n = cp.fork(__dirname + '/sub.js');
// find the process and print it's ID
//console.log('PID ' + n.pid);
// get the temperature and humidity via a child message
// and then kill the process
n.on('message', function(m) {
//  console.log('PARENT got message:', m);
  DhObj = m;
  n.kill('SIGHUP');
});
// DhObj=am2302.read(7);
 var d = new Date();
    var ms = d.getMilliseconds();
 //   console.log(d,ms);
     dtime = d + ms;
 console.log(dtime);
    
 h=DhObj.h;//.toPrecision(4);
 t=32+1.8*DhObj.t;//.toPrecision(4)*9/5+32;
 Hum = h;
 HumAvg1m = HumAvg1m + (h - HumAvg1m)/20;
 HumAvg5m = HumAvg5m + (h - HumAvg5m)/100;
 HumAvg15m = HumAvg15m + (h - HumAvg15m)/300;
 Temp = t;
 TempAvg1m = TempAvg1m + (t - TempAvg1m)/20;
 TempAvg5m = TempAvg5m + (t - TempAvg5m)/100;
 TempAvg15m = TempAvg15m + (t - TempAvg15m)/300;
 txHum="The humidity is: "+ h.toPrecision(4)+"</br>";
 txTemp="The temperature is: " + t.toPrecision(4)+"</br>";
//console.log(DhObj);
 DhTxt=JSON.stringify(DhObj)+" "+i;
//console.log(DhTxt);
    txHumAvg1m = "One  minute humidity average: " + HumAvg1m.toPrecision(4)+"</br>";
    txHumAvg5m = "Five minute humidity average: " + HumAvg5m.toPrecision(4)+"</br>";
   txHumAvg15m = "Fifteen min humidity average: " + HumAvg15m.toPrecision(4)+"</br>";
 
    txTempAvg1m = "One  minute temperature average: " + TempAvg1m.toPrecision(4)+"</br>";
    txTempAvg5m = "Five minute temperature average: " + TempAvg5m.toPrecision(4)+"</br>";
    txTempAvg15m ="Fifteen min temperature average: " + TempAvg15m.toPrecision(4)+"</br>";

  //you can reset counter here
  if (i>4000){clearInterval(MyCndInt)}; //Write a routine to kill and respawn the process after x loops
  i++ ;
}
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var Reld ="<script> setTimeout(function(){location.reload()}, 5000); </script>"

  res.write(Reld);
  //console.log(DhObj," ",i);
  DhTxt = dtime + "</br>";
  res.write(DhTxt);
  res.write(txHum);
  res.write(txHumAvg1m);
  res.write(txHumAvg5m);
  res.write(txHumAvg15m);
  res.write(txTemp);
  res.write(txTempAvg1m);
  res.write(txTempAvg5m);
  res.write(txTempAvg15m);
//  res.end(JSON.stringify(DhObj));
}).listen(8337, '10.0.0.4', Lcallback);
function Lcallback(){console.log('Server running at http://10.0.0.4:8337/')}
