# CCI with signals when CCI exceeds 200/-200


input length = 14;
input cci_over_sold = -200;
input cci_over_bought = 200;
input showBreakoutSignals =yes;
input showVerticalLines = yes;

def price = close + low + high;
def linDev = lindev(price, length);
def CCI = if linDev == 0 then 0 else (price - Average(price, length)) / linDev / 0.015;
def cci_OverBought = cci_over_bought;
def ZeroLine = 0;
def cci_OverSold = cci_over_sold;

def UpSignal = if CCI crosses above cci_oversold then cci_oversold else Double.Nan;
def DownSignal = if CCI crosses below cci_overbought then cci_overbought else Double.Nan;

### ADD VERTICAL LINE

def BullishAlertLines = if ShowVerticalLines == yes then CCI crosses below cci_OverSold else no;
#AddVerticalLine(BullishAlertLines, "--extreme low--", Color.gray, curve.SHORT_DASH);

def BearishAlertLines = if ShowVerticalLines == yes then CCI crosses above cci_OverBought else no;
#AddVerticalLine(BearishAlertLines, "++ extreme high ++", Color.gray, curve.SHORT_DASH);


#### Alerts
Alert(UpSignal, "       EXTREME      ", Alert.Bar, Sound.Ding);
Alert(DownSignal, "       EXTREME      ", Alert.Bar, Sound.Bell);

### SIGNALS (ARROWS)
#UpSignal.SetHiding(!showBreakoutSignals);
#DownSignal.SetHiding(!showBreakoutSignals);


#CCI.setDefaultColor(GetColor(9));
#cci_OverBought.setDefaultColor(GetColor(5));
#ZeroLine.setDefaultColor(GetColor(5));
#cci_OverSold.setDefaultColor(GetColor(5));
#UpSignal.SetDefaultColor(Color.UPTICK);
#UpSignal.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
#DownSignal.SetDefaultColor(Color.DOWNTICK);
#DownSignal.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);


############ ACC DIST code

input ad_overbought = 1;
input ad_oversold = 0;

def data = if close > close[1] then close - Min(close[1], low) else if close < close[1] then close - Max(close[1], high) else 0;

def ad_over_bought = ad_overbought;
def ad_over_sold = ad_oversold;

def AD = TotalSum(data);
def AccDist = (AD - LowestAll(AD)) / (HighestAll(AD) - LowestAll(AD));
#AccDist.SetDefaultColor(GetColor(1));

def stoch1 = StochasticSlow("over bought" = 100, "over sold" = 0, "k period" = 9, "d period" = 3).SlowD;
#plot SlowD1 =  (stoch1 - LowestAll(stoch1)) / (HighestAll(stoch1) - LowestAll(stoch1));
#SlowD1.SetDefaultColor(GetColor(3));

def stoch2 = StochasticSlow("over bought" = 100, "over sold" = 0, "k period" = 5, "d period" = 3).SlowD;
#plot SlowD2 =  (stoch2 - LowestAll(stoch2)) / (HighestAll(stoch2) - LowestAll(stoch2));
#SlowD2.SetDefaultColor(GetColor(5));

def one = 1;
def zero = 0;
#plot half = 0.5;


def signalup = if AccDist crosses above ad_over_sold then ad_over_sold else Double.NaN;
#signalup.SetHiding(!showBreakoutSignals);
#signalup.SetDefaultColor(Color.cyan);
#signalup.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
#signalup.HideTitle();

def signaldown = if AccDist crosses below ad_over_bought then ad_over_bought else Double.NaN;
#signaldown.SetHiding(!showBreakoutSignals);
#signaldown.SetDefaultColor(Color.magenta);
#signaldown.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
#signaldown.HideTitle();

# Alerts
Alert(signalup, "BUY BUY BUY ", Alert.Bar, Sound.Ding);
Alert(signaldown, "SELL SELL SELL ", Alert.Bar, Sound.Bell);


#Entry / Exit Requirements

#def Long1 = AccDist crosses above ad_over_sold;
#def ExitLong1 = AccDist crosses below ad_over_bought;

def Short1 = AccDist crosses below ad_over_bought;
def ExitShort1 = AccDist crosses above ad_over_sold;


#Order Entry

#AddOrder(OrderType.BUY_TO_OPEN, Long1, tradesize=100, tickcolor = Color.GREEN, arrowcolor = Color.GREEN, name = "LONG1");
#AddOrder(OrderType.SELL_TO_CLOSE, ExitLong1, tradesize=100, tickcolor = Color.GREEN, arrowcolor = Color.GREEN, name = "EXITLONG1");

AddOrder(OrderType.SELL_TO_OPEN, Short1, tradesize=100, tickcolor = Color.RED, arrowcolor = Color.RED, name = "SHORT1");
AddOrder(OrderType.BUY_TO_CLOSE, ExitShort1,  tradesize=100,  tickcolor = Color.RED, arrowcolor = Color.RED, name = "EXITSHORT1");


plot UArrow_signalup = if signalup or UpSignal then 1 else 0;
UArrow_signalup.SetDefaultColor(Color.GREEN);
UArrow_signalup.SetPaintingStrategy(PaintingStrategy.Boolean_arrow_up);
UArrow_signalup.setLineWeight(2);


plot DArrow_signaldown = if (signaldown or DownSignal) then 1 else 0;
DArrow_signaldown.SetDefaultColor(Color.RED);
DArrow_signaldown.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_DOWN);
DArrow_signaldown.setLineWeight(2);

#### end of code