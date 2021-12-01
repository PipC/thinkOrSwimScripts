
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
def side = if AvgSMI > AvgSMI[1] then 1 else -1;
def val = AvgSMI * side;

#Wave

input fastLengthWave = 12;
input slowLengthWave = 26;
input KPeriodWave = 9;
input DPeriodWave = 2;

input averageTypeWave = AverageType.WILDERS;

def macdWave = MovingAverage(averageTypeWave, close, fastLengthWave) - MovingAverage(averageTypeWave, close, slowLengthWave);
def fastK1Wave = FastKCustom(macdWave, KPeriodWave);
def fastD1Wave = MovingAverage(averageTypeWave, fastK1Wave, DPeriodWave);
def fastK2Wave = FastKCustom(fastD1Wave, KPeriodWave);
def STCWave = MovingAverage(averageTypeWave, fastK2Wave, DPeriodWave);
#stcVal >= ob ? stcUpColor : stcVal <= os ? stcDnColor : na

#STCWave.AssignValueColor(if STCWave > STCWave[1] then Color.MAGENTA else Color.CYAN);
#STCWave.AssignValueColor(
#    if STCWave >= over_bought + 20 then Color.MAGENTA else 
#    if STCWave <= over_sold - 20 then Color.CYAN else 
#    if STCWave < STCWave[1] then Color.MAGENTA 
#    else if AvgSMI > AvgSMI[1] then Color.CYAN else Color.MAGENTA);
#STCWave.SetPaintingStrategy(PaintingStrategy.LINE);


input price = HL2;
input HMA_Length = 55;
input lookback = 2;
input tradesize = 1;
input lineweight = 1;

# I read somewhere that it's faster to define nan's and then use the def'd var rather than call double.nan every time.
def nan = double.nan;

def HMA = HullMovingAvg(price = price, length = HMA_Length);


plot scan = if side > 0 
and SMI > 15
and SMI < 70 
and STCWave < 15
#and STCWave > 10
#and STCWave[1] < 70
#and STCWave > 10 
and SMI > SMI[1] 
and STCWave >= STCWave[1] 
and close > close[3]
and (close >= HMA or high >= HMA)
then 1 
else 0
;
#assignbackgroundcolor(if side < 0 then color.BLACK else if SMI < over_sold then color.cyan else
#                       if SMI >= over_sold and SMI <= 50 then color.green else 
#                       if SMI > over_bought then color.magenta else
#                       color.black);