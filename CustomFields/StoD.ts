
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

def overbought = over_bought;
def oversold = over_sold;
#def xUp = if SMI crosses above AvgSMI and SMI < -10 then AvgSMI else  Double.NAN;
#def xDn = if SMI crosses below AvgSMI and SMI > 10 then AvgSMI else  Double.NAN;
#def sign = if SMI[1] > SMI then -1 else 1;
def side = if SMI > SMI[1] then 1 else -1;
plot val = AvgSMI * side;
val.assignValueColor(if SMI[1] < SMI then
                        color.dark_green else 
                        if SMI[1] > SMI then 
                        color.dark_red
                        else
                        color.white);
assignbackgroundcolor(if side < 0 then color.BLACK else if SMI < over_sold then color.cyan else
                       if SMI >= over_sold and SMI <= 60 then color.green else 
                       if SMI > over_bought then color.magenta else
                       color.black);