### Version 2 ###
# SuperTrend
# Mobius
# Chat Room Request
# 11.20.2019 tomsk Enhanced and adjusted bubbles with coloring and description tag
input AtrMult = 1.0;
input nATR = 4;
input AvgType = AverageType.HULL;
input PaintBars = yes;
input n = 1; # 1: means yesterday; 0: means current day
def n1  = n + 1;
def ATR = MovingAverage(AvgType, TrueRange(high, close, low), nATR);
def UP = HL2 + (AtrMult * ATR);
def DN = HL2 + (-AtrMult * ATR);
def ST = if close < ST[1] then UP else DN;

def buyTrigger = close[n] crosses above ST[n];

#plot scan = buyTrigger[1];

plot scan = buyTrigger;