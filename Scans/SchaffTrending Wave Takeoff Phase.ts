#STSW = Schaff Trend Line and Schaff Wave Line
#Schaff Trend Line = Used for quick up/down trend declaration
#Schaff Wave Line = Trade Wave in the direction of trend as
#declared by Trend Line.
#Schaff Wave Line can be used alone to enter trend
#declared by the MACD.
#Schaff Wave can be used with the EMA for signals
#https://usethinkscript.com/threads/a-trend-momentum-and-cycle-trading-system-v3-0-csa.1596/page-9

input fastLengthTrend = 48;
input slowLengthTrend = 104;
input KPeriodTrend = 36;
input DPeriodTrend = 8;
input fastLengthWave = 12;
input slowLengthWave = 26;
input KPeriodWave = 9;
input DPeriodWave = 2;
input over_bought = 75;
input over_sold = 25;
input averageTypeWave = AverageType.EXPONENTIAL;
input averageTypeTrend = AverageType.EXPONENTIAL;

def macdTrend = MovingAverage(averageTypeTrend, close, fastLengthTrend) - MovingAverage(averageTypeTrend, close, slowLengthTrend);
def macdWave = MovingAverage(averageTypeWave, close, fastLengthWave) - MovingAverage(averageTypeWave, close, slowLengthWave);
def fastK1Trend = FastKCustom(macdTrend, KPeriodTrend);
def fastK1Wave = FastKCustom(macdWave, KPeriodWave);
def fastD1Trend = MovingAverage(averageTypeTrend, fastK1Trend, DPeriodTrend);
def fastD1Wave = MovingAverage(averageTypeWave, fastK1Wave, DPeriodWave);
def fastK2Trend = FastKCustom(fastD1Trend, KPeriodTrend);
def fastK2Wave = FastKCustom(fastD1Wave, KPeriodWave);
def STCTrend = MovingAverage(averageTypeTrend, fastK2Trend, DPeriodTrend);
def STCWave = MovingAverage(averageTypeWave, fastK2Wave, DPeriodWave);

#STCWave.AssignValueColor(if STCWave >= over_bought + 20 then Color.MAGENTA else 
#    if STCWave <= over_sold - 20 then Color.CYAN else 
#    if STCWave < STCWave[1] then Color.MAGENTA else Color.CYAN);

def STCWaveResult = if STCWave >= over_bought + 20 then -1 else 
    if STCWave <= over_sold - 20 then 1 else 
    if STCWave < STCWave[1] then -1 else 1;

plot scan = STCWaveResult[4] < 0 and STCWaveResult > 0 
and STCWave > STCWave[1]
and STCWave <= over_sold + 8         
and MovingAverage(AverageType.Simple , STCWave, 4) < over_sold + 8
#and STCWaveResult[1] > 0 
#and STCWaveResult[2] > 0
#and STCWaveResult[3] > 0
;

#plot scan = (STCWave > STCWave[1] and STCWave < 75 and
#            STCTrend > STCTrend[1] and STCTrend < 75) #Both up
#        or (STCWave > STCWave[1] and STCWave < 40 and STCTrend < 30) #Wave up and low trend
#        or (STCTrend > STCTrend[1] and STCTrend < 30)  #Trend up from beginning
#        or (STCTrend > STCTrend[1] and STCTrend[1] < STCTrend[2]) #Just changed trend from down to up
#; 