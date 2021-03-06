//
//Init Single PID and non array vars
var ReadTime= new Date(),LastRdTime =ReadTime, DelTime=ReadTime-LastRdTime;
var TotErr=new Array (0,0);PidErr + IntErr + DerErr;//Simple sum of errors for this controller
// The vector/array version
// init
    var tdel = 6000;
    var IntTimeStep = new Array (150*tdel,300*tdel,);//Times 300 is 1800 sec h and t
    var DerTimeStp = new Array (1,1);//Time steps for D for humidity and temperature
    //var SPinit = new Array (72,50);// temperature and humidity to start but not limit
    var SetPt = new Array (50,75);// set points hsp and tsp
    var FeedBack=SetPt, FdBkAvg=SetPt;//SetPoint-1;//Temperature in F
    var StPtAvg=SetPt;
// The PID init part, 2 loops to start but not limit.
    var AvgTiming=new Array (1,3,7);// 1, 3 and 7 min averages
    var AvgHv=new Array (50,50,50);// 1, 3 and 7 min humidity averages init
    var AvgTv=new Array (72,72,72);// 1, 3 and 7 min temperature averages init.
    var PKs= new Array (1,1);//proportional gains 
    var IKs= new Array (0,0);//integral gains, may not be needed with IntTimeStep
    var DKs= new Array (0,0);//derivative gains
// errors - Ph,Pt,
    var LstPidErr=new Array(0,0), PidErr=new Array (0,0);//
// errors - Ih,It
    var IntErr = new Array(0,0);
// errors - Dh and Dt
    var DerErr = new Array(0,0);
// Get the data    
    
// Then change the units and interp the dew point.


// PID Array
// 3 min running average for Feedback and SetPoint.
    FdBkAvg=FdBkAvg+(FeedBack-FdBkAvg)*(DelTime/180000);
    StPtAvg=StPtAvg+(SetPoint-StPtAvg)*(DelTime/180000);
 
 PIDArry();//This seems to work but should it?

function PIDArry() {
// requires a for i loop
    for (var i=0;i<PidErr.length;i++)
        LstPidErr[i]=PidErr[i];
        PidErr[i] = StPtAvg[i] - FdBkAvg[i];
        if (PidErr[i] > 1) { PidErr[i] = 1};
        if (PidErr[i] < -1){ PidErr[i] = -1};
        IntErr[i] = IntErr[i] +((PidErr[i]+LstPidErr[i])/2)*DelTime/IntTimeStep;// one to start
        if (IntErr[i] > 1) { IntErr[i] = 1};
        if (IntErr[i] < -1)  { IntErr[i] = -1};
// may want to take a running avg of DerErr
        DerErr[i] = (PidErr[i]-LstPidErr[i])/DelTime;
        if (DerErr[i] > 1)  { DerErr[i] = 1};
        if (DerErr[i] < -1) { DerErr[i] = -1};
// Sum the individual items for this controller
        TotErr[i] = PidErr[i] + IntErr[i] + DerErr[i];
        if (TotErr[i] > 1)  { TotErr[i] = 1};
        if (TotErr[i] < -1) { TotErr[i] = -1};
        
}
// print it
console.log('Time between readings(milliseconds) '+ DelTime);
console.log('Temperature control');
i=1;
console.log(FeedBack[i].toPrecision(4)+' '+FdBkAvg[i].toPrecision(4)+' '+StPtAvg[i].toPrecision(4));
console.log(PidErr[i].toPrecision(4)+' '+IntErr[i].toPrecision(4)+' '+DerErr[i].toPrecision(4)+' '+TotErr[i].toPrecision(4));
console.log('Humidity control');
i=2;
console.log(FeedBack[i].toPrecision(4)+' '+FdBkAvg[i].toPrecision(4)+' '+StPtAvg[i].toPrecision(4));
console.log(PidErr[i].toPrecision(4)+' '+IntErr[i].toPrecision(4)+' '+DerErr[i].toPrecision(4)+' '+TotErr[i].toPrecision(4));
console.log();

