declare lower;
declare zerobase;

input shortLen = 10;
input longLen = 50;
input hideShortAvgLine = yes;
#input showStackedVolume = yes;

plot Vol = volume;
plot VolAvgLong = MovingAverage(AverageType.WEIGHTED, volume, longLen);
plot VolAvgShort = MovingAverage(AverageType.WEIGHTED, volume, shortLen);

Vol.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
Vol.SetLineWeight(1);
Vol.DefineColor("Up", Color.UPTICK);
Vol.DefineColor("Down", Color.DOWNTICK);
Vol.AssignValueColor(if close > close[1] then Vol.Color("Up") else if close < close[1] then Vol.Color("Down") else GetColor(1));

VolAvgLong.SetDefaultColor(Color.White);
VolAvgShort.SetDefaultColor(Color.Yellow);
VolAvgShort.setHiding(hideShortAvgLine);

#rec buyAccVol = if (close > close[1]) then buyAccVol[1] + volume else buyAccVol[1] - volume;
#rec StackedVol =  StackedVol[1] + (if close > close[1] then 1 else -1) * volume;
#plot PositivePressure = if showStackedVolume and StackedVol > 0 then absValue(StackedVol) else Double.NaN;
#PositivePressure.setPaintingStrategy(PaintingStrategy.LINE);
#PositivePressure.SetLineWeight(1);
#PositivePressure.setDefaultColor(Color.GREEN);
#PositivePressure.SetHiding();

#plot NegativePressure = if showStackedVolume and StackedVol < 0 then absValue(StackedVol) else Double.NaN;
#NegativePressure.setPaintingStrategy(PaintingStrategy.LINE);
#NegativePressure.SetLineWeight(1);
#NegativePressure.setDefaultColor(Color.RED);
#NegativePressure.SetHiding();