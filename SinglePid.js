//
//Single PID

// Input the setpoint, just hit enter.  Then hurry.
var filAppd = require('fs');
var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout); // This just doesn't look right
//
rl.on('line', function() {
//
    rl.question('Enter a new 3 digit (1 decimal) set point: ', function(answer) {
    //process.stdin.resume(); //Does not stop stdout
    SetPoint = answer; //entering text really craps up the program calculations.  Restart required.
    console.log('The new set point is ' + SetPoint + ' dF');
//    rl.prompt();
    });
});  
rl.on('close', function() {
  console.log('Have a great day! ');
  process.exit(0);
});
//Init
var ReadTime= new Date(),LastRdTime =ReadTime, DelTime=ReadTime-LastRdTime;
var SPinit=71.94;//69.7;
//var tdel = 6000 is the time ms between h and t readings from the DHT22;
var tdel = 6000;
// 1.5 min running average for Feedback and SetPoint.  About 15 readings
var RavgDel = 15 * tdel; 
var deadbnd = .1; // for the plant development.  Need a input routine/form.
var turn = 'off'; // start up with the plant off
var SetPoint=SPinit, FeedBack=SPinit, FdBkAvg=SPinit;//SetPoint-1;//Temperature in F
var StPtAvg=SetPoint;
//Start at zero
var LstPidErr=0, PidErr=SetPoint-FeedBack;// Need a P gain for TotErr calc
var Kp = 2.67; // this will create an output (TotErr) of 1 at .1 PidErr
var IntErr=PidErr;//Int Err is averaged and times the delta time
var Ir = 0.8;// resets/min approx = DelTime/IntTimeStep
var IntTimeStep = 60000;// 1 min in ms
//tdel/Ir;//=100*tdel;//Times 300 is 1800 sec
var DerErr=PidErr;//use the 5 min avg for Der
var Dr = 0.2;// minutes
var TotErr=(Kp * PidErr) + IntErr + DerErr;//Simple sum of errors for this controller

//  A node.js script to read the humidity and temperature
//  Need to add a calc to change Rh and temp to dew point or lbmH2O/lbmDryAir.
//  Need to call PID script
//  Added Date/Time to h and t Read
// The next three lines could use some work
var http = require('http'); // May not need this for the socket communication
var cp = require('child_process'); // This might allow coder to call a js as root
var am2302 = require('am2302'); // Then this would be a in another js
//var tdel = 6000;
var MyCndInt=setInterval(myConditions, tdel);
var DhObj=am2302.read(7); // This initialization is requiring am2302 above
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
function myConditions()   //this will repeat every tdel milliseconds
{
  ReadTime= new Date();

// Fork the process to read the meter
var n = cp.fork(__dirname + '/sub.js');  // Does this sup require the am2302 js?
// get the temperature and humidity via a child message
// and then kill the process
n.on('message', function(m) {
//  console.log('PARENT got message:', m);
  DhObj = m;
//  console.log(m);
  n.kill('SIGHUP');
});
// DhObj=am2302.read(7);
 var d = new Date();
    var ms = d.getMilliseconds();
 //   console.log(d,ms);
 var dtime = d + ms;
 //console.log(dtime);
    
 h=DhObj.h;//.toPrecision(4);
 t=32+1.8*DhObj.t;//.toPrecision(4)*9/5+32;
 FeedBack = t;
 DelTime=ReadTime-LastRdTime;
 LastRdTime = ReadTime;
 // 3 min running average for Feedback and SetPoint.
 FdBkAvg=FdBkAvg+(FeedBack-FdBkAvg)*(DelTime/RavgDel);
 StPtAvg=StPtAvg+(SetPoint-StPtAvg)*(DelTime/RavgDel);
 // call the pid function
 PID();//This seems to work but should it?
 Hum = h; // format h to 5 digits after the averages.
 HumAvg1m = HumAvg1m + (h - HumAvg1m)/(60000/tdel);
 HumAvg5m = HumAvg5m + (h - HumAvg5m)/(5*60000/tdel);
 HumAvg15m = HumAvg15m + (h - HumAvg15m)/(15*60000/tdel);
 Hum = Hum.toPrecision(5); // Is this the last Hum?
 Temp = t; // format the t to 5 digits after the averages.  It is F.
 TempAvg1m = TempAvg1m + (t - TempAvg1m)/(60000/tdel);
 TempAvg5m = TempAvg5m + (t - TempAvg5m)/(5*60000/tdel);
 TempAvg15m = TempAvg15m + (t - TempAvg15m)/(15*60000/tdel);
 Temp = Temp.toPrecision(5); // ready for logging.
 txHum="The humidity is: "+ h.toPrecision(4)+"</br>"; // This was for the web page interface
 txTemp="The temperature is: " + t.toPrecision(4)+"</br>";
//console.log(DhObj);
//Need to format the h and tF and clean up the data file for spreadsheets and charting.
 DhTxt= Hum +", ";
 DhTxt = DhTxt + HumAvg1m.toPrecision(5) +", ";
 DhTxt = DhTxt + FeedBack.toPrecision(5) +", "; // for now this is only the temperature
 DhTxt = DhTxt + FdBkAvg.toPrecision(5) +", ";
 DhTxt = DhTxt + PidErr.toPrecision(5) +", ";
 DhTxt = DhTxt + IntErr.toPrecision(5) +", ";
 DhTxt = DhTxt + DerErr.toPrecision(5) +", ";
 DhTxt = DhTxt + TotErr.toPrecision(5) +", ";
 DhTxt = DhTxt + SetPoint +", ";
 DhTxt = DhTxt + StPtAvg.toPrecision(5) +", ";
 DhTxt = DhTxt + i +", ";
 DhTxt = DhTxt + ReadTime.valueOf() +", ";
 DhTxt = DhTxt + ReadTime + '\n';
 DhTxt = DhTxt.toString();
 console.log(DhTxt);
 // Here is the file logging statements
 filAppd.appendFile('htdata.txt', DhTxt, function (err) {
  if (err) throw err;
  //console.log('The "data to append" was appended to file!');
});
//console.log(DhTxt);
// This was used to create a web page later.
    txHumAvg1m = "One  minute humidity average: " + HumAvg1m.toPrecision(4)+"</br>";
    txHumAvg5m = "Five minute humidity average: " + HumAvg5m.toPrecision(4)+"</br>";
   txHumAvg15m = "Fifteen min humidity average: " + HumAvg15m.toPrecision(4)+"</br>";
 
    txTempAvg1m = "One  minute temperature average: " + TempAvg1m.toPrecision(4)+"</br>";
    txTempAvg5m = "Five minute temperature average: " + TempAvg5m.toPrecision(4)+"</br>";
    txTempAvg15m ="Fifteen min temperature average: " + TempAvg15m.toPrecision(4)+"</br>";

  //you can reset counter here
  if (i>8000){clearInterval(MyCndInt)}; //Write a routine to kill and respawn the process after x loops
  i++ ;
/*
console.log('Time between readings(milliseconds) '+ DelTime);
console.log('Temperature control with SetPoint: '+ SetPoint);
console.log(FeedBack.toPrecision(4)+' '+FdBkAvg.toPrecision(4)+' '+StPtAvg.toPrecision(4));
console.log(PidErr.toPrecision(4)+' '+IntErr.toPrecision(4)+' '+DerErr.toPrecision(4)+' '+TotErr.toPrecision(4));
console.log('Humidity control');
console.log(Hum+' '+Temp+'    '+i);
*/
// Below is an attempt to create an audio alert to signal a manual control change
// But it needs to toggle off when the change is complete and then set the new alarm flag
//    for step two in the on/off process.
if (TotErr > deadbnd && turn=='off'){ // set turn = 'on' to silence bell
    console.log('\u0007')}; // It can be annoying, this rings the system bell.
if (TotErr < (-1.0 * deadbnd) && turn=='on'){ // set turn = 'off' to silence bell
    console.log('\u0007')}; // After fixing replace the .5 with a var deadbnd

}    
// function for PID calc
function PID () {
    LstPidErr = PidErr;
//  PidErr =SetPoint - FeedBack;
    PidErr = StPtAvg - FdBkAvg;
    if (PidErr > 1) { PidErr = 1};
    if (PidErr < -1){ PidErr = -1};
    IntErr = IntErr +((PidErr+LstPidErr)/2)*DelTime/IntTimeStep;// one to start
    if (IntErr > 1) { IntErr = 1};
    if (IntErr < -1)  { IntErr = -1};
// may want to take a running avg of DerErr
    DerErr = (PidErr-LstPidErr)*IntTimeStep/DelTime;
    if (DerErr > 1)  { DerErr = 1};
    if (DerErr < -1) { DerErr = -1};
// Sum the individual items for this controller
    TotErr = (Kp * PidErr) + Ir*IntErr + Dr*DerErr;
    if (TotErr > 1)  { TotErr = 1};
    if (TotErr < -1) { TotErr = -1};
}
// How was the following working?
/*
document.getElementById("ReadTime").innerHTML=ReadTime;
document.getElementById("LastRdTime").innerHTML=LastRdTime;
document.getElementById("DelTime").innerHTML=DelTime;
document.getElementById("FeedBack").innerHTML=FeedBack;
document.getElementById("PidErr").innerHTML=PidErr;
document.getElementById("IntErr").innerHTML=IntErr;
document.getElementById("IntErr").innerHTML=IntErr;
*/
