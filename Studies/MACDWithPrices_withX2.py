declare lower;

input ShowLabel = yes;
input price = close;
input fastLength = 12;
input slowLength = 26;
input MACDLength = 9;
input MACDLevel = 0.0;
input lineWeight = 2;
input lineWeight2 = 1;
input AverageType1 = {SMA, default EMA};
input EMA_AverageType1 = AverageType.EXPONENTIAL;
input AverageType2 = {SMA, default EMA};
input EMA_AverageType2 = AverageType.HULL;

plot Value1;
plot Avg1;
switch (AverageType1) {
case SMA:
    Value1 = Average(price, fastLength) - Average(price, slowLength);
    Avg1 = Average(Value1, MACDLength);
case EMA:
    Value1 = MovingAverage(EMA_AverageType1, price, fastLength) 
            - MovingAverage(EMA_AverageType1, price, slowLength);
    Avg1 = ExpAverage(Value1, MACDLength);
}

plot Diff = Value1 - Avg1;
plot Level = MACDLevel;

def PMACDeq = reference ReverseEngineeringMACD(price, fastLength, slowLength, MACDLength, AverageType1, MACDLevel).PMACDeq;
def PMACDlevel = reference ReverseEngineeringMACD(price, fastLength, slowLength, MACDLength, AverageType1, MACDLevel).PMACDlevel;
def PMACDsignal = reference ReverseEngineeringMACD(price, fastLength, slowLength, MACDLength, AverageType1, MACDLevel).PMACDsignal;

Value1.SetDefaultColor(GetColor(1));
Avg1.SetDefaultColor(GetColor(8));

Value1.setLineWeight(lineWeight);
Avg1.SetLineWeight(lineWeight);

plot VAXDn=if Avg1 crosses above Value1 then Avg1 else Double.NAN;
VAXDn.setPaintingStrategy(PaintingStrategy.POINTS);
VAXDn.setLineWeight(lineWeight);
VAXDn.SetDefaultColor(color.DOWNTICK);

plot VAXUp=if Value1 crosses above Avg1 then Avg1 else  Double.NAN;
VAXUp.setPaintingStrategy(PaintingStrategy.POINTS);
VAXUp.setLineWeight(lineWeight);
VAXUp.SetDefaultColor(color.UPTICK);

Diff.DefineColor("Positive and Up", Color.GREEN);
Diff.DefineColor("Positive and Down", Color.DARK_GREEN);
Diff.DefineColor("Negative and Down", Color.RED);
Diff.DefineColor("Negative and Up", Color.DARK_RED);
Diff.AssignValueColor(if Diff >= 0
        then if Diff > Diff[1] then Diff.color("Positive and Up") else Diff.color("Positive and Down")
          else if Diff < Diff[1] then Diff.color("Negative and Down") else Diff.color("Negative and Up"));
Diff.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
Diff.SetLineWeight(lineWeight);
Level.SetDefaultColor(GetColor(lineWeight));

#2
plot Value2;
plot Avg2;
switch (AverageType2) {
case SMA:
    Value2 = Average(price, fastLength) - Average(price, slowLength);
    Avg2 = Average(Value2, MACDLength);
case EMA:
    Value2 = MovingAverage(EMA_AverageType2, price, fastLength) 
            - MovingAverage(EMA_AverageType2, price, slowLength);
    Avg2 = ExpAverage(Value2, MACDLength);
}

plot Diff2 = Value2 - Avg2;
plot Level2 = MACDLevel;

def PMACDeq2 = reference ReverseEngineeringMACD(price, fastLength, slowLength, MACDLength, AverageType2, MACDLevel).PMACDeq;
def PMACDlevel2 = reference ReverseEngineeringMACD(price, fastLength, slowLength, MACDLength, AverageType2, MACDLevel).PMACDlevel;
def PMACDsignal2 = reference ReverseEngineeringMACD(price, fastLength, slowLength, MACDLength, AverageType2, MACDLevel).PMACDsignal;

Value2.SetDefaultColor(GetColor(4));
Avg2.SetDefaultColor(GetColor(7));

Value2.setLineWeight(lineWeight2);
Avg2.SetLineWeight(lineWeight2);

plot VAXDn2=if Avg2 crosses above Value2 then Avg2 else Double.NAN;
VAXDn2.setPaintingStrategy(PaintingStrategy.POINTS);
VAXDn2.setLineWeight(lineWeight2);
VAXDn2.SetDefaultColor(color.DOWNTICK);

plot VAXUp2=if Value2 crosses above Avg2 then Avg2 else  Double.NAN;
VAXUp2.setPaintingStrategy(PaintingStrategy.POINTS);
VAXUp2.setLineWeight(lineWeight2);
VAXUp2.SetDefaultColor(color.UPTICK);

Diff2.DefineColor("Positive and Up", Color.CYAN);
Diff2.DefineColor("Positive and Down", Color.BLUE);
Diff2.DefineColor("Negative and Down", Color.DARK_ORANGE);
Diff2.DefineColor("Negative and Up", Color.ORANGE);
Diff2.AssignValueColor(if Diff2 >= 0
        then if Diff2 > Diff2[1] then Diff2.color("Positive and Up") else Diff2.color("Positive and Down")
          else if Diff2 < Diff2[1] then Diff2.color("Negative and Down") else Diff2.color("Negative and Up"));
Diff2.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
Diff2.SetLineWeight(lineWeight2);
Level2.SetDefaultColor(GetColor(lineWeight2));
