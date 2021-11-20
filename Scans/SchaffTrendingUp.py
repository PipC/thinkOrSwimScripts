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
input averageTypeTrend = AverageType.EXPONENTIAL;
input fastLengthWave = 12;
input slowLengthWave = 26;
input KPeriodWave = 9;
input DPeriodWave = 2;
input over_bought = 75;
input over_sold = 25;
input averageTypeWave = AverageType.EXPONENTIAL;

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
plot scan = STCWave > STCWave[1] and STCWave < 75 and STCTrend > STCTrend[1] and STCTrend < 75;