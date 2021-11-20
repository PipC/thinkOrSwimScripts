input length = 14;
input averageType = AverageType.WILDERS;
input BasePeriod = AggregationPeriod.DAY;

def ATR = MovingAverage(averageType, TrueRange(high(period=”DAY”)[1], close(period=”DAY”)[1], low(period=”DAY”)[1]), length);
def Today_High = Highest(high(period = baseperiod)[0], 1);
def Today_Low = Lowest(low(period =baseperiod)[0], 1);
def DR = Today_High - Today_Low;

plot DailyClose = close(period=”DAY”)[1];
plot hatr = dailyclose + ATR;
plot latr = dailyclose - ATR;
plot hdtr = Today_Low + ATR;
plot ldtr = Today_High - ATR;

AddLabel(visible = Yes, text = "DTR: " + round(DR/ATR, 2)*100 + "%", color = Color.LIGHT_GRAY);