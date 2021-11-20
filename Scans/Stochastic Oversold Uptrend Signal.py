input over_bought = 80.0;
input over_sold = 20.0;
input percentDLength = 3;
input percentKLength = 14;
input smoothK = 3;

def min_low = Lowest(low, percentKLength);
def max_high = Highest(high, percentKLength);
def stoch = 100 * (close - Lowest(low, percentKLength)) / (Highest(high, percentKLength) - Lowest(low, percentKLength));

def SMI = Average(stoch, smoothK);
def AvgSMI = Average(SMI, percentDLength);

def xUp = if SMI crosses above AvgSMI and SMI < 30 then AvgSMI else  Double.NaN;
#def xDn = if SMI crosses below AvgSMI and SMI > 70 then AvgSMI else  Double.NaN;

plot scan = xUp and SMI < 50;