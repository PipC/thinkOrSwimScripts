#Title: Stochastic_SchaffTrendCycle
declare lower;

input over_bought = 80.0;
input over_sold = 20.0;
input percentDLength = 3;
input percentKLength = 14;
input KPeriodTrend = 36;
input DPeriodTrend = 8;
input fastLengthTrend = 48;
input slowLengthTrend = 104;
input smoothK = 3;
input averageTypeTrend = AverageType.EXPONENTIAL;

def min_low = Lowest(low, percentKLength);
def max_high = Highest(high, percentKLength);
def stoch = 100 * (close - Lowest(low, percentKLength)) / (Highest(high, percentKLength) - Lowest(low, percentKLength));

plot SMI = Average(stoch, smoothK);
plot AvgSMI = Average(SMI, percentDLength);

SMI.SetDefaultColor(Color.RED);
AvgSMI.SetDefaultColor(Color.GREEN);

SMI.setLineWeight(2);
AvgSMI.setLineWeight(2);

plot overbought = over_bought;
overbought.SetDefaultColor(Color.DARK_RED);

plot oversold = over_sold;
oversold.SetDefaultColor(Color.DARK_GREEN);

plot xUp = if SMI crosses above AvgSMI and SMI < 30 then AvgSMI else  Double.NaN;
plot xDn = if SMI crosses below AvgSMI and SMI > 70 then AvgSMI else  Double.NaN;

xUp.SetDefaultColor(Color.GREEN);
xUp.SetPaintingStrategy(PaintingStrategy.POINTS);
xUp.SetLineWeight(3);

xDn.SetDefaultColor(Color.RED);
xDn.SetPaintingStrategy(PaintingStrategy.POINTS);
xDn.SetLineWeight(3);

input fastLengthWave = 12;
input slowLengthWave = 26;
input KPeriodWave = 9;
input DPeriodWave = 2;

input averageTypeWave = AverageType.WILDERS;

def macdWave = MovingAverage(averageTypeWave, close, fastLengthWave) - MovingAverage(averageTypeWave, close, slowLengthWave);
def fastK1Wave = FastKCustom(macdWave, KPeriodWave);
def fastD1Wave = MovingAverage(averageTypeWave, fastK1Wave, DPeriodWave);
def fastK2Wave = FastKCustom(fastD1Wave, KPeriodWave);
plot STCWave = MovingAverage(averageTypeWave, fastK2Wave, DPeriodWave);

STCWave.SetLineWeight(1);

STCWave.SetDefaultColor(GetColor(8));
OverBought.SetDefaultColor(GetColor(7));
OverSold.SetDefaultColor(GetColor(7));


#stcVal >= ob ? stcUpColor : stcVal <= os ? stcDnColor : na

#STCWave.AssignValueColor(if STCWave > STCWave[1] then Color.MAGENTA else Color.CYAN);
STCWave.AssignValueColor(
    if STCWave >= over_bought + 20 then Color.MAGENTA else
    if STCWave <= over_sold - 20 then Color.CYAN else
    if STCWave < STCWave[1] then Color.MAGENTA
    else if AvgSMI > AvgSMI[1] then Color.CYAN else Color.MAGENTA);
STCWave.SetPaintingStrategy(PaintingStrategy.LINE);

plot STCWaveDn = if STCWave < STCWave[1] and STCWave[1] >= STCWave[2] then STCWave else Double.NaN;
STCWaveDn.SetPaintingStrategy(PaintingStrategy.POINTS);
STCWaveDn.SetDefaultColor(Color.Red);
STCWaveDn.SetLineWeight(3);

plot STCWaveUp = if STCWave > STCWave[1] and STCWave[1] <= STCWave[2] then STCWave else Double.NaN;
STCWaveUp.SetPaintingStrategy(PaintingStrategy.POINTS);
STCWaveUp.SetDefaultColor(Color.Green);
STCWaveUp.SetLineWeight(3);


def macdTrend = MovingAverage(averageTypeTrend, close, fastLengthTrend) - MovingAverage(averageTypeTrend, close, slowLengthTrend);
def fastK1Trend = FastKCustom(macdTrend, KPeriodTrend);
def fastD1Trend = MovingAverage(averageTypeTrend, fastK1Trend, DPeriodTrend);
def fastK2Trend = FastKCustom(fastD1Trend, KPeriodTrend);
plot STCTrend = MovingAverage(averageTypeTrend, fastK2Trend, DPeriodTrend);
STCTrend.SetDefaultColor(Color.GRAY);
STCTrend.DefineColor("Up", Color.DARK_GREEN);
STCTrend.DefineColor("Down", Color.DARK_RED);
STCTrend.AssignValueColor(if STCTrend > STCTrend[1] then STCTrend.Color("Up") else STCTrend.Color("Down"));
STCTrend.SetLineWeight(2);
STCTrend.SetPaintingStrategy(PaintingStrategy.LINE);

plot STCTrendDn = if STCTrend < STCTrend[1] and STCTrend[1] >= STCTrend[2] then STCTrend else Double.NaN;
STCTrendDn.SetPaintingStrategy(PaintingStrategy.POINTS);
STCTrendDn.SetDefaultColor(Color.Red);
STCTrendDn.SetLineWeight(3);

plot STCTrendUp = if STCTrend > STCTrend[1] and STCTrend[1] <= STCTrend[2] then STCTrend else Double.NaN;
STCTrendUp.SetPaintingStrategy(PaintingStrategy.POINTS);
STCTrendUp.SetDefaultColor(Color.Green);
STCTrendUp.SetLineWeight(3);

input WTChannelLength = 10;
input WTAverageLength = 21;

def n1 = WTChannelLength;
def n2 = WTAverageLength;

def ap = HLC3;
def esa = ExpAverage(ap, n1);
def dx = ExpAverage(AbsValue(ap - esa), n1);
def ci = (ap - esa) / (0.015 * dx);
def tci = ExpAverage(ci, n2);

plot wt1 = tci +50;
plot wt2 = MovingAverage(AverageType.SIMPLE, wt1, 4);

wt1.setDefaultColor(Color.dark_orange);
wt2.setDefaultColor(Color.dark_orange);

wt1.setLineWeight(1);
wt2.setLineWeight(1);

wt2.setpaintingStrategy(PaintingStrategy.POINTS);

plot wtDN = if wt2 crosses above wt1 then wt2 else Double.NaN;
plot wtUP = if wt1 crosses above wt2 then wt2 else Double.NaN;

wtDN.setPaintingStrategy(PaintingStrategy.ARROW_DOWN);
wtUP.setPaintingStrategy(PaintingStrategy.ARROW_UP);

