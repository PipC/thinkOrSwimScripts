# Volume Weighted RSI compiled by samport 08/13/2021

# idea from Lummox reference RedK Vol Weighted RSI on trading view: 
# https://www.tradingview.com/script/BaTELgMy-RedK-Vol-Weighted-RSI-Extending-the-power-of-the-classic-RSI/
# utilized TOS study myRSI with NET to create oscillator framework for RSI and then applied volume weighted MA as the divisor
# the Vol weighted MACD was then added and scaled to fit as suggested by Horserider; the MACD settings are 3/10/16 to approx LBR
# 3/10 oscillator
# Please feel free to test and make any corrections/improvements to code

declare lower;

input rsiLength = 5;
input netLength = 10;
input MACDlength = 16;
input showBreakoutSignals = no;

#def divisor = Sum(AbsValue(close - close[1]), rsiLength);
def divisor = Sum(volume * close, netLength) / Sum(volume, netLength);
plot MyRSI = if divisor != 0 then Sum(close - close[1], rsiLength) / divisor else 0;
MyRSI.SetDefaultColor(Color.WHITE);
MyRSI.SetLineWeight(1);

def num = fold i = 1 to netLength with s do s - ( fold j = 0 to i with s2 do s2 + Sign(GetValue(MyRSI, i, netLength -  1) - GetValue(MyRSI, j, netLength - 2)) );
def den = 0.5 * netLength * (netLength - 1);

plot NET = num / den;
NET.AssignValueColor(if NET > 0 then Color.CYAN else if NET < 0 then Color.DARK_ORANGE else Color.CURRENT);

#Vol weighted MACD

def fastAvg = Sum(volume * close, 3) / Sum(volume, 3)/100;
def slowAvg = Sum(volume * close, 10) / Sum(volume, 10)/100;
plot Value = (fastAvg - slowAvg);
plot Avg = ExpAverage(Value, MACDLength);
plot Diff = Value - Avg;

plot ZeroLine = 0;
ZeroLine.SetDefaultColor(Color.WHITE);

plot StrongUP = .40;
StrongUP.SetDefaultColor(Color.GREEN);
StrongUP.SetStyle(Curve.SHORT_DASH);

plot StrongDN = -.40;
StrongDN.SetDefaultColor(Color.RED);
StrongDN.SetStyle(Curve.SHORT_DASH);

def Buy = if Diff > 0 and Diff[1] < 0 then 1 else 0;
def Sell = If Diff < 0 and Diff[1] > 0 then 1 else 0;

plot UpSignal = Buy;
Plot DownSignal = Sell;

UpSignal.SetHiding(!showBreakoutSignals);
UpSignal.SetDefaultColor(Color.UPTICK);
UpSignal.SetPaintingStrategy(PaintingStrategy.ARROW_UP);

DownSignal.SetHiding(!showBreakoutSignals);
DownSignal.SetDefaultColor(Color.DOWNTICK);
DownSignal.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);

#MyRSI.SetDefaultColor(GetColor(2));
#NET.SetDefaultColor(GetColor(1));

ZeroLine.SetDefaultColor(Color.YELLOW);
Value.SetDefaultColor(GetColor(1));
Avg.SetDefaultColor(GetColor(8));
Diff.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
Diff.SetLineWeight(3);
Diff.DefineColor("Positive and Up", Color.GREEN);
Diff.DefineColor("Positive and Down", Color.DARK_GREEN);
Diff.DefineColor("Negative and Down", Color.RED);
Diff.DefineColor("Negative and Up", Color.DARK_RED);
Diff.AssignValueColor(if diff >= 0 then if diff > diff[1] then Diff.color("Positive and Up") else Diff.color("Positive and Down") else if diff < diff[1] then Diff.color("Negative and Down") else Diff.color("Negative and Up"));
ZeroLine.SetDefaultColor(GetColor(0));