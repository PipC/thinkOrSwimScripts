declare lower;

def Data = close("VIX");

input dataAverageType = AverageType.EXPONENTIAL;
input dataAverageLength = 10;

plot Close = (Data);
plot dataAverage = Average(Data, dataAverageLength);
