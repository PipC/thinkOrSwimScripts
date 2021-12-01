#Advanced Volume Study
#welkincall@gmail.com
#v5.22.2020
#ref. https://usethinkscript.com/threads/advanced-volume-indicator-for-thinkorswim.1665/
declare on_volume;
input ShowVolumeAsCandlesticks = no;
input ShowBuySellStrengthOnVolumeBars = no;
input ShowBuySellStrength2ndAgg = no;
input AvgDayVolLength = 5;
input AvgVolLength = 20;
input ShowDayVolLabel = yes;
input ShowBarVolLabel = yes;
input ShowEthTotalVol = no;
input ShowBuySellStrength = yes;
input BuySellStrAgg2 = AggregationPeriod.THIRTY_MIN;
def BuySellStrAggregation2 = if GetAggregationPeriod() < BuySellStrAgg2 then BuySellStrAgg2 else GetAggregationPeriod();
AddLabel(if GetAggregationPeriod() < BuySellStrAgg2 then 0 else 1, "Adjust BuySellStrAgg2 in Study Settings", Color.YELLOW);
input VolAverageType = AverageType.SIMPLE;
#if ShowBuySellStrengthOnVolumeBars is toggled on then the following volume bar paint options will not show, only the VolSignal Triangle set at the top of the bars will be painting according to volume average levels.
input PaintAboveAvgVolBars = yes;
input PaintAccordingToRelPrevVol = yes;
input RelativetoPrevVolTolerance = 1.25; #if volume is 1.25x greater than previous bar it will paint even if it is still below the average/sigma2/sigma3
input PaintBelowAvgVol = yes;
input PaintPriceAsVol = no;
input ShowVerticalTickLines = yes;
def ShowVertLines = if ShowVerticalTickLines and GetAggregationPeriod() < AggregationPeriod.DAY then 1 else 0;
input TickLevel = 1000;
input ShowTickLabel = yes;


def NA = Double.NaN;
def PriceRange = high - low;
def TopShadowRange = if open >= close then high - open else high - close;
def BottomShadowRange = if open <= close then open - low else close - low;
def BodyRange = PriceRange - (TopShadowRange + BottomShadowRange);
def VolumeTopShadowValue = (1 - (TopShadowRange / PriceRange)) * volume;
def VolumeBottomShadowValue = ((BottomShadowRange / PriceRange) * volume);
def BodyRangeVolValue = ((BodyRange + BottomShadowRange) / PriceRange) * volume;
#def DayVolAgg = if GetAggregationPeriod() < AggregationPeriod.DAY then AggregationPeriod.DAY else if GetAggregationPeriod() >= AggregationPeriod.DAY then AggregationPeriod.WEEK else GetAggregationPeriod();
def DayVolAgg = if GetAggregationPeriod() < AggregationPeriod.DAY then AggregationPeriod.DAY else GetAggregationPeriod();
def DayVol = volume("period" = DayVolAgg);
def AvgDayVol = Average(DayVol, AvgDayVolLength);
def Start = 0930;
def End = 1600;
def conf = SecondsFromTime(Start) >= 0 and SecondsFromTime(End) <= 0;

plot VolColor = NA;
VolColor.DefineColor("Bullish", Color.GREEN);
VolColor.DefineColor("Bearish", Color.RED);
VolColor.DefineColor("VolAvg", CreateColor(0, 100, 200));
VolColor.DefineColor("VolSigma2", Color.DARK_ORANGE);
VolColor.DefineColor("VolSigma3", Color.MAGENTA);
VolColor.DefineColor("Relative to Prev", Color.YELLOW);
VolColor.DefineColor("Below Average", Color.GRAY);
VolColor.DefineColor("ETH TVOL", Color.GRAY);
VolColor.DefineColor("TICK Vert", Color.GRAY);

#Current Candle Buy and Sell Strength
def BuyStr = ((close - low) / PriceRange) * 100;
def SellStr = ((high - close) / PriceRange) * 100;

def BuyStr2 = ((close("period" = BuySellStrAggregation2) - low("period" = BuySellStrAggregation2)) / (high("period" = BuySellStrAggregation2) - low("period" = BuySellStrAggregation2))) * 100;
def SellStr2 = ((high("period" = BuySellStrAggregation2) - close("period" = BuySellStrAggregation2)) / (high("period" = BuySellStrAggregation2) - low("period" = BuySellStrAggregation2))) * 100;

plot BuyVol = if ShowBuySellStrengthOnVolumeBars then (BuyStr/100)*volume else NA;
def SellVol = (SellStr/100)*volume;
def BuyVol2 = (BuyStr2/100)*volume("period" = BuySellStrAggregation2);
def SellVol2 = (SellStr2/100)*volume("period" = BuySellStrAggregation2);
AddCloud(if ShowBuySellStrength2ndAgg then BuyVol2 else NA, 0, VolColor.Color("Bullish"), VolColor.Color("Bullish"), yes);
AddCloud(if ShowBuySellStrength2ndAgg then volume("period" = BuySellStrAggregation2) else NA, BuyVol2, VolColor.Color("Bearish"), VolColor.Color("Bearish"), yes);

BuyVol.SetDefaultColor(VolColor.Color("Bullish"));
BuyVol.SetPaintingStrategy(PaintingStrategy.SQUARED_HISTOGRAM);
#BuyVol2.SetDefaultColor(Color.GREEN);
#BuyVol2.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
#SellVol2.SetDefaultColor(Color.GREEN);
#SellVol2.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);

plot Vol = volume;
plot VolumeBottom = if !ShowVolumeAsCandlesticks or ShowBuySellStrengthOnVolumeBars then NA else VolumeBottomShadowValue;
plot VolumeBody = if !ShowVolumeAsCandlesticks or ShowBuySellStrengthOnVolumeBars then NA else BodyRangeVolValue;

VolumeBottom.HideTitle();
VolumeBody.HideTitle();

plot VolAvg = MovingAverage(VolAverageType, volume, AvgVolLength);

#2Sigma and 3Sigma Vol Filter
def Num_Dev1 = 2.0;
def Num_Dev2 = 3.0;
def averageType = AverageType.SIMPLE;
def sDev = StDev(data = Vol, length = AvgVolLength);

plot VolSigma2 = VolAvg + Num_Dev1 * sDev;
plot VolSigma3 = VolAvg + Num_Dev2 * sDev;


def RelDayVol = DayVol / AvgDayVol[1];
def RelPrevDayVol = DayVol / volume("period" = DayVolAgg)[1];
#Daily aggregation volume labels
AddLabel(if GetAggregationPeriod() >= AggregationPeriod.DAY then 0 else if ShowDayVolLabel then 1 else 0, "DayVol: " + DayVol + " / " + Round(RelDayVol, 2) + "x Avg(" + AvgDayVolLength + ") / " + Round(RelPrevDayVol, 2) + "x Prev", if DayVol > AvgDayVol then VolColor.Color("VolAvg") else VolColor.Color("Below Average"));

def RelVol = Vol / VolAvg[1];
def RelPrevVol = volume / volume[1];

#Triangle Vol Signal
plot VolSignal = if Vol > VolSigma3 then volume else if Vol > VolSigma2 then volume else if Vol > VolAvg then volume else if RelPrevVol >= RelativetoPrevVolTolerance then volume else NA;

#current aggregation's volume labels
AddLabel(ShowBarVolLabel, "Vol: " + volume + " / " + Round(RelVol, 2) + "x Avg(" + AvgVolLength + ") / " + Round(RelPrevVol, 2) + "x Prev",  if Vol > VolSigma3 then VolColor.Color("VolSigma3") else if Vol > VolSigma2 then VolColor.Color("VolSigma2") else if Vol > VolAvg then VolColor.Color("VolAvg") else VolColor.Color("Below Average"));

#ETH Total Vol Label
def ETH_VOL = if !conf and conf[1] then volume else if !conf then CompoundValue(1, ETH_VOL[1] + volume, volume) else ETH_VOL[1];

AddLabel(if !ShowEthTotalVol then 0 else if GetAggregationPeriod() >= AggregationPeriod.DAY then 0 else 1, "ETH TVOL: " + ETH_VOL, VolColor.Color("ETH TVOL"));

#$TICK Vertical Lines
def tickc = close("$TICK");
def tickh = high("$TICK");
def tickl = low("$TICK");

AddVerticalLine(if ShowVertLines and (tickh > TickLevel) or ShowVertLines and (tickl < -TickLevel) then 1 else 0, if (tickh > TickLevel) then tickh else if (tickl < -TickLevel) then tickl else Double.NaN, VolColor.Color("TICK Vert"));

#$TICK Label
AddLabel(if ShowTickLabel then 1 else 0,"$TICK: " + tickc, if tickc > 0 then Color.GREEN else Color.RED);

#current candle Buy/Sell strength labels
AddLabel(if ShowBuySellStrength then 1 else 0, " ", Color.BLACK);
AddLabel(if ShowBuySellStrength then 1 else 0, "1", Color.GRAY);
AddLabel(if ShowBuySellStrength then 1 else 0, "Sell " + Round(SellStr, 2) + "%", if SellStr > BuyStr then Color.RED else Color.DARK_RED);
AddLabel(if ShowBuySellStrength then 1 else 0, "Buy " + Round(BuyStr, 2) + "%", if BuyStr > SellStr then Color.GREEN else Color.DARK_GREEN);

#2nd Aggregation Buy/Sell strength labels
AddLabel(if GetAggregationPeriod() >= BuySellStrAggregation2 and ShowBuySellStrength then 1 else 0,"Check BuySellAgg2 > Current Agg", Color.YELLOW);
AddLabel(if GetAggregationPeriod() >= BuySellStrAggregation2 or !ShowBuySellStrength then 0 else 1, " ", Color.BLACK);
AddLabel(if GetAggregationPeriod() >= BuySellStrAggregation2 or !ShowBuySellStrength then 0 else 1, "2", Color.GRAY);
AddLabel(if GetAggregationPeriod() >= BuySellStrAggregation2 or !ShowBuySellStrength then 0 else 1, "Sell " + Round(SellStr2, 2) + "%", if SellStr2 > BuyStr2 then Color.RED else Color.DARK_RED);
AddLabel(if GetAggregationPeriod() >= BuySellStrAggregation2 or !ShowBuySellStrength then 0 else 1, "Buy " + Round(BuyStr2, 2) + "%", if BuyStr2 > SellStr2 then Color.GREEN else Color.DARK_GREEN);


VolumeBottom.SetPaintingStrategy(PaintingStrategy.SQUARED_HISTOGRAM);
VolumeBottom.AssignValueColor(Color.BLACK);
VolumeBody.SetPaintingStrategy(PaintingStrategy.SQUARED_HISTOGRAM);

VolumeBody.AssignValueColor(if PaintAboveAvgVolBars and Vol > VolSigma3 then VolColor.Color("VolSigma3") else if PaintAboveAvgVolBars and Vol > VolSigma2 then VolColor.Color("VolSigma2") else if PaintAboveAvgVolBars and Vol > VolAvg then VolColor.Color("VolAvg") else if PaintAccordingToRelPrevVol and RelPrevVol >= RelativetoPrevVolTolerance then VolColor.Color("Relative to Prev") else if  PaintBelowAvgVol and Vol < VolAvg then VolColor.Color("Below Average") else if close > open then VolColor.Color("Bullish") else VolColor.Color("Bearish"));
#VolumeTop.SetPaintingStrategy(PaintingStrategy.SQUARED_HISTOGRAM);
#VolumeTop.AssignValueColor(if close > open then Color.Black else Color.Black);

VolAvg.SetDefaultColor(VolColor.Color("VolAvg"));
VolSigma2.SetDefaultColor(VolColor.Color("VolSigma2"));
VolSigma3.SetDefaultColor(VolColor.Color("VolSigma3"));

Vol.SetPaintingStrategy(if !ShowVolumeAsCandlesticks or ShowBuySellStrengthOnVolumeBars then PaintingStrategy.SQUARED_HISTOGRAM else PaintingStrategy.HISTOGRAM);

Vol.SetLineWeight(1);
Vol.AssignValueColor(if ShowBuySellStrengthOnVolumeBars then VolColor.Color("Bearish") else if PaintAboveAvgVolBars and volume > VolSigma3 then VolColor.Color("VolSigma3") else if PaintAboveAvgVolBars and volume > VolSigma2 then VolColor.Color("VolSigma2") else if PaintAboveAvgVolBars and volume > VolAvg then VolColor.Color("VolAvg") else if PaintAccordingToRelPrevVol and RelPrevVol >= RelativetoPrevVolTolerance then VolColor.Color("Relative to Prev") else if PaintBelowAvgVol and volume < VolAvg then VolColor.Color("Below Average") else if close > open then VolColor.Color("Bullish") else VolColor.Color("Bearish"));

AssignPriceColor(if PaintPriceAsVol and PaintAboveAvgVolBars and volume > VolSigma3 then VolColor.Color("VolSigma3") else if PaintPriceAsVol and PaintAboveAvgVolBars and volume > VolSigma2 then VolColor.Color("VolSigma2") else if PaintPriceAsVol and PaintAboveAvgVolBars and volume > VolAvg then VolColor.Color("VolAvg") else if PaintPriceAsVol and PaintAccordingToRelPrevVol and RelPrevVol >= RelativetoPrevVolTolerance then VolColor.Color("Relative to Prev") else if PaintPriceAsVol and PaintBelowAvgVol and volume < VolAvg then VolColor.Color("Below Average") else Color.CURRENT);

VolSignal.AssignValueColor(if Vol > VolSigma3 then VolColor.Color("VolSigma3") else if Vol > VolSigma2 then VolColor.Color("VolSigma2") else if Vol > VolAvg then VolColor.Color("VolAvg") else if RelPrevVol >= RelativetoPrevVolTolerance then VolColor.Color("Relative to Prev") else VolColor.Color("Below Average"));
VolSignal.SetPaintingStrategy(PaintingStrategy.TRIANGLES);
VolAvg.SetLineWeight(2);
VolSignal.SetLineWeight(1);