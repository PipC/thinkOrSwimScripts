
#######################
# SlimRibbonATR
# SlimRibbon study with ATR
# Author: Eddielee394
# Version: 0.3
# inspired by SlimRibbon by Slim Miller and further customized by Markos 
#######################
SetChartType(ChartType.CANDLE_TREND);

input price = close;
input superfast_length = 8;
input fast_length = 13;
input slow_length = 21;
input displace = 0;
input enableAlerts = no;
#hint enableAlerts: disables all alerts
input hideMovingAverages = yes;
#hint hideMovingAverages: hides all the moving average lines from the slimRibbon
input atrMult = 1.0;
#hint atrMult: increases the sensitivity of the ATR line.  Best settings for the following timeframes:  5m:  1.0,  15m: 1.2, 30m: 1.4
input nATR = 3; 
#hint nATR: 
input avgType = AverageType.HULL;
input tradesize = 1;

def ATR = MovingAverage(avgType, TrueRange(high, close, low), nATR);
def UP = HL2 + (atrMult * ATR);
def DN = HL2 + (-atrMult * ATR);
def ST = if close < ST[1] then UP else DN;

def SuperTrend = ST;

def SuperTrendUP = if ST crosses below close[-1] then 1 else 0;
def isSuperTrendUP = SuperTrend > close;
def SuperTrendDN = if ST crosses above close[-1] then 1 else 0;
def isSuperTrendDN = SuperTrend < close;

#moving averages
def mov_avg8 = ExpAverage(price[-displace], superfast_length);
def mov_avg13 = ExpAverage(price[-displace], fast_length);
def mov_avg21 = ExpAverage(price[-displace], slow_length);

#def Superfast = mov_avg8;

#def Fast = mov_avg13;

#def Slow = mov_avg21;


def buy = mov_avg8 > mov_avg13 and mov_avg13 > mov_avg21 and low > mov_avg8;
def stopbuy = mov_avg8 <= mov_avg13;
def buynow = !buy[1] and buy;

def buysignal = CompoundValue(1, if buynow and !stopbuy then 1 else if buysignal[1] == 1 and stopbuy then 0 else buysignal[1], 0);

def Buy_Signal = buysignal[1] == 0 and buysignal == 1;

plot scan = Buy_Signal;

#def Momentum_Down = buysignal[1] == 1 and buysignal == 0;

#def sell = mov_avg8 < mov_avg13 and mov_avg13 < mov_avg21 and high < mov_avg8;
#def stopsell = mov_avg8 >= mov_avg13;
#def sellnow = !sell[1] and sell;
#def sellsignal = CompoundValue(1, if sellnow and !stopsell then 1 else if sellsignal[1] == 1 and stopsell then 0 else sellsignal[1], 0);

#plot Sell_Signal = sellsignal[1] == 0 and sellsignal;

#Orders
#def buyTrigger = Buy_Signal[-1];
#def sellTrigger = if SuperTrendDN or Sell_Signal[-1] then 1 else 0;

#plot buyTriggerPlot = if buyTrigger[1] then close else double.nan;
#plot sellTriggerPlot = if sellTrigger[1] then close else double.nan;

