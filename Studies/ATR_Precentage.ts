
declare lower;

input length = 14;
input averageType = AverageType.WILDERS;


plot ATRPct = MovingAverage(averageType, TrueRange(high, close, low), length) / MovingAverage(averageType, close, length) * 100;

ATRPct.SetDefaultColor(GetColor(6));
ATRPct.setLineWeight(3);