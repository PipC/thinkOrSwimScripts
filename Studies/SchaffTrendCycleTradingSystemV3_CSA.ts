#STSW = Schaff Trend Line and Schaff Wave Line
#Schaff Trend Line = Used for quick up/down trend declaration
#Schaff Wave Line = Trade Wave in the direction of trend as
#declared by Trend Line.
#Schaff Wave Line can be used alone to enter trend
#declared by the MACD.
#Schaff Wave can be used with the EMA for signals
#https://usethinkscript.com/threads/a-trend-momentum-and-cycle-trading-system-v3-0-csa.1596/page-9

declare lower;

input fastLengthTrend = 48;
input slowLengthTrend = 104;
input KPeriodTrend = 36;
input DPeriodTrend = 8;
input averageTypeTrend = AverageType.EXPONENTIAL;
input fastLengthWave = 12;
input slowLengthWave = 26;
input KPeriodWave = 9;
input DPeriodWave = 2;
input over_bought = 75;
input over_sold = 25;
input averageTypeWave = AverageType.EXPONENTIAL;

def macdTrend = MovingAverage(averageTypeTrend, close, fastLengthTrend) - MovingAverage(averageTypeTrend, close, slowLengthTrend);
def macdWave = MovingAverage(averageTypeWave, close, fastLengthWave) - MovingAverage(averageTypeWave, close, slowLengthWave);
def fastK1Trend = FastKCustom(macdTrend, KPeriodTrend);
def fastK1Wave = FastKCustom(macdWave, KPeriodWave);
def fastD1Trend = MovingAverage(averageTypeTrend, fastK1Trend, DPeriodTrend);
def fastD1Wave = MovingAverage(averageTypeWave, fastK1Wave, DPeriodWave);
def fastK2Trend = FastKCustom(fastD1Trend, KPeriodTrend);
def fastK2Wave = FastKCustom(fastD1Wave, KPeriodWave);
plot STCTrend = MovingAverage(averageTypeTrend, fastK2Trend, DPeriodTrend);
plot STCWave = MovingAverage(averageTypeWave, fastK2Wave, DPeriodWave);
plot OverBought = over_bought;
plot OverSold = over_sold;

STCTrend.SetDefaultColor(GetColor(8));
STCWave.SetDefaultColor(GetColor(8));
OverBought.SetDefaultColor(GetColor(7));
OverSold.SetDefaultColor(GetColor(7));

#plot Fifty_Line = 50;
#fifty_line.SetDefaultColor(GetColor(8));
#fifty_line.HideTitle();
#fifty_line.SetStyle(Curve.SHORT_DASH);

STCTrend.DefineColor("Up", Color.GREEN);
STCTrend.DefineColor("Down", Color.RED);
STCTrend.AssignValueColor(if STCTrend > STCTrend[1] then STCTrend.Color("Up") else STCTrend.Color("Down"));
STCTrend.SetLineWeight(3);
STCTrend.SetPaintingStrategy(PaintingStrategy.LINE);


#stcVal >= ob ? stcUpColor : stcVal <= os ? stcDnColor : na

#STCWave.AssignValueColor(if STCWave > STCWave[1] then Color.MAGENTA else Color.CYAN);
STCWave.AssignValueColor(
    if STCWave >= over_bought + 20 then Color.MAGENTA else 
    if STCWave <= over_sold - 20 then Color.CYAN else 
    if STCWave < STCWave[1] then Color.MAGENTA else Color.CYAN);
STCWave.SetPaintingStrategy(PaintingStrategy.LINE);

input lengthWave = 10;
plot AvgExpWave = ExpAverage(STCWave, lengthWave);
AvgExpWave.SetDefaultColor(GetColor(1));
AvgExpWave.AssignValueColor(if AvgExpWave > AvgExpWave[1] then Color.YELLOW else Color.DARK_ORANGE);
AvgExpWave.SetPaintingStrategy(PaintingStrategy.LINE);
#


# Slow Line
input N2_Period = 21;
input R2_Period = 5;

def Ln2 = Lowest(low, N2_Period);
def Hn2 = Highest(high, N2_Period);
def Y2 = ((close - Ln2) / (Hn2 - Ln2)) * 100;
def X2 = ExpAverage(Y2, R2_Period);


def Lxn = Lowest(X2, N2_Period);
def Hxn = Highest(X2, N2_Period);
def DSS = ((X2 - Lxn) / (Hxn - Lxn)) * 100;


def DSSb = ExpAverage(DSS, R2_Period);
#DSSb.setdefaultColor(Color.GREEN);
#DSSb.AssignValueColor(Color.GREEN);

plot DSSsignal = DSSb[1];
DSSsignal.AssignValueColor(if DSSb > DSSsignal then Color.DARK_GREEN else Color.DARK_RED);
DSSsignal.SetLineWeight(1);
DSSsignal.SetPaintingStrategy(PaintingStrategy.LINE);
