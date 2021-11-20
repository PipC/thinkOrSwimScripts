#
# TD Ameritrade IP Company, Inc. (c) 2008-2021
#

declare lower;

input over_bought = 40.0;
input over_sold = -40.0;
input percentDLength = 3;
input percentKLength = 14;

def min_low = Lowest(low, percentKLength);
def max_high = Highest(high, percentKLength);
def rel_diff = close - (max_high + min_low) / 2;
def diff = max_high - min_low;

def avgrel = ExpAverage(ExpAverage(rel_diff, percentDLength), percentDLength);
def avgdiff = ExpAverage(ExpAverage(diff, percentDLength), percentDLength);

plot SMI = if avgdiff != 0 then avgrel / (avgdiff / 2) * 100 else 0;
SMI.SetDefaultColor(GetColor(1));

plot AvgSMI = ExpAverage(SMI, percentDLength);
AvgSMI.SetDefaultColor(GetColor(5));

plot overbought = over_bought;
overbought.SetDefaultColor(Color.DARK_RED);

plot oversold = over_sold;
oversold.SetDefaultColor(Color.DARK_GREEN);

plot xUp = if SMI crosses above AvgSMI and SMI < -10 then AvgSMI else  Double.NAN;
xUp.SetDefaultColor(Color.GREEN);
xUp.SetPaintingStrategy(PaintingStrategy.POINTS);
xUp.SetLineWeight(3);

plot xDn = if SMI crosses below AvgSMI and SMI > 10 then AvgSMI else  Double.NAN;
xDn.SetDefaultColor(Color.RED);
xDn.SetPaintingStrategy(PaintingStrategy.POINTS);
xDn.SetLineWeight(3);
