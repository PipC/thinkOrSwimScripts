# Original author: Unknown
# Modified by 7of9

#Inputs
input ShortTermBuySellVolAvgLength = 5;

#input VolBandAdjustment = 3;
#plot baseLine = VolBandAdjustment * volume;
#baseline.SetDefaultColor(Color.BLACK);

def O = open;
def H = high;
def C = close;
def L = low;
def V = volume;
def buying = V*(C-L)/(H-L);
def selling = V*(H-C)/(H-L);


# Selling Volume

def SellAvg = MovingAverage(AverageType.SIMPLE, selling, ShortTermBuySellVolAvgLength) * -1;

def BuyAvg = MovingAverage(AverageType.SIMPLE, buying, ShortTermBuySellVolAvgLength) * 1;

def BuySellVolAvgFlow =  SellAvg + BuyAvg ;

plot scan = BuySellVolAvgFlow crosses above 0;