# Original author: Unknown
# Modified by 7of9

declare lower;

#Inputs

input ShowLabel = yes;
input ShowXDayAvg = yes;
input ShowTodayVolume = yes;
input ShowPercentOfXDayAvg = yes;
input UnusualVolumePercent = 200;
input ShowXBarAvg = yes;
input ShowVolLine = yes;
input ShowCurrentBar = yes;
input ShowPercentOfXBarAvg = yes;
input ShowSellVolumePercent = yes;
input LastXPeriodAvgLength = 30; #if period is day then it is 30 days by default
input ShortTermBuySellVolAvgLength = 5;
input ShowMirrorView = no;
input ShowWholeBarColor = no;
input ShowVolumeStacking = no;
input VolumeStackingFactor = 0.1;
input ShowTrendTopColor = no;

input ShowSellVolPercentage = no;

#input VolBandAdjustment = 3;
#plot baseLine = VolBandAdjustment * volume;
#baseline.SetDefaultColor(Color.BLACK);

def O = open;
def H = high;
def C = close;
def L = low;
def V = volume;
def buying = V * (C - L) / (H - L);
def selling = V * (H - C) / (H - L);

plot SellVolLine = if ShowVolLine then selling * (if ShowMirrorView then -1 else 1) else Double.NaN;
SellVolLine.SetPaintingStrategy(PaintingStrategy.LINE);
SellVolLine.SetDefaultColor(Color.LIGHT_RED);
SellVolLine.SetLineWeight(1);
#SellVolLine.HideTitle();
#SellVolLine.HideBubble();

plot BuyVolLine = if ShowVolLine then buying else Double.NaN;
BuyVolLine.SetPaintingStrategy(PaintingStrategy.LINE);
BuyVolLine.SetDefaultColor(Color.LIGHT_GREEN);
BuyVolLine.SetLineWeight(1);
#BuyVolLine.HideTitle();
#BuyVolLine.HideBubble();

# Selling Volume

plot SellVol = selling * (if ShowMirrorView then -1 else 1);
SellVol.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
SellVol.SetDefaultColor(Color.DARK_RED);
SellVol.HideTitle();
SellVol.HideBubble();
SellVol.SetLineWeight(1);

plot SellVolPercentage = selling / volume * (if ShowMirrorView then -1 else 1);
#SellVolPercentage.SetLineWeight(5);
SellVolPercentage.SetDefaultColor(Color.DARK_GRAY);

# Total Volume

plot BuyVol = if ShowMirrorView then buying else volume;
BuyVol.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
BuyVol.SetDefaultColor(Color.DARK_GREEN);
BuyVol.HideTitle();
BuyVol.HideBubble();
BuyVol.SetLineWeight(1);

plot TotalVolBuy = if ShowWholeBarColor and close > close[1] then (if ShowMirrorView then buying else volume) else (Double.NaN);
TotalVolBuy.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
TotalVolBuy.SetDefaultColor(Color.GREEN);
TotalVolBuy.HideTitle();
TotalVolBuy.HideBubble();
TotalVolBuy.SetLineWeight(4);

plot TotalVolBuy2 = if ShowWholeBarColor and close > close[1] and ShowMirrorView then -1 * selling else (Double.NaN);
TotalVolBuy2.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
TotalVolBuy2.SetDefaultColor(Color.GREEN);
TotalVolBuy2.HideTitle();
TotalVolBuy2.HideBubble();
TotalVolBuy2.SetLineWeight(4);

plot TotalVolSell = if ShowWholeBarColor and close < close[1] then (if ShowMirrorView then -1 * selling else volume) else (Double.NaN);
TotalVolSell.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
TotalVolSell.SetDefaultColor(Color.RED);
TotalVolSell.HideTitle();
TotalVolSell.HideBubble();
TotalVolSell.SetLineWeight(4);

plot TotalVolSell2 = if ShowWholeBarColor and  close < close[1] and ShowMirrorView then buying else (Double.NaN);
TotalVolSell2.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
TotalVolSell2.SetDefaultColor(Color.RED);
TotalVolSell2.HideTitle();
TotalVolSell2.HideBubble();
TotalVolSell2.SetLineWeight(4);

plot SellAvg = MovingAverage(AverageType.SIMPLE, selling, ShortTermBuySellVolAvgLength) * (if ShowMirrorView then -1 else Double.NaN);
SellAvg.SetDefaultColor(Color.DARK_GRAY);
SellAvg.SetPaintingStrategy(PaintingStrategy.DASHES);
SellAvg.HideTitle();
SellAvg.HideBubble();

plot BuyAvg = MovingAverage(AverageType.SIMPLE, buying, ShortTermBuySellVolAvgLength) * (if ShowMirrorView then 1 else Double.NaN);
BuyAvg.SetDefaultColor(Color.DARK_GRAY);
BuyAvg.SetPaintingStrategy(PaintingStrategy.DASHES);
BuyAvg.HideTitle();
BuyAvg.HideBubble();

plot BuySellVolAvgFlow = if ShowMirrorView then SellAvg + BuyAvg  else Double.NaN;
BuySellVolAvgFlow.SetLineWeight(1);
BuySellVolAvgFlow.SetDefaultColor(Color.WHITE);
BuySellVolAvgFlow.SetPaintingStrategy(PaintingStrategy.LINE);
#BuySellVolFlow.Hide();

#
###
#####
#######
#########
###########
#############
plot buyTopTriangle = if close > close[1] then if ShowMirrorView then buying else volume else Double.NaN;
buyTopTriangle.SetPaintingStrategy(PaintingStrategy.SQUARES);
buyTopTriangle.SetHiding(!ShowTrendTopColor);
buyTopTriangle.SetDefaultColor(Color.GREEN);
buyTopTriangle.HideBubble();
buyTopTriangle.HideTitle();
plot sellTopTriangle = if close < close[1] then if ShowMirrorView then -1 * selling else volume else Double.NaN;
sellTopTriangle.SetPaintingStrategy(PaintingStrategy.SQUARES);
sellTopTriangle.SetHiding(!ShowTrendTopColor);
sellTopTriangle.SetDefaultColor(Color.RED);
sellTopTriangle.HideBubble();
sellTopTriangle.HideTitle();


#Volume Data

#def volLastXDayAvg = (volume(period = "DAY")[1] + volume(period = "DAY")[2] + volume(period = "DAY")[3] + volume(period = "DAY")[4] + volume(period = "DAY")[5] + volume(period = "DAY")[6] + volume(period = "DAY")[7] + volume(period = "DAY")[8] + volume(period = "DAY")[9] + volume(period = "DAY")[10] + volume(period = "DAY")[11] + volume(period = "DAY")[12] + volume(period = "DAY")[13] + volume(period = "DAY")[14] + volume(period = "DAY")[15] + volume(period = "DAY")[16] + volume(period = "DAY")[17] + volume(period = "DAY")[18] + volume(period = "DAY")[19] + volume(period = "DAY")[20] + volume(period = "DAY")[21] + volume(period = "DAY")[22] + volume(period = "DAY")[23] + volume(period = "DAY")[24] + volume(period = "DAY")[25] + volume(period = "DAY")[26] + volume(period = "DAY")[27] + volume(period = "DAY")[28] + volume(period = "DAY")[29] + volume(period = "DAY")[30]) / 30;

#plot volLastXDayAvg = Average( volume(period = GetAggregationPeriod ()), LastXPeriodAvgLength);


input VolLastXDayAvgType = AverageType.SIMPLE ;
input hotPct = 1.0 ;
plot VolLastXDayAvg = MovingAverage(VolLastXDayAvgType, volume, LastXPeriodAvgLength);
VolLastXDayAvg.SetDefaultColor(Color.WHITE);
VolLastXDayAvg.SetHiding(if ShowMirrorView then 1 else 0);

#def today = volume(period = "DAY");
def today = volume(period = GetAggregationPeriod ());

def percentOfXDay = Round((today / VolLastXDayAvg) * 100, 0);

#def avgBars = (volume[1] + volume[2] + volume[3] + volume[4] + volume[5] + volume[6] + volume[7] + volume[8] + volume[9] + volume[10] + volume[11] + volume[12] + volume[13] + volume[14] + volume[15] + volume[16] + volume[17] + volume[18] + volume[19] + volume[20] + volume[21] + volume[22] + volume[23] + volume[24] + volume[25] + volume[26] + volume[27] + volume[28] + volume[29] + volume[30]) / 30;

def avgBars =  Average( volume, LastXPeriodAvgLength);

def curVolume = volume;
def percentOfXBar = Round((curVolume / avgBars) * 100, 0);
def SellVolPercent = Round((selling / volume) * 100, 0);

# Labels

def Agg = GetAggregationPeriod();

AddLabel(ShowLabel && ShowXDayAvg, "Avg " + LastXPeriodAvgLength + " " +
if Agg == AggregationPeriod.DAY then "Days" else
if Agg == AggregationPeriod.HOUR then "Hrs" else
if Agg == AggregationPeriod.MONTH then "Mths" else
if Agg == AggregationPeriod.MIN then "Mins" else
if Agg == AggregationPeriod.WEEK then "Wks" else
if Agg == AggregationPeriod.FOUR_HOURS then "4hrs" else
if Agg == AggregationPeriod.TWO_HOURS then "2hrs" else
if Agg == AggregationPeriod.FIFTEEN_MIN then "15m" else
if Agg == AggregationPeriod.TEN_MIN then "10mins" else
if Agg == AggregationPeriod.FIVE_MIN then "5m" else
if Agg == AggregationPeriod.TWO_MIN then "2m" else
 (Agg / 1000 / 60) + "m"
+ " : " + Round(VolLastXDayAvg, 0) + "  ", Color.LIGHT_GRAY);


plot VolAvgBuy = MovingAverage(AverageType.HULL, volume, LastXPeriodAvgLength);
VolAvgBuy.SetDefaultColor(Color.DARK_GRAY);
VolAvgBuy.HideBubble();

plot VolAvgSell = MovingAverage(AverageType.HULL, volume, LastXPeriodAvgLength) * (if ShowMirrorView then -1 else Double.NaN);
VolAvgSell.SetDefaultColor(Color.DARK_GRAY);
VolAvgSell.HideTitle();
VolAvgSell.HideBubble();

#plot SellAvg = MovingAverage(AverageType.SIMPLE, selling, length);
#SellAvg.SetDefaultColor(GetColor(5));

# hiVolume indicator
# source: http://tinboot.blogspot.com
# author: allen everhart





plot hvS = if selling / volume > 0.5 and 100 * ((volume / VolLastXDayAvg) - 1) >= hotPct then ((if ShowMirrorView then -1 else 1) * VolLastXDayAvg) else Double.NaN;
hvS.SetDefaultColor(Color.RED);
hvS.SetLineWeight(1) ;
hvS.SetPaintingStrategy( PaintingStrategy.DASHES);
hvS.HideTitle();
hvS.HideBubble();

plot hvB = if selling / volume <= 0.5 and 100 * ((volume / VolLastXDayAvg) - 1) >= hotPct then VolLastXDayAvg else Double.NaN;
hvB.SetDefaultColor(Color.GREEN);
hvB.SetLineWeight(1) ;
hvB.SetPaintingStrategy( PaintingStrategy.DASHES);
hvB.HideTitle();
hvB.HideBubble();

#rec buyAccVol = if (close > close[1]) then buyAccVol[1] + volume else buyAccVol[1] - volume;
#rec AccVol = if (close > close[1]) then AccVol[1] + volume else AccVol[1] - volume;

#plot buyTotalVol = buyAccVol;
#buyTotalVol.setPaintingStrategy(PaintingStrategy.LINE_VS_SQUARES);
#buyTotalVol.SetLineWeight(1);
#buyTotalVol.SetDefaultColor(Color.DARK_GREEN);

#plot sellTotalVol = AccVol;
#sellTotalVol.setPaintingStrategy(PaintingStrategy.HISTOGRAM);
#sellTotalVol.SetLineWeight(1);
#sellTotalVol.setDefaultColor(Color.Dark_Red);

#rec VolAcc = MovingAverage(AverageType.SIMPLE, VolAcc[1] + AbsValue(buying) - AbsValue(selling), ShortTermBuySellVolAvgLength);


###############
###############
###############
###############
###############
###############
###############
###############
rec VolAcc = VolAcc[1] + (if close == close[1] then 0 else if close > close[1] then 1 else -1) *VolumeStackingFactor * volume;

plot VolumeStacking = MovingAverage(AverageType.EXPONENTIAL, VolAcc, 10);
VolumeStacking.SetDefaultColor(Color.YELLOW);
VolumeStacking.SetPaintingStrategy(PaintingStrategy.line);
VolumeStacking.SetHiding(!ShowVolumeStacking);



#AddLabel(ShowLabel && ShowTodayVolume && BuySellVolAvgFlow, "" + (if BuySellVolAvgFlow>0 then "+" else "-") + round(BuySellVolAvgFlow / volume * 100,0) + "%  ", (if BuySellVolAvgFlow > 0 then Color.DARK_GREEN else if BuySellVolAvgFlow < 0 then Color.DARK_RED else Color.WHITE) );

AddLabel(ShowLabel && ShowTodayVolume, "Today: " + today + "  ", (if percentOfXDay >= UnusualVolumePercent then Color.GREEN else if percentOfXDay >= 100 then Color.ORANGE else Color.LIGHT_GRAY));

AddLabel(ShowLabel && ShowPercentOfXDayAvg, percentOfXDay + "%  ", (if percentOfXDay >= UnusualVolumePercent then Color.GREEN else if percentOfXDay >= 100 then Color.ORANGE else Color.WHITE) );

#AddLabel(Show30BarAvg, "Avg 30Bars: " + Round(avg30Bars, 0), Color.LIGHT_GRAY);

#AddLabel(ShowCurrentBar, "curBar: " + curVolume, (if percentOf30Bar >= UnusualVolumePercent then Color.GREEN else if PercentOf30Bar >= 100 then Color.ORANGE else Color.LIGHT_GRAY));

#AddLabel(ShowPercentOf30BarAvg, PercentOf30Bar + "%", (if PercentOf30Bar >= UnusualVolumePercent then Color.GREEN else if PercentOf30Bar >= 100 then Color.ORANGE else Color.WHITE) );

AddLabel(ShowLabel && ShowSellVolumePercent, "Current Sell: " + SellVolPercent + "%   ", (if SellVolPercent > 51 then Color.RED else if SellVolPercent < 49 then Color.GREEN else Color.ORANGE));

AddLabel(ShowLabel && ShowVolumeStacking, "Acc.Vol%(Now, Avg): " + Round(VolAcc / volume * 100, 0) + ", " +  Round(VolAcc / VolAvgBuy * 100, 0) + "    " , (if VolAcc >= 0 then Color.GREEN else Color.RED));

def sellPercent = Round((selling / volume) * 100, 0);

AddChartBubble(ShowSellVolPercentage and sellPercent < 45, 
if ShowMirrorView then SellVol else volume
, sellPercent + "%", Color.GREEN, if ShowMirrorView then 0 else 1);

AddChartBubble(ShowSellVolPercentage and sellPercent > 55, 
if ShowMirrorView then SellVol else volume
, sellPercent + "%", Color.RED, if ShowMirrorView then 0 else 1);

AddChartBubble(ShowSellVolPercentage and sellPercent <= 55 and sellPercent >= 45, 
if ShowMirrorView then SellVol else volume
, sellPercent + "%", Color.WHITE, if ShowMirrorView then 0 else 1);

