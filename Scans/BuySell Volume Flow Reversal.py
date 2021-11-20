# Original author: Unknown
# Modified by 7of9

declare lower;

#Inputs

input UnusualVolumePercent = 200;
input LongTermOverallVolAvgLength = 50;
input LastXPeriodAvgLength = 30; #if period is day then it is 30 days by default
input ShortTermBuySellVolAvgLength = 5;

#input VolBandAdjustment = 3;
#plot baseLine = VolBandAdjustment * volume;
#baseline.SetDefaultColor(Color.BLACK);

def O = open;
def H = high;
def C = close;
def L = low;
def V = volume;
def buying = V*(C-L)/(H-L);
def selling = V*(H-C)/(H-L);

def SellAvg = MovingAverage(AverageType.SimPLE, selling, ShortTermBuySellVolAvgLength) * -1;

def BuyAvg = MovingAverage(AverageType.SimPLE, volume - selling, ShortTermBuySellVolAvgLength);

def BuySellVolFlow = SellAvg + BuyAvg;

input type = { default SMP, EXP } ;
input hotPct = 1.0 ;

def ma =
if type == type.SMP then
SimpleMovingAvg(volume, LongTermOverallVolAvgLength)
else
MovAvgExponential(volume, LongTermOverallVolAvgLength);

def hvS = if selling / volume > 0.5 and 100 * ((volume / ma) - 1) >= hotPct then -1 else 0;
def hvB = if selling / volume <= 0.5 and 100 * ((volume / ma) - 1) >= hotPct then 1 else 0;

def hvCntAvg = Average(hvS + hvB, 10);

plot scan = hvCntAvg > 0 and BuySellVolFlow crosses above 0
#BuySellVolFlow[2] < 0 and (BuySellVolFlow[2] / BuySellVolFlow > 15 or BuySellVolFlow > 0) 
;