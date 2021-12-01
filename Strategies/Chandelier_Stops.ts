## Chandelier_Stops
## https://usethinkscript.com/threads/chandelier-exit-for-tos.178/
## linus, 2014-07-18, v0.2

#hint: ThinkScript adaptation of Chandelier stops.

#hint n: lookback length for highest highs, lowest lows.
input n = 15;

#hint atrLength: Period length of avg. true range.
input atrLength = 5;

#hint atrMult: Multiplier of avg. true range, normal range from 3.0 to 4.0
input atrMult = 3.75;  

#hint atrType: Moving average type of ATR.
input atrType = AverageType.SIMPLE;

#hint shift: Offsets the data this many bars.
input shift = 1; 

#hint hideOppositeStop: Set to No to see the inactive stop.
input hideOppositeStop = Yes; 

#hint label: Toggles P/L label.
input label = Yes;

#hint bubbles: Toggles P/L bubbles.
input bubbles = Yes;

def atr = MovingAverage(atrType, TrueRange(high, close, low)) * atrMult;

def smax = Lowest(low, n)[shift] + atr[shift];
def smin = Highest(high, n)[shift] - atr[shift];

def dir = CompoundValue(1, if close > smax[1] then 1 else if close < smin[1] then -1 else dir[1], 0);

def rUB = CompoundValue(1, if dir > 0 then if smax > rUB[1] then smax else rUB[1] else if dir < 0 then if smax < rUB[1] then smax else rUB[1] else rUB[1], high);

def rLB = CompoundValue(1, if dir < 0 then if smin < rLB[1] then smin else rLB[1] else if dir > 0 then if smin > rLB[1] then smin else rLB[1] else rLB[1], low);

plot UB = if !hideOppositeStop or dir < 0 then rUB else Double.NaN;
plot LB = if !hideOppositeStop or dir > 0 then rLB else Double.NaN;

UB.SetDefaultColor(Color.MAGENTA);
LB.SetDefaultColor(Color.CYAN);

UB.SetLineWeight(2);
LB.SetLineWeight(2);

def orderDir = dir;

def isOrder = orderDir crosses 0;

def orderCount = CompoundValue(1, if IsNaN(isOrder) then 0 else if isOrder then orderCount[1] + 1 else orderCount[1], 0);

def noBar = IsNaN(open[-1]);

def orderPrice = if isOrder then if noBar then close else open[-1] else orderPrice[1];
def profitLoss = if !isOrder or orderCount == 1 then 0 else if orderDir > 0 then orderPrice[1] - orderPrice else if orderDir < 0 then orderPrice - orderPrice[1] else 0;
def profitLossSum = CompoundValue(1, if IsNaN(isOrder) then 0 else if isOrder then profitLossSum[1] + profitLoss else profitLossSum[1], 0);

AddLabel(label, orderCount + " orders | P/L " + AsDollars((profitLossSum / TickSize()) * TickValue()), if profitLossSum > 0 then Color.GREEN else if profitLossSum < 0 then Color.RED else Color.GRAY);

#AddChartBubble(bubbles and isOrder and orderDir > 0, low, orderPrice, if noBar then Color.LIGHT_GRAY else Color.GREEN, 0);
#AddChartBubble(bubbles and isOrder and orderDir < 0, high, orderPrice, if noBar then Color.GRAY else Color.RED, 1);

## END STUDY

Alert(bubbles and isOrder and orderDir < 0, "ChandelierStop SHORT Confirmed", Alert.BAR, Sound.Ding);
Alert(bubbles and isOrder and orderDir > 0, "ChandelierStop LONG Confirmed", Alert.BAR, Sound.Ding); 

##https://usethinkscript.com/threads/pivot-confirmation-with-trading-levels.1843/
AddOrder(condition = bubbles and isOrder and orderDir > 0, type = OrderType.BUY_TO_OPEN, price = close, name = "LE", tickcolor = Color.DARK_GREEN, arrowcolor = Color.GREEN);
AddOrder(condition = bubbles and isOrder and orderDir < 0, type = OrderType.SELL_TO_CLOSE, price = close, name = "LX", tickcolor = Color.DARK_RED, arrowcolor = Color.RED);
#AddOrder(condition = trail_hit, type = OrderType.SELL_TO_CLOSE, price = close, name = "STP", tickcolor = Color.DARK_RED, arrowcolor = Color.RED, tradesize=tradeSize);
#f/ Pivot Confirmation With Trading Levels 