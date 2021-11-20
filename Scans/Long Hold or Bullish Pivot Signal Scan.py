#PriceMomentumForSwingTrading
#https://usethinkscript.com/threads/ultimate-bullish-cross-using-price-momentum-and-volume-for-swingtrading.3230/
input Shortlength = 13; #hint Signal Fast Line
input LongLength = 50; #hint Slow Line
input price = close;

#For Price Momentum
def PriceK = (Highest(high, Shortlength) + Lowest(low, Shortlength)) /
2 + ExpAverage(close, Shortlength);
def PriceKLong = (Highest(high, Longlength) + Lowest(low, Longlength)) /
2 + ExpAverage(close, Longlength);
def PriceMomo = Inertia(price - PriceK / 2, Shortlength);
def expAvgMomoPrice = SimpleMovingAvg(PriceMomo, LongLength);

def VN = SimpleMovingAvg(volume, Shortlength);
def volumeMultiplier = (volume/VN);


def Inertias = volumeMultiplier*PriceMomo;
def avgInertia = ExpAvgMomoPrice;

def avgBullishInertia = avgInertia > 0;
def avgBearishInertia = avgInertia < 0;

def bullishLongSignal = Inertias crosses above avgInertia and avgBullishInertia;
def bearishLongSignal = Inertias crosses below avgInertia and avgBullishInertia;
def longHoldSignal = Inertias > avgInertia and !(Inertias crosses above avgInertia) and avgBullishInertia;
def bearishPivotSignal = Inertias < bearishLongSignal and Inertias < 0 and avgBullishInertia;
def UncertainBullSignal = Inertias < bearishLongSignal and Inertias > 0 and avgBullishInertia;


def bullishShortSignal = Inertias crosses below avgInertia and avgBearishInertia;
def bearishShortSignal = Inertias crosses above avgInertia and avgBearishInertia;
def shortHoldSignal = Inertias < avgInertia and !(Inertias crosses below avgInertia) and avgBearishInertia;
def bullishPivotSignal = Inertias > bearishLongSignal and Inertias > 0 and avgBearishInertia;
def UncertainBearSignal = Inertias > bearishLongSignal and Inertias < 0 and avgBearishInertia;

#AddLabel( avgBullishInertia, "Long Plays Only" , Color.CYAN);
#AddLabel( bullishLongSignal, "Buy" , Color.Green);
#AddLabel( bearishLongSignal, "Sell" , Color.Red);
#AddLabel( longHoldSignal, "Hold Long" , Color.Green);
#AddLabel(bearishPivotSignal, "Possible Bearish Pivot Point", Color.Red);
#AddLabel(UncertainBullSignal, "Avoid Buys",Color.Blue);

#AddLabel( avgBearishInertia, "Short Plays Only", Color.Dark_RED);
#AddLabel( bullishShortSignal, "Short", Color.Green);
#AddLabel( bearishShortSignal, "Cover Short", Color.Red);
#AddLabel( shortHoldSignal, "Hold Short", Color.Green);
#AddLabel(bullishPivotSignal, "Possible Bullish Pivot Point", Color.Green);
#AddLabel(UncertainBearSignal, "Avoid Shorts",Color.Blue);

plot scan = (longHoldSignal or bullishLongSignal or bullishPivotSignal);