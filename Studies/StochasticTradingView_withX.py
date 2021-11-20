declare lower;

input over_bought = 80.0;
input over_sold = 20.0;
input percentDLength = 3;
input percentKLength = 14;
input smoothK = 3;

def min_low = Lowest(low, percentKLength);
def max_high = Highest(high, percentKLength);
def stoch = 100 * (close - Lowest(low, percentKLength)) / (Highest(high, percentKLength) - Lowest(low, percentKLength));

plot SMI = Average(stoch, smoothK);
plot AvgSMI = Average(SMI, percentDLength);

SMI.SetDefaultColor(GetColor(1));

AvgSMI.SetDefaultColor(GetColor(5));

plot overbought = over_bought;
overbought.SetDefaultColor(Color.DARK_RED);

plot oversold = over_sold;
oversold.SetDefaultColor(Color.DARK_GREEN);

plot xUp = if SMI crosses above AvgSMI and SMI < 30 then AvgSMI else  Double.NaN;
xUp.SetDefaultColor(Color.GREEN);
xUp.SetPaintingStrategy(PaintingStrategy.POINTS);
xUp.SetLineWeight(3);

plot xDn = if SMI crosses below AvgSMI and SMI > 70 then AvgSMI else  Double.NaN;
xDn.SetDefaultColor(Color.RED);
xDn.SetPaintingStrategy(PaintingStrategy.POINTS);
xDn.SetLineWeight(3);