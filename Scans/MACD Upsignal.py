input fastLength = 12;
input slowLength = 26;
input MACDLength = 9;
input averageType = AverageType.EXPONENTIAL;
def Value = MovingAverage(averageType, close, fastLength) - MovingAverage(averageType, close, slowLength);
def Avg = MovingAverage(averageType, Value, MACDLength);

def Diff = Value - Avg;
def ZeroLine = 0;

def UpSignal = if Diff crosses above ZeroLine then 1 else Double.NaN;
def DownSignal = if Diff crosses below ZeroLine then 1 else Double.NaN;

plot scan = UpSignal;