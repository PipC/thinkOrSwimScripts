#Super_OB_OS_Lower
#Created by Christopher84 04/22/2021
#Modified 5/12/2021 Adjusted OB/OS levels.
#https://usethinkscript.com/threads/confirmation-candles-indicator-for-thinkorswim.6316/


declare lower;
def BulgeLength = 75;
def SqueezeLength = 75;
def BulgeLength2 = 8;
def SqueezeLength2 = 8;

#RSI
def price = close;
def RSI_length = 14;
def RSI_AverageType = AverageType.WILDERS;
def RSI_OB = 70;
def RSI_OS = 30;

def NetChgAvg = MovingAverage(RSI_AverageType, price - price[1], RSI_length);
def TotChgAvg = MovingAverage(RSI_AverageType, AbsValue(price - price[1]), RSI_length);
def ChgRatio = if TotChgAvg != 0 then NetChgAvg / TotChgAvg else 0;
def RSI = 50 * (ChgRatio + 1);

def conditionOB1 = RSI > RSI_OB;
def conditionOS1 = RSI < RSI_OS;

#MFI
def MFI_Length = 14;
def MFIover_Sold = 20;
def MFIover_Bought = 80;
def movingAvgLength = 1;
def MoneyFlowIndex = Average(MoneyFlow(high, close, low, volume, MFI_Length), movingAvgLength);

def conditionOB2 = MoneyFlowIndex > MFIover_Bought;
def conditionOS2 = MoneyFlowIndex < MFIover_Sold;

#Forecast
def na = Double.NaN;
def MidLine = 50;
def Momentum = MarketForecast().Momentum;
def NearT =  MarketForecast().NearTerm;
def Intermed = MarketForecast().Intermediate;
def FOB = 80;
def FOS = 20;
def upperLine = 110;

def conditionOB3 = Intermed > FOB;
def conditionOS3 = Intermed < FOS;

def conditionOB4 = NearT > FOB;
def conditionOS4 = NearT < FOS;

#Polarized Fractal Efficiency
def PFE_length = 5;#Typically 10
def smoothingLength = 2.5;#Typically 5
def PFE_diff = close - close[PFE_length - 1];
def val = 100 * Sqrt(Sqr(PFE_diff) + Sqr(PFE_length)) / Sum(Sqrt(1 + Sqr(close - close[1])), PFE_length - 1);
def PFE = ExpAverage(if PFE_diff > 0 then val else -val, smoothingLength);
def UpperLevel = 50;
def LowerLevel = -50;

def conditionOB5 = PFE > UpperLevel;
def conditionOS5 = PFE < LowerLevel;

#Bollinger Bands PercentB
input BBPB_averageType = AverageType.SIMPLE;
def displace = 0;
def BBPB_length = 20;
def Num_Dev_Dn = -2.0;
def Num_Dev_up = 2.0;
def BBPB_OB = 100;
def BBPB_OS = 0;
def upperBand = BollingerBands(price, displace, BBPB_length, Num_Dev_Dn, Num_Dev_up, BBPB_averageType).UpperBand;
def lowerBand = BollingerBands(price, displace, BBPB_length, Num_Dev_Dn, Num_Dev_up, BBPB_averageType).LowerBand;
def PercentB = (price - lowerBand) / (upperBand - lowerBand) * 100;
def HalfLine = 50;
def UnitLine = 100;

def conditionOB6 = PercentB > BBPB_OB;
def conditionOS6 = PercentB < BBPB_OS;

#Projection Oscillator
def ProjectionOsc_length = 30;#Typically 10
def MaxBound = HighestWeighted(high, ProjectionOsc_length, LinearRegressionSlope(price = high, length = ProjectionOsc_length));
def MinBound = LowestWeighted(low, ProjectionOsc_length, LinearRegressionSlope(price = low, length = ProjectionOsc_length));
def ProjectionOsc_diff = MaxBound - MinBound;
def PROSC = if ProjectionOsc_diff != 0 then 100 * (close - MinBound) / ProjectionOsc_diff else 0;
def PROSC_OB = 80;
def PROSC_OS = 20;

def conditionOB7 = PROSC > PROSC_OB;
def conditionOS7 = PROSC < PROSC_OS;

#OB/OS Calculation

def OB_Level = conditionOB1 + conditionOB2 + conditionOB3 + conditionOB4 + conditionOB5 + conditionOB6 + conditionOB7;
def OS_Level = conditionOS1 + conditionOS2 + conditionOS3 + conditionOS4 + conditionOS5 + conditionOS6 + conditionOS7;

plot Consensus_Line = OB_Level - OS_Level;

plot Zero_Line = 0;
Zero_Line.SetDefaultColor(Color.WHITE);
Zero_Line.SetPaintingStrategy(PaintingStrategy.DASHES);

plot Bulge = Highest(Consensus_Line, BulgeLength);
Bulge.SetPaintingStrategy(PaintingStrategy.LINE);
Bulge.SetLineWeight(1);
Bulge.SetDefaultColor(Color.RED);

plot Squeeze = Lowest(Consensus_Line, SqueezeLength);
Squeeze.SetPaintingStrategy(PaintingStrategy.LINE);
Squeeze.SetLineWeight(1);
Squeeze.SetDefaultColor(Color.LIGHT_GREEN);

plot Bulge2 = Highest(Consensus_Line, BulgeLength2);
Bulge2.SetPaintingStrategy(PaintingStrategy.LINE);
Bulge2.SetStyle(Curve.SHORT_DASH);
Bulge2.SetLineWeight(1);
Bulge2.SetDefaultColor(Color.GRAY);

plot Squeeze2 = Lowest(Consensus_Line, SqueezeLength2);
Squeeze2.SetPaintingStrategy(PaintingStrategy.LINE);
Squeeze2.SetStyle(Curve.SHORT_DASH);
Squeeze2.SetLineWeight(1);
Squeeze2.SetDefaultColor(Color.GRAY);

input Super_OB = 4;
input Super_OS = -3;

Consensus_Line.AssignValueColor(
if Consensus_Line > Consensus_Line[1] and Consensus_Line >= Zero_Line then Color.LIGHT_GREEN
else if Consensus_Line < Consensus_Line[1] and Consensus_Line >= Zero_Line then Color.LIGHT_GREEN
else if Consensus_Line < Consensus_Line[1] and Consensus_Line < Zero_Line then Color.RED else
if Consensus_Line > Consensus_Line[1] and Consensus_Line < Zero_Line then Color.RED
else Color.GRAY);


AddCloud(Consensus_Line, Super_OB, Color.LIGHT_RED, Color.CURRENT);
AddCloud(Consensus_Line, Super_OS, Color.CURRENT, Color.LIGHT_GREEN);