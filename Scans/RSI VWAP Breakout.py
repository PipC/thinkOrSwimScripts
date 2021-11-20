input length = 21;

input price = close;
input averageType = AverageType.WILDERS;
input showBreakoutSignals = yes;

def NetChgAvg = MovingAverage(averageType, price - price[1], length);
def TotChgAvg = MovingAverage(averageType, AbsValue(price - price[1]), length);
def ChgRatio = if TotChgAvg != 0 then NetChgAvg / TotChgAvg else 0;

def RSI = 50 * (ChgRatio + 1);


input BarsBetween = 0;

# calculate the offset
def lastBar = HighestAll(if !IsNaN(close) then BarNumber() else 0);
def offset = BarsBetween * ((lastBar - BarNumber()) / (BarsBetween + 1));

# build the candle
def o;
def h;
def l;
def c;

def R = RSI();


if offset % 1 == 0
then {
    o = (R + R[1]) / 2;
    h = Max(R, R[1]);
    l = Min(R, R[1]);
    c = R;
} else {
    o = Double.NaN;
    h = Double.NaN;
    l = Double.NaN;
    c = Double.NaN;
}

# just the UP candles
def UpO;
def UpH;
def UpL;
def UpC;
if o <= c
then {
    UpO = o;
    UpH = h;
    UpL = l;
    UpC = c;
} else {
    UpO = Double.NaN;
    UpH = Double.NaN;
    UpL = Double.NaN;
    UpC = Double.NaN;
}

# just the DOWN candles
def DnO;
def DnH;
def DnL;
def DnC;
if o > c
then {
    DnO = o;
    DnH = h;
    DnL = l;
    DnC = c;
} else {
    DnO = Double.NaN;
    DnH = Double.NaN;
    DnL = Double.NaN;
    DnC = Double.NaN;
}

#VM_MIDAS_StandartDeviationBands;
input tt = 2.68;

def Data = BarNumber();
input Number_Of_Bar = 1;

def bar =  Data >= Number_Of_Bar;
def pv = if bar then pv[1] + c * volume else 0;
def cumvolume = if bar then cumvolume[1] + volume else 0;
#plot vw = pv / cumvolume;

def vw = pv / cumvolume;

def bars = Data - Number_Of_Bar;
def sample = if bar then sample[1] + Sqr(c - vw) else 0;
def var = sample / bars;
def dev = Sqrt(var);#var

def dev1 =  vw + dev * 2.0;
def dev2 = vw - (dev * 2.0);

#vw.SetDefaultColor(Color.YELLOW);
#dev1.SetDefaultColor(Color.WHITE);
#dev2.SetDefaultColor(Color.WHITE);

input length2 = 10;
def average = average(rsi, length2);

#END BURRITO CODE.............................................

#vw.AssignValueColor(if rsi > vw
#                           then color.light_GREEN
#                           else color.light_RED);

#def buy = rsi crosses above vw;
#def sell = rsi crosses below vw;

#AddChartBubble(buy, vw - 15, "Buy", Color.GREEN, no);
#AddChartBubble(sell, vw + 15, "Sell", Color.RED, yes);

#AddVerticalLine(showBreakoutSignals and (buy or sell), 
#if sell then "Sell" else "Buy", 
#if buy then Color.GREEN else Color.RED, curve.FIRM);


plot scan = rsi crosses above average
#and rsi > vw
#and rsi[1] < vw[1]
#and rsi > rsi[1]
;