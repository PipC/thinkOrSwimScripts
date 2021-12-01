# Mobius 
# SuperTrend 
# Chat Room Request 
# V03.10.2015 
# Added Bubbles to mark entry and exit prices. Doesn't give much time to follow into trade, but better than guessing. 
# Altered default settings for values that made more sense on Intraday Futures. Added Color and ColorBars. 
#Hint:Supertrend Indicator: shows trend direction and gives buy or sell signals according to that. It is based on a combination of the average price rate in the current period along with a volatility indicator. The ATR indicator is most commonly used as volatility indicator. The values are calculated as follows: 
# Up = (HIGH + LOW) / 2 + Multiplier * ATR 
# Down = (HIGH + LOW) / 2 – Multiplier * ATR 
# When the change of trend occurs, the indicator flips 

###Version 1###
#input AtrMult = 1.0; 
#input nATR = 4; 
#input AvgType = AverageType.HULL; 
#input PaintBars = yes; 
#def ATR = MovingAverage(AvgType, TrueRange(high, close, low), nATR); 
#def UP = HL2 + (AtrMult * ATR); 
#def DN = HL2 + (-AtrMult * ATR); 
#def ST = if close < ST[1] then UP else DN; 
#plot SuperTrend = ST; 
#SuperTrend.AssignValueColor(if close < ST then Color.RED else Color.GREEN); 
#AssignPriceColor(if PaintBars and close < ST  
#                 then Color.RED  
#                 else if PaintBars and close > ST  
#                      then Color.GREEN  
#                      else Color.CURRENT); 
#AddChartBubble(close crosses below ST, low[1], low[1], color.Dark_Gray); 
#AddChartBubble(close crosses above ST, high[1], high[1], color.Dark_Gray, no); 
#End Code SuperTrend 

### Version 2 ###
# SuperTrend
# Mobius
# Chat Room Request
# 11.20.2019 tomsk Enhanced and adjusted bubbles with coloring and description tag
input AtrMult = 1.0;
input nATR = 4;
input AvgType = AverageType.HULL;
input PaintBars = yes;
input n = 0;
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

def buyTrigger = close[n] crosses above ST[n];
def sellTrigger = close[n] crosses below ST[n];
def price = if buyTrigger then round(high[n],0) 
            else if sellTrigger then round(low[n],0) else 0;
def tradesize = round(10000/price,0);

AddChartBubble(buyTrigger, price - TickSize() * n, "Buy " + price, color.GREEN, no);
AddChartBubble(sellTrigger, price + TickSize() * n, "Sell " + price, color.RED, yes);

#AddOrder(OrderType.BUY_AUTO, condition = buyTrigger, price = price);
#AddOrder(OrderType.SELL_AUTO, condition = sellTrigger, price = price);

#AddOrder(OrderType.BUY_AUTO, condition = buyTrigger, price = price, tradeSize = tradesize, tickcolor = color.GREEN, arrowcolor = Color.BLUE, "Buy " + price) ; # , "buy"
#AddOrder(OrderType.SELL_AUTO, condition = sellTrigger, price = price, tradeSize = tradesize, tickcolor = color.RED, arrowcolor = Color.RED, "Sell " + price) ;  #  , "sell"

#AddOrder(OrderType.BUY_TO_OPEN, buyTrigger, tickcolor = GetColor(0), arrowcolor = GetColor(0), name = "Buy");
#AddOrder(OrderType.SELL_TO_OPEN, sellTrigger, tickcolor = GetColor(1), arrowcolor = GetColor(1), name = "Sell");

# End Code SuperTrend