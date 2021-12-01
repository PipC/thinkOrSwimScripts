#
# PositionSizingCalculator
#
# Author: Kory Gill, [USER=212]@korygill[/USER]
## thanks to Kory Gill for this
## Jon Yadon added this ATR so you can adjust your atr mutliplier
input RiskUnit = 100;

input multiplier = 2;
input ATRLength = 14;
input averagetype = AverageType.WILDERS;
input BasePeriod = AggregationPeriod.DAY;
input showlabel = yes;





def ATR = MovingAverage (averagetype, TrueRange(high(period = BasePeriod)[1], close(period = BasePeriod)[1], low(period = BasePeriod)[1]), ATRLength);

def Today_High = Highest(high(period = BasePeriod)[0], 1);
def Today_Low = Lowest(low(period = BasePeriod)[0], 1);
def stoploss = ATR * multiplier;
AddLabel(
    yes,
    AsDollars(RiskUnit) + " risk with " + AsDollars(stoploss) + " stop = " + Floor(Round(RiskUnit / stoploss)) + " shares",
    Color.GRAY
    );
AddLabel(
    yes,
    "High: " + Today_High + " Low: " + Today_Low,
    Color.GRAY
    );