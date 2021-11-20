declare lower;

#------------- "Waddah Attar Explosion " ------------#

input sensitivity = 150; #"Sensitivity"
input fastLength = 20; #"FastEMA Length"
input slowLength = 40; #"SlowEMA Length"
input channelLength = 20; #"BB Channel Length"
input mult = 2.0; #"BB Stdev Multiplier"
input deadZone = 20; #"No trade zone threshold"

script calc_macd{

    input source = close;
    input fastLength = 20;
    input slowLength = 40;

    def fastMA = movAvgExponential(source, fastLength);
    def slowMA = movAvgExponential(source, slowLength);

    plot out = fastMA - slowMA;

}

script calc_BBUpper{

    input source = close;
    input length = 20;
    input mult = 2.0;

    def basis = simpleMovingAvg(source, length);
    def dev = mult * stdev(source, length);

    plot out = basis + dev;

}

script calc_BBLower{

    input source = close;
    input length = 20;
    input mult = 2.0;

    def basis = simpleMovingAvg(source, length);
    def dev = mult * stdev(source, length);

    plot out = basis - dev;

}

def t1 = (calc_macd(close, fastLength, slowLength) - calc_macd(close[1],
fastLength, slowLength)) * sensitivity;

def t2 = (calc_macd(close[2], fastLength, slowLength) -
calc_macd(close[3], fastLength, slowLength)) * sensitivity;

def e1 = (calc_BBUpper(close, channelLength, mult) - calc_BBLower(close,
channelLength, mult));

#//
def e2 = (calc_BBUpper(close[1], channelLength, mult) - calc_BBLower(close[1], channelLength, mult));

def trendUp = if t1 >= 0 then t1 else 0;
def trendDown = if t1 < 0 then (-1 * t1) else 0;

plot tUp = trendUp; #"UpTrend"
#Also try using columns to see how it looks.
tUp.setpaintingStrategy(paintingStrategy.HISTOGRAM);
tUp.assignValueColor(if trendUp < trendUp[1] then color.light_GREEN else
color.green);

plot tDn = trendDown; #"DownTrend"
tDn.setpaintingStrategy(paintingStrategy.HISTOGRAM);
tDn.assignValueColor(if trendDown < trendDown[1] then color.orange else
color.red);

plot ex = e1; #"ExplosionLine"
ex.setdefaultColor(createColor(160, 82, 45));

plot xLine = deadZone; #"DeadZoneLine"
xLine.setdefaultColor(color.blue);

#------------- "Waddah Attar Explosion " ------------#