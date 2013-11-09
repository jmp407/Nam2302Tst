//
//Single PID
//Init
var ReadTime= new Date(),LastRdTime =ReadTime, DelTime=ReadTime-LastRdTime;

var tdel = 6000;
var IntTimeStep = 300*tdel;//Times 300 is 1800 sec
var SetPoint=72.5, FeedBack=72.5, FdBkAvg=72.5;//SetPoint-1;//Temperature in F
var StPtAvg=SetPoint;
//Start at zero
var LstPidErr=0, PidErr=SetPoint-FeedBack;//
var IntErr=PidErr;//Int Err is averaged and times the delta time
var DerErr=PidErr;//use the 5 min avg for Der

//  A node.js script to read the humidity and temperature
//  Need to add a calc to change Rh and temp to dew point or lbmH2O/lbmDryAir.
//  Need to call PID script
//  Added Date/Time to h and t Read

var http = require('http');
var cp = require('child_process');
var am2302 = require('am2302');
//var tdel = 6000;
var MyCndInt=setInterval(myConditions, tdel);
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
  ReadTime= new Date();
  //this will repeat every tdel milliseconds
// Fork the process to read the meter
var n = cp.fork(__dirname + '/sub.js');
// get the temperature and humidity via a child message
// and then kill the process
n.on('message', function(m) {
//  console.log('PARENT got message:', m);
  DhObj = m;
  console.log(m);
  n.kill('SIGHUP');
});
// DhObj=am2302.read(7);
 var d = new Date();
    var ms = d.getMilliseconds();
 //   console.log(d,ms);
 var dtime = d + ms;
 console.log(dtime);
    
 h=DhObj.h;//.toPrecision(4);
 t=32+1.8*DhObj.t;//.toPrecision(4)*9/5+32;
 FeedBack = t;
 DelTime=ReadTime-LastRdTime;
 LastRdTime =ReadTime;
 // 3 min running average for Feedback and SetPoint.
 FdBkAvg=FdBkAvg+(FeedBack-FdBkAvg)*(DelTime/180000);
 StPtAvg=StPtAvg+(SetPoint-StPtAvg)*(DelTime/180000);
 
 PID();//how do I call this function
 Hum = h;
 HumAvg1m = HumAvg1m + (h - HumAvg1m)/(60000/tdel);
 HumAvg5m = HumAvg5m + (h - HumAvg5m)/(5*60000/tdel);
 HumAvg15m = HumAvg15m + (h - HumAvg15m)/(15*60000/tdel);
 Temp = t;
 TempAvg1m = TempAvg1m + (t - TempAvg1m)/(60000/tdel);
 TempAvg5m = TempAvg5m + (t - TempAvg5m)/(5*60000/tdel);
 TempAvg15m = TempAvg15m + (t - TempAvg15m)/(15*60000/tdel);
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
console.log(ReadTime);
console.log(LastRdTime);
console.log(DelTime);
console.log(FeedBack.toPrecision(4)+' '+FdBkAvg.toPrecision(4)+' '+StPtAvg.toPrecision(4));
console.log(PidErr);
console.log(IntErr);
console.log(DerErr);

}    
//function for PID calc
function PID () {
    LstPidErr = PidErr;
//    PidErr =SetPoint - FeedBack;
    PidErr = StPtAvg - FdBkAvg;
    IntErr = IntErr +((PidErr+LstPidErr)/2)*DelTime/IntTimeStep;// one to start
//may want to take a running avg of DerErr
    DerErr = (PidErr-LstPidErr)/DelTime;
}
/*
document.getElementById("ReadTime").innerHTML=ReadTime;
document.getElementById("LastRdTime").innerHTML=LastRdTime;
document.getElementById("DelTime").innerHTML=DelTime;
document.getElementById("FeedBack").innerHTML=FeedBack;
document.getElementById("PidErr").innerHTML=PidErr;
document.getElementById("IntErr").innerHTML=IntErr;
document.getElementById("IntErr").innerHTML=IntErr;
*/
