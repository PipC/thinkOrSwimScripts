#Title: Stochastic_SchaffTrendCycle
input over_bought = 80.0;
input over_sold = 20.0;
input percentDLength = 3;
input percentKLength = 14;
input smoothK = 3;

input shift = 1; #1 days before

def min_low = Lowest(low[shift], percentKLength);
def max_high = Highest(high[shift], percentKLength);
def stoch = 100 * (close[shift] - Lowest(low[shift], percentKLength)) / (Highest(high[shift], percentKLength) - Lowest(low[shift], percentKLength));

def SMI = Average(stoch, smoothK);
def AvgSMI = Average(SMI, percentDLength);

def xUp = if SMI crosses above AvgSMI and SMI < 30 then AvgSMI else  Double.NaN;
#def xDn = if SMI crosses below AvgSMI and SMI > 70 then AvgSMI else  Double.NaN;

input fastLengthWave = 12;
input slowLengthWave = 26;
input KPeriodWave = 9;
input DPeriodWave = 2;

input averageTypeWave = AverageType.EXPONENTIAL;

def macdWave = MovingAverage(averageTypeWave, close[shift], fastLengthWave) - MovingAverage(averageTypeWave, close[shift], slowLengthWave);
def fastK1Wave = FastKCustom(macdWave, KPeriodWave);
def fastD1Wave = MovingAverage(averageTypeWave, fastK1Wave, DPeriodWave);
def fastK2Wave = FastKCustom(fastD1Wave, KPeriodWave);
def STCWave = MovingAverage(averageTypeWave, fastK2Wave, DPeriodWave);

plot scan = #STCWave > STCWave[1] and SMI > SMI[1] and AvgSMI > AvgSMI[1]
 ( SMI crosses above AvgSMI  or STCWave crosses above SMI )
# STCWave crosses above SMI
#and STCWave > STCWave[1]
and MovingAverage(averageType.SIMPLE, STCWave, 3) < over_sold 
and MovingAverage(averageType.SIMPLE, SMI, 3) < over_sold
and MovingAverage(averageType.SIMPLE, AvgSMI, 3) < over_sold
and close > close[1] and close[1] > close[2] and close[2] > close[3]
;
