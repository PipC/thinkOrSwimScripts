#Chandelier Volatility Trailing Stop

#SparkyFlary

#Code taken and re-edited to thinkorswim from pipCharlie, who got it from LazyBear
#https://www.tradingview.com/script/mjBdRGXe-Chandelier-Stop/

input AtrMult = 3.5;
input ATRlength = 20; #20 days range
input lookbackLength = 22;
input highestHigh = high;
input lowestLow = low;
input AvgType = AverageType.WILDERS;
input PaintBars = no;

def ATR = MovingAverage(AvgType, TrueRange(high, close, low), ATRlength);
def longstop = Highest(highestHigh,lookbackLength)-AtrMult*atr;
def shortstop = Lowest(lowestLow,lookbackLength)+AtrMult*atr;

def shortvs = if isNaN(shortvs[1]) then shortstop else if close>shortvs[1] then shortstop else min(shortstop,shortvs[1]);
def longvs = if isNaN(longvs[1]) then longstop else if close<longvs[1] then longstop else max(longstop,longvs[1]);

def longswitch= if close>=shortvs[1] and close[1]<shortvs[1] then 1 else 0;
def shortswitch = if close<=longvs[1] and close[1]>longvs[1] then 1 else 0;

def direction = if isNaN(direction[1]) then 0 else if direction[1]<=0 and longswitch then 1 else if direction[1]>=0 and shortswitch then -1 else direction[1];
          
def pc = if direction>0 then longvs else shortvs;

plot VolatilityStop = pc;
VolatilityStop.AssignValueColor(if direction < 0 then Color.RED else Color.GREEN);
AssignPriceColor(if PaintBars and direction < 0
                 then Color.RED
                 else if PaintBars and direction > 0
                      then Color.GREEN
                      else Color.CURRENT);

