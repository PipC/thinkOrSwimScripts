#https://usethinkscript.com/threads/shared_accdiststoch_signal21-watchlist.4791/

#hint: See long term BUY/SELL signal 

declare lower;
input overbought = 1;
input oversold = 0;

plot middleLevel = (overbought + oversold) /2;
middleLevel.SetDefaultColor(Color.DARK_GRAY);

def data = if close > close[1] then close - Min(close[1], low) else if close < close[1] then close - Max(close[1], high) else 0;

def over_bought = overbought;
def over_sold = oversold;

def AD = TotalSum(data);
plot AccDist = (AD - LowestAll(AD)) / (HighestAll(AD) - LowestAll(AD));
#AccDist.SetDefaultColor(GetColor(1));

plot AccDistSMA20 = SimpleMovingAvg(AccDist, 20);
plot AccDistSMA50 = SimpleMovingAvg(AccDist, 40);
plot AccDistSMA100 = SimpleMovingAvg(AccDist, 80);
plot AccDistSMA200 = SimpleMovingAvg(AccDist, 160);
AccDistSMA20.SetDefaultColor(CreateColor(247, 223, 115));
AccDistSMA50.SetDefaultColor(CreateColor(229, 237, 11));
AccDistSMA100.SetDefaultColor(CreateColor(193, 76, 50));
AccDistSMA200.SetDefaultColor(CreateColor(134, 31, 36));

#rsAvg1.setDefaultColor(CreateColor(247, 223, 115));
#rsAvg2.SetDefaultColor(CreateColor(241, 199, 137));
#rsAvg3.SetDefaultColor(CreateColor(229, 237, 11));
#rsAvg4.SetDefaultColor(CreateColor(214, 110, 70));
#rsAvg5.SetDefaultColor(CreateColor(193, 76, 50));
#rsAvg6.SetDefaultColor(CreateColor(164, 51, 40));
#rsAvg7.SetDefaultColor(CreateColor(134, 31, 36));
#rsAvg8.SetDefaultColor(CreateColor(113, 17, 32));
#rsAvg9.SetDefaultColor(CreateColor(89, 8, 20));

input colorNormLength = 7;
AccDist.DefineColor("Highest", Color.LIGHT_ORANGE);
AccDist.DefineColor("Lowest", Color.LIGHT_GREEN);
AccDist.AssignNormGradientColor(colorNormLength, AccDist.color("Lowest"), AccDist.color("Highest"));
AccDist.setLineWeight(3);

def stoch1 = StochasticSlow("over bought" = 100, "over sold" = 0, "k period" = 9, "d period" = 3).SlowD;
#plot SlowD1 =  (stoch1 - LowestAll(stoch1)) / (HighestAll(stoch1) - LowestAll(stoch1));
#SlowD1.SetDefaultColor(GetColor(3));

def stoch2 = StochasticSlow("overbought" = 100, "over sold" = 0, "k period" = 5, "d period" = 3).SlowD;
#plot SlowD2 =  (stoch2 - LowestAll(stoch2)) / (HighestAll(stoch2) - LowestAll(stoch2));
#SlowD2.SetDefaultColor(GetColor(5));


plot one = 1;
plot zero = 0;
#plot half = 0.5;
input showBreakoutSignals = yes;

plot signalup = if AccDist crosses above (over_sold ) then over_sold else Double.NaN;
def buy = signalup == over_sold;
signalup.SetHiding(!showBreakoutSignals);
signalup.SetDefaultColor(Color.Green);
signalup.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
signalup.HideTitle();

AddChartBubble(buy, AccDist+0.4, "Buy", Color.GREEN, yes);


plot signaldown = if AccDist crosses below ( over_bought ) then over_bought else Double.NaN;
def sell = signaldown == over_bought;
signaldown.SetHiding(!showBreakoutSignals);
signaldown.SetDefaultColor(Color.Red);
signaldown.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
signaldown.HideTitle();

AddChartBubble(sell, AccDist-0.4, "Sell", Color.RED, no);

# Alerts
Alert(buy, "AccDist BUY BUY BUY ", Alert.Bar, Sound.Chimes);
Alert(sell, "AccDist SELL SELL SELL ", Alert.Bar, Sound.Bell);


