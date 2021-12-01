# Original author: Unknown
# Modified by 7of9

declare lower;

#Inputs

input ShowXDayAvg = yes;
input ShowTodayVolume = yes;
input ShowPercentOfXDayAvg = yes;
input UnusualVolumePercent = 200;
input ShowXBarAvg = yes;
input ShowVolLine = yes;
input ShowCurrentBar = yes;
input ShowPercentOfXBarAvg = yes;
input ShowSellVolumePercent = yes;
input LongTermOverallVolAvgLength = 50;
input LastXPeriodAvgLength = 30; #if period is day then it is 30 days by default
input ShortTermBuySellVolAvgLength = 5;
input ShowInMirrorView = no;

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

def SellVolLine = if ShowVolLine then selling * (if ShowInMirrorView then -1 else 1) else Double.NaN;

def BuyVolLine = if ShowVolLine then volume - selling else Double.NaN;

# Selling Volume

def SellVol = selling * (if ShowInMirrorView then -1 else 1);

def SellVolPercentage = selling / volume * (if ShowInMirrorView then -1 else 1);

# Total Volume

def BuyVol = if ShowInMirrorView then (volume - selling) else volume;


def SellAvg = MovingAverage(AverageType.SimPLE, selling, ShortTermBuySellVolAvgLength) * (if ShowInMirrorView then -1 else Double.NaN);

def BuyAvg = MovingAverage(AverageType.SimPLE, volume - selling, ShortTermBuySellVolAvgLength) * (if ShowInMirrorView then 1 else Double.NaN);

def BuySellVolFlow = if ShowInMirrorView then SellAvg + BuyAvg  else Double.NaN;

#Volume Data

#def volLastXDayAvg = (volume(period = "DAY")[1] + volume(period = "DAY")[2] + volume(period = "DAY")[3] + volume(period = "DAY")[4] + volume(period = "DAY")[5] + volume(period = "DAY")[6] + volume(period = "DAY")[7] + volume(period = "DAY")[8] + volume(period = "DAY")[9] + volume(period = "DAY")[10] + volume(period = "DAY")[11] + volume(period = "DAY")[12] + volume(period = "DAY")[13] + volume(period = "DAY")[14] + volume(period = "DAY")[15] + volume(period = "DAY")[16] + volume(period = "DAY")[17] + volume(period = "DAY")[18] + volume(period = "DAY")[19] + volume(period = "DAY")[20] + volume(period = "DAY")[21] + volume(period = "DAY")[22] + volume(period = "DAY")[23] + volume(period = "DAY")[24] + volume(period = "DAY")[25] + volume(period = "DAY")[26] + volume(period = "DAY")[27] + volume(period = "DAY")[28] + volume(period = "DAY")[29] + volume(period = "DAY")[30]) / 30;

def volLastXDayAvg = Average( volume(period = GetAggregationPeriod ()), LastXPeriodAvgLength);

#def today = volume(period = "DAY");
def today = volume(period = GetAggregationPeriod ());

def percentOfXDay = Round((today / volLastXDayAvg) * 100, 0);

#def avgBars = (volume[1] + volume[2] + volume[3] + volume[4] + volume[5] + volume[6] + volume[7] + volume[8] + volume[9] + volume[10] + volume[11] + volume[12] + volume[13] + volume[14] + volume[15] + volume[16] + volume[17] + volume[18] + volume[19] + volume[20] + volume[21] + volume[22] + volume[23] + volume[24] + volume[25] + volume[26] + volume[27] + volume[28] + volume[29] + volume[30]) / 30;

def avgBars =  Average( volume, LastXPeriodAvgLength);

def curVolume = volume;
def percentOfXBar = Round((curVolume / avgBars) * 100, 0);
def SellVolPercent = Round((Selling / Volume) * 100, 0);


def VolAvg = MovingAverage(AverageType.SIMPLE, volume, LongTermOverallVolAvgLength);

#plot SellAvg = MovingAverage(AverageType.SIMPLE, selling, length);
#SellAvg.SetDefaultColor(GetColor(5));

# hiVolume indicator
# source: http://tinboot.blogspot.com
# author: allen everhart


input type = { default SMP, EXP } ;
input hotPct = 1.0 ;

def ma =
if type == type.SMP then
SimpleMovingAvg(volume, LongTermOverallVolAvgLength)
else
MovAvgExponential(volume, LongTermOverallVolAvgLength);

def hv = if 100 * ((volume / ma) - 1) >= hotPct then ma else Double.NaN;

plot scan = MovingAverage(AverageType.SIMPLE, SellVolPercent, 2) < 20 
and hv > 0 
and SimpleMovingAvg(volume, 2) / SimpleMovingAvg(volume, 50) > 0.8;