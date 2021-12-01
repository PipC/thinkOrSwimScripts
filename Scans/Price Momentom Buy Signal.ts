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
def zeroline = 0;

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


#Inertias.DefineColor("Up", GetColor(1));
#Inertias.DefineColor("Down", GetColor(0));
#Inertias.AssignValueColor(if Inertias >= avgInertia then Inertias.color("Up") else Inertias.color("Down"));
#Inertias.SetLineWeight(2);
#zeroline.SetDefaultColor(Color.GRAY);
# avgInertia.SetDefaultColor(Color.RED);
#avgInertia.AssignValueColor(if avgInertia >= 0 then Color.GREEN else Color.RED);
#avgInertia.SetLineWeight(2);

#def Inertias = volumeMultiplier*PriceMomo;
#def avgInertia = ExpAvgMomoPrice;
#def zeroline = 0;

def buyable = (Inertias > avgInertia and avgInertia > 0) 
and (Inertias[1] <= avgInertia[1] or Inertias[2] <= avgInertia[2] or Inertias[3] <= avgInertia[3]); # today inertias higher than avgInertia but yesterday or 2 days before are not

plot scan = buyable and (bullishLongSignal or longHoldSignal); # ;
#plot scan = (bullishLongSignal or longHoldSignal or bearishPivotSignal); 


