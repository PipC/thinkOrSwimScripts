### Version 2 ###
# SuperTrend
# Mobius
# Chat Room Request
# 11.20.2019 tomsk Enhanced and adjusted bubbles with coloring and description tag
input AtrMult = 1.0;
input nATR = 4;
input AvgType = AverageType.HULL;
input PaintBars = yes;
input n = -1; #take one date before the scan
def n1  = n + 1;
def ATR = MovingAverage(AvgType, TrueRange(high, close, low), nATR);
def UP = HL2 + (AtrMult * ATR);
def DN = HL2 + (-AtrMult * ATR);
def ST = if close < ST[1] then UP else DN;
plot SuperTrend = ST;
SuperTrend.AssignValueColor(if close < ST then Color.RED else Color.GREEN);
AssignPriceColor(if PaintBars and close < ST
                 then Color.RED
                 else if PaintBars and close > ST
                      then Color.GREEN
                      else Color.CURRENT);
plot ST_point = if isNaN(close[-1])
                then ST
                else double.nan;
ST_point.SetStyle(Curve.Points);
ST_point.SetLineWeight(3);
ST_point.SetDefaultColor(Color.Yellow);

def buyTrigger = close[n] crosses above ST[n];
def sellTrigger = close[n] crosses below ST[n];

def buyPrice = if !IsNaN(high[n]) then Round(high[n], 0) else high;
def sellPrice = if !IsNaN(low[n])  then Round(low[n], 0)  else low;

def tradesize = if buyTrigger then Round(10000 / buyPrice, 0) else Round(10000 / sellPrice, 0);

AddChartBubble(buyTrigger and IsNaN(high[n]), buyPrice - TickSize() * n, "Buy $" + buyPrice, color.GREEN, no);
AddChartBubble(sellTrigger and IsNaN(low[n]), sellPrice + TickSize() * n, "Sell $" + sellPrice, color.RED, yes);

AddOrder(OrderType.BUY_TO_OPEN, condition = buyTrigger, price = buyPrice, tradeSize = tradesize, tickcolor = Color.DARK_GREEN, arrowcolor = Color.DARK_GREEN, "Buy $"+buyPrice) ; # , "buy"
AddOrder(OrderType.SELL_TO_CLOSE, condition = sellTrigger, price = sellPrice, tradeSize = tradesize, tickcolor = Color.DARK_RED, arrowcolor = Color.DARK_RED, "Sell $"+sellPrice) ;  #  , "sell"

Alert(buyTrigger, "Buy @ " + buyPrice, Alert.BAR, Sound.Ding);
Alert(sellTrigger, "Sell @ " + sellPrice, Alert.BAR, Sound.Ding);