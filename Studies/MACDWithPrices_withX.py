declare lower;

input ShowLabel = yes;
input price = close;
input fastLength = 12;
input slowLength = 26;
input MACDLength = 9;
input AverageType1 = {SMA, default EMA};
input EMA_AverageType1 = AverageType.EXPONENTIAL;
input MACDLevel = 0.0;
input lineWeight = 2;

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
AddLabel(ShowLabel, "PMACDeq: " + Round(PMACDeq[-1]), Value1.TakeValueColor());
AddLabel(ShowLabel, "PMACDlevel: " + Round(PMACDlevel[-1]), Level.TakeValueColor());
AddLabel(ShowLabel, "PMACDsignal: " + Round(PMACDsignal[-1]), GetColor(5));

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