# StudyName: RTH // High // Low
# Description: Plots developing intraday high and low
# Author: DMonkey
# Requested By: ActiveTrader
# Ver 2   12/20/2017: updated bubbles
# Ver 2.1 11/20/2020: Added an input for TradeSize, @Rick_Kennedy, member, usethinkscript.com
# Ver 3   11/30/2020: cleanup, Barbaros

input UseRTH = yes;
input Fraction = .3;
input RangePicker = yes;
input PaintBars = yes;
input ShowTimeConditions = yes;
input agg = AggregationPeriod.THIRTY_MIN;
input mult1 = 0.125; # title = "Mutiplier; Only Supports 0.125 = 1/8");
input AutoTrade = yes;
input TradeSize = 10;

def DurationInHours = (RegularTradingEnd(GetYYYYMMDD()) - RegularTradingStart(GetYYYYMMDD())) / AggregationPeriod.HOUR;
input MarketOpen = 0930;
input TradeTimeStart = 0930;
input TradeTimeEnd = 1530;

def test = RegularTradingEnd(GetYYYYMMDD())/60/60;
AddLabel(yes, "RTH duration (hrs): " + test);

def MarketDuration = DurationInHours * 60 * 60;
def GoTime = SecondsFromTime(MarketOpen);

def OpenHigh = if GoTime == 0 then high else if high > OpenHigh[1] then high else OpenHigh[1];
plot OpenHighLevel = if GoTime >= 0 && GoTime < MarketDuration then OpenHigh else Double.NaN;
OpenHighLevel.SetPaintingStrategy(PaintingStrategy.DASHES);
OpenHighLevel.SetDefaultColor(Color.YELLOW);
OpenHighLevel.SetLineWeight(3);

def OpenLow = if GoTime == 0 then low else if low < OpenLow[1] then low else OpenLow[1];
plot OpenLowLevel = if GoTime >= 0 && GoTime < MarketDuration then OpenLow else Double.NaN;
OpenLowLevel.SetPaintingStrategy(PaintingStrategy.DASHES);
OpenLowLevel.SetDefaultColor(Color.MAGENTA);
OpenLowLevel.SetLineWeight(3);

def RTH_High_bubble = if GoTime >= 0 then HighestAll(OpenHighLevel) else Double.NaN;
def RTH_Low_bubble = if GoTime >= 0 then LowestAll(OpenLowLevel) else Double.NaN;
AddChartBubble("time condition" = ShowTimeConditions && if IsNaN(close[-1]) && !IsNaN(close) then (RTH_High_bubble) else Double.NaN,
               "price location" = (RTH_High_bubble),
                text = "RTH High : " + AsDollars(Round((RTH_High_bubble) / TickSize(), 0) * TickSize()),
                color = Color.LIGHT_GREEN);
AddChartBubble("time condition" = ShowTimeConditions && if IsNaN(close[-1]) && !IsNaN(close) then RTH_Low_bubble else Double.NaN ,
               "price location" = RTH_Low_bubble,
                text = "RTH Low : " + AsDollars(Round((RTH_Low_bubble) / TickSize(), 0) * TickSize()),
                color = Color.GRAY,
                up = no);

def range = Fraction * (OpenHighLevel - OpenLowLevel);

plot ShortExpansion = OpenHighLevel - range;
ShortExpansion.SetDefaultColor(Color.LIGHT_GRAY);

plot LongExpansion = OpenLowLevel + range;
LongExpansion.SetDefaultColor(Color.RED);

def ExpansionDirection = if ShortExpansion > ShortExpansion[1] then 1 else if ShortExpansion < ShortExpansion[1] then 2 else ExpansionDirection[1];
AddLabel(!IsNaN(ExpansionDirection), "Market is expanding " + if ExpansionDirection == 1 then "up" else if ExpansionDirection == 2 then "down" else "flat", if ExpansionDirection == 1 then Color.GREEN else if ExpansionDirection == 2 then Color.RED else Color.ORANGE);

def range2 = OpenHighLevel - OpenLowLevel;
def multiplier = range2 * mult1;
def midline = OpenLowLevel + multiplier * 4;

def oscillator = ExpAverage((close(period = agg) - midline) / (if RangePicker then range2 / 2 else range / 2), 1);

def a = oscillator > 0 and oscillator < mult1 * 2;
def b = oscillator > 0 and oscillator < mult1 * 4;
def c = oscillator > 0 and oscillator < mult1 * 6;
def d = oscillator > 0 and oscillator < mult1 * 8;

def z = oscillator < 0 and oscillator > -mult1 * 2;
def y = oscillator < 0 and oscillator > -mult1 * 4;
def x = oscillator < 0 and oscillator > -mult1 * 6;
def w = oscillator < 0 and oscillator > -mult1 * 8;

def buyCondition =  oscillator crosses above 0 or oscillator crosses above w or oscillator crosses above d;
def sellCondition = oscillator crosses below 0 or oscillator crosses below d or oscillator crosses below w;

def active = if SecondsFromTime(TradeTimeStart) >= 0 && SecondsTillTime(TradeTimeEnd) >= 0 then 1 else 0;
def buyAtOpen = oscillator > 0;
def sellAtOpen = oscillator < 0;

def EOD =  SecondsFromTime(TradeTimeEnd) == 0;
AddVerticalLine(EOD, "End of Trading", Color.WHITE);

AssignPriceColor(if PaintBars then if oscillator > 0 then Color.GREEN else Color.RED else Color.CURRENT);

plot buyAtOpenSignal = if SecondsFromTime(TradeTimeStart) == 0 then buyAtOpen else no;
buyAtOpenSignal.SetDefaultColor(Color.MAGENTA);
buyAtOpenSignal.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_UP);

plot buySignal = if UseRTH then active && buyCondition else buyCondition;
buySignal.SetDefaultColor(Color.CYAN);
buySignal.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_UP);

plot sellAtOpenSignal = if SecondsFromTime(TradeTimeStart) == 0 then sellAtOpen else no;
sellAtOpenSignal.SetDefaultColor(Color.MAGENTA);
sellAtOpenSignal.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_DOWN);

plot sellSignal = if UseRTH then active && sellCondition else sellCondition;
sellSignal.SetDefaultColor(Color.CYAN);
sellSignal.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_DOWN);

Alert(if SecondsFromTime(TradeTimeStart) == 0 then buyAtOpen else no, "Buy at Open", Alert.BAR, Sound.Ding);
Alert(if UseRTH then active && buyCondition else buyCondition, "Bullish", Alert.BAR, Sound.Ding);
Alert(if SecondsFromTime(TradeTimeStart) == 0 then sellAtOpen else no, "Sell at Open", Alert.BAR, Sound.Ding);
Alert(if UseRTH then active && sellCondition else sellCondition, "Bearish", Alert.BAR, Sound.Ding);
Alert(if UseRTH && active then EOD else no, "Close All Positions", Alert.BAR, Sound.Ring);

AddOrder(OrderType.BUY_TO_OPEN, if AutoTrade and SecondsFromTime(TradeTimeStart) == 0 then buyAtOpen else no, open(priceType = PriceType.ASK)[-1], TradeSize, name = "LE$" +  open(priceType = PriceType.ASK)[-1] , tickColor = Color.GREEN, arrowColor = Color.GREEN);
AddOrder(OrderType.SELL_TO_OPEN, if AutoTrade and SecondsFromTime(TradeTimeStart) == 0 then sellAtOpen else no, open(priceType = PriceType.BID)[0], TradeSize, name = "SE$" +  open(priceType = PriceType.BID)[-1], tickColor = Color.RED, arrowColor = Color.RED);

AddOrder(type = OrderType.SELL_TO_CLOSE, condition = if AutoTrade and UseRTH and active then EOD else no, price = close(priceType = PriceType.BID), TradeSize = TradeSize, name = "SX$" + close(priceType = PriceType.BID), tickColor = Color.LIGHT_ORANGE, arrowColor = Color.LIGHT_ORANGE);
AddOrder(type = OrderType.BUY_TO_CLOSE, condition = if AutoTrade and UseRTH and active then EOD else no, price = close(priceType = PriceType.ASK), TradeSize = TradeSize, name = "LX$" +  close(priceType = PriceType.ASK), tickColor = Color.WHITE, arrowColor = Color.WHITE);

AddOrder(type = OrderType.BUY_AUTO,
        condition = if AutoTrade then if UseRTH then active and buyCondition else buyCondition else no,
        TradeSize = TradeSize,
        price = open(priceType = PriceType.ASK)[-1],
        name = "L$" + open(priceType = PriceType.ASK)[-1],
        tickColor = Color.WHITE,
        arrowColor = Color.WHITE);

AddOrder(type = OrderType.SELL_AUTO,
        condition = if AutoTrade then if UseRTH then active and sellCondition else sellCondition else no,
        TradeSize = TradeSize,
        price = open(priceType = PriceType.BID)[-1],
        name = "S$" + open(priceType = PriceType.BID)[-1],
        tickColor = Color.LIGHT_ORANGE,
        arrowColor = Color.LIGHT_ORANGE);

#AddOrder(OrderType.BUY_TO_OPEN, if AutoTrade and SecondsFromTime(TradeTimeStart) == 0 then buyAtOpen else no, open(priceType = PriceType.ASK)[-1], TradeSize, name = "LE $" +  open(priceType = PriceType.ASK)[-1], tickcolor = Color.GREEN);

#AddOrder(OrderType.SELL_TO_OPEN, if AutoTrade and SecondsFromTime(TradeTimeStart) == 0 then sellAtOpen else no, open(priceType = PriceType.BID)[0], TradeSize, name = "SE $" +  open(priceType = PriceType.BID)[-1], tickcolor = Color.RED);

#AddOrder(type = OrderType.SELL_TO_CLOSE, condition = if AutoTrade and UseRTH and active then EOD else no, price = close(priceType = PriceType.BID), TradeSize, name = "SX $" + close(priceType = PriceType.BID), tickcolor = Color.RED);
#AddOrder(type = OrderType.BUY_TO_CLOSE, condition = if AutoTrade and UseRTH and active then EOD else no, price = close(priceType = PriceType.ASK), TradeSize, name = "LX $" +  close(priceType = PriceType.ASK), tickcolor = Color.GREEN);

#AddOrder(type = OrderType.BUY_AUTO, condition = if AutoTrade then if UseRTH then active and buyCondition else buyCondition else no, tradeSize = TradeSize, price = open(priceType = PriceType.ASK)[-1], name = "LE $" + open(priceType = PriceType.ASK)[-1], tickcolor = Color.LIME);

#AddOrder(type = OrderType.SELL_AUTO, condition = if AutoTrade then if UseRTH then active and sellCondition else sellCondition else no, tradeSize = TradeSize, price = open(priceType = PriceType.BID)[-1], name = "LX $" + open(priceType = PriceType.BID)[-1], tickcolor = Color.RED);