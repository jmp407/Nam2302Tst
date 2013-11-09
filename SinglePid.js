//
//Single PID
//Init
var ReadTime= new Date(),LastRdTime =ReadTime, DelTime=ReadTime-LastRdTime;

var tdel = 6000
var IntTimeStep = tdel;//is this 1 minute or millisecond?
var SetPoint=75, FeedBack=SetPoint-1;//Temperature in F
//Start at zero
var LstPidErr=0, PidErr=SetPoint-FeedBack;//
var IntErr=PidErr;//Int Err is averaged and times the delta time
var DerErr=PidErr;//use the 5 min avg for Der


var MyCndInt=setInterval(myConditions, tdel);

//function for PID calc?
function PID () {
    LstPidErr = PidErr;
    PidErr =SetPoint - FeedBack;
    IntErr = IntErr +(PidErr+LstPidErr)*DelTime/IntTimeStep;// one to start
//may want to take a running avg of DerErr
    DerErr = (PidErr-LstPidErr)/DelTime;
}
console.log(ReadTime);
console.log(LastRdTime);
console.log(DelTime);
console.log(FeedBack);
console.log(PidErr);
console.log(IntErr);
console.log(DerErr);
/*
document.getElementById("ReadTime").innerHTML=ReadTime;
document.getElementById("LastRdTime").innerHTML=LastRdTime;
document.getElementById("DelTime").innerHTML=DelTime;
document.getElementById("FeedBack").innerHTML=FeedBack;
document.getElementById("PidErr").innerHTML=PidErr;
document.getElementById("IntErr").innerHTML=IntErr;
document.getElementById("IntErr").innerHTML=IntErr;
*/
