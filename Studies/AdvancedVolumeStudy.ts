#Advanced Volume Study
#welkincall@gmail.com
#v5.22.2020
declare upper;
input ShowBuySellStrength = yes;
input TickLevel = 1000;
input ShowTickLabel = yes;


def NA = Double.NaN;
def PriceRange = high - low;

#Current Candle Buy and Sell Strength
def BuyStr = ((close - low) / PriceRange) * 100;
def SellStr = ((high - close) / PriceRange) * 100;


#$TICK Vertical Lines
def tickc = close("$TICK");
def tickh = high("$TICK");
def tickl = low("$TICK");

#$TICK Label
AddLabel(if ShowTickLabel then 1 else 0,"$TICK: " + tickc + "  ", if tickc > 0 then Color.GREEN else Color.RED);

def trinRatio = Round(close(symbol="$TRIN"),2);
def trinOverlyBearish = if trinRatio >= 2 then 1 else 0;
def trinOverlyBullish = if trinRatio <= 0.5 then 1 else 0;
AddLabel(yes, "$TRIN: "+trinRatio + "  ", if trinOverlyBearish then color.green else if trinOverlyBullish then color.red else color.gray);

def pcallRatio = Round(SimpleMovingAvg(close(symbol="$PCALL"),10),2);
def pcallOverlyBearish = if pcallRatio >= 1 then 1 else 0;
def pcallOverlyBullish = if pcallratio <= 0.85 then 1 else 0;
AddLabel(yes, "$PCALL: "+pcallRatio + "  ", if pcallOverlyBearish then color.green else if pcallOverlyBullish then color.red else color.gray);

#current candle Buy/Sell strength labels
#AddLabel(if ShowBuySellStrength then 1 else 0, " ", Color.black);
#AddLabel(if ShowBuySellStrength then 1 else 0, "1", Color.GRAY);
AddLabel(if ShowBuySellStrength then 1 else 0, "Sell " + Round(SellStr, 2) + "% ", if SellStr > BuyStr then Color.RED else Color.DARK_RED);
AddLabel(if ShowBuySellStrength then 1 else 0, "Buy " + Round(BuyStr, 2) + "% ", if BuyStr > SellStr then Color.GREEN else Color.DARK_GREEN);