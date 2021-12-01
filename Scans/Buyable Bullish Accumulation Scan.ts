#TOS Indicators
#Home of the Volatility Box
#More info regarding this indicator here: tosindicators.com/indicators/market-pulse
#Code written in 2019 
#Full Youtube Tutorial here: https://youtu.be/Hku6dLR-m_A

#input ChartBubblesOn = no;

input price = close;
input length = 10;

def tmp1 = if price > price[1] then price - price[1] else 0;
def tmp2 = if price[1] > price then price[1] - price else 0;
def d2 = sum(tmp1, length);
def d4 = sum(tmp2, length);
def cond = d2 + d4 == 0;
def ad3 = if cond then 0 else (d2 - d4) / (d2 + d4) * 100;
def coeff = 2 / (length + 1) * AbsValue(ad3) / 100;
def asd = compoundValue("visible data" = coeff * price + (if IsNaN(asd[1]) then 0 else asd[1]) * (1 - coeff), "historical data" = price
);
def VMA = asd;

def vwma8 = sum(volume * close, 8) / sum(volume, 8);
def vwma21 = sum(volume * close, 21) / sum(volume, 21);
def vwma34 = sum(volume * close, 34) / sum(volume, 34);

def bullish = if vwma8 > vwma21 and vwma21 > vwma34 then 1 else 0;
def bearish = if vwma8 < vwma21 and vwma21 < vwma34 then 1 else 0;
def distribution = if !bullish and !bearish then 1 else 0;

#plot bullishAccumulationScan = if bullish then 1 else if bearish then 0 else if close>=VMA then 1 else 0;

#PriceMomentumForSwingTrading
#https://usethinkscript.com/threads/ultimate-bullish-cross-using-price-momentum-and-volume-for-swingtrading.3230/
input Shortlength = 13; #hint Signal Fast Line
input LongLength = 50; #hint Slow Line
# input price = close;

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
# plot zeroline = 0;

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

# AddLabel( avgBullishInertia, "Long Plays Only" , Color.CYAN);
# AddLabel( bullishLongSignal, "Buy" , Color.Green);
# AddLabel( bearishLongSignal, "Sell" , Color.Red);
# AddLabel( longHoldSignal, "Hold Long" , Color.Green);
# AddLabel(bearishPivotSignal, "Possible Bearish Pivot Point", Color.Red);
# AddLabel(UncertainBullSignal, "Avoid Buys",Color.Blue);

# AddLabel( avgBearishInertia, "Short Plays Only", Color.Dark_RED);
# AddLabel( bullishShortSignal, "Short", Color.Green);
#AddLabel( bearishShortSignal, "Cover Short", Color.Red);
#AddLabel( shortHoldSignal, "Hold Short", Color.Green);
#AddLabel(bullishPivotSignal, "Possible Bullish Pivot Point", Color.Green);
#AddLabel(UncertainBearSignal, "Avoid Shorts",Color.Blue);

def stageResult =  if bullish then 1 else if bearish then 0 else if close>=VMA then 1 else 0;
def priceMomentumResult = avgBullishInertia and (bullishLongSignal or bullishPivotSignal);

plot scan = if stageResult and priceMomentumResult then 1 else 0;
