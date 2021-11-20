input entryLength = 40;
input exitLength = 15;
input atrLength = 20;
input atrFactor = 0.9;
input atrStopFactor = 4.0;
input atrAverageType = AverageType.SIMPLE;

def entryUpper = Highest(high, entryLength)[1];
def entryLower = Lowest(low, entryLength)[1];
def exitUpper = Highest(high, exitLength)[1];
def exitLower = Lowest(low, exitLength)[1];

def atr = reference ATR(length = atrLength, "average type" = atrAverageType);
def volatilityOk = TrueRange(high, low, close)[1] < atrFactor * atr[1];

def buyToOpen = (atrFactor == 0 or volatilityOk) and high > entryUpper;
def sellToOpen = (atrFactor == 0 or volatilityOk) and low < entryLower;
def buyToClose = high > exitUpper;
def sellToClose = low < exitLower;

def position = {default none, long, short};
position = if (buyToOpen or (position[1] == position.long and !sellToClose)) then position.long
    else if (sellToOpen or (position[1] == position.short and !buyToClose)) then position.short
    else position.none;

plot BuyStop;
plot CoverStop;
if (position[1] == position.short) {
    BuyStop = Double.NaN;
    CoverStop = exitUpper;
} else {
    BuyStop = entryUpper;
    CoverStop = Double.NaN;
}

plot ShortStop;
plot SellStop;
if (position[1] == position.long) {
    ShortStop = Double.NaN;
    SellStop = exitLower;
} else {
    ShortStop = entryLower;
    SellStop = Double.NaN;
}

BuyStop.SetDefaultColor(GetColor(3));
CoverStop.SetDefaultColor(GetColor(6));
ShortStop.SetDefaultColor(GetColor(4));
SellStop.SetDefaultColor(GetColor(5));

AddOrder(OrderType.BUY_TO_OPEN, buyToOpen, tickcolor = GetColor(3), arrowcolor = GetColor(3), name = "DcLE");
AddOrder(OrderType.SELL_TO_OPEN, sellToOpen, tickcolor = GetColor(4), arrowcolor = GetColor(4), name = "DcSE");
AddOrder(OrderType.SELL_TO_CLOSE, sellToClose, tickcolor = GetColor(5), arrowcolor = GetColor(5), name = "DcLX");
AddOrder(OrderType.BUY_TO_CLOSE, buyToClose, tickcolor = GetColor(6), arrowcolor = GetColor(6), name = "DcSX");

def entryPrice = EntryPrice();

AddOrder(OrderType.SELL_TO_CLOSE, if atrStopFactor != 0 then low < entryPrice - atrStopFactor * atr else no, tickcolor = GetColor(5), arrowcolor = GetColor(7), name = "DcATRLX");
AddOrder(OrderType.BUY_TO_CLOSE, if atrStopFactor != 0 then high > entryPrice + atrStopFactor * atr else no, tickcolor = GetColor(6), arrowcolor = GetColor(8), name = "DcATRSX");