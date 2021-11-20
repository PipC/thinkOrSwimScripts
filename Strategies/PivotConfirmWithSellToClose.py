# ref.: https://usethinkscript.com/threads/pivot-confirmation-with-trading-levels.1843/

#hint: Buy when sellToClose (redline) and buy signal having low risk

def Data = close;

#hint labels: display labels
input labels = yes;
#hint n: For pivot and standard deviation 
input n = 5;
#hint addAtPercentStDev: Add at this percent of standard deviation below previous low
input addAtPercentStDev = 75;
#hint initialLots: Set to preference
input initialLots = 4;
#hint lotsToAdd: Number of lots to add on a pull back 
input lotsToAdd = 2;
#hint stDevMult: trail stop multiplier 
input stDevMult = 2.0;
input TradingAmount = 5000; #Hint TradingAmount: Amount in Trade which will be divided by close price to determine the trading size.

def openingLots = Max(4, initialLots);
def addedlots = Max(2, lotsToAdd);
AddLabel(initialLots < openingLots, " Error: Initial lots must be 4 or more ", Color.CYAN);
AddLabel(lotsToAdd < addedlots, " Error: Lots to add must be 2 or more ", Color.CYAN);
def h = high;
def l = low;
def c = close;
def nan = Double.NaN;
def tick = TickSize();
def x = BarNumber();
def stDev = CompoundValue(1, StDev(c, n), nan);
def ll = l == Lowest(l, n);
def LPx = if ll then x else nan;
def LP_low = if !IsNaN(LPx) then l else LP_low[1];
def LP_High = if !IsNaN(LPx) then h else LP_High[1];
def confirmation_count = if ll then 0 else 
if c crosses above LP_High 
then confirmation_count[1] + 1 
else confirmation_count[1];
def confirmationX = if confirmation_count crosses above 0
then x else nan;
def confirmed = confirmation_count crosses above 0;

def ro;
def stc;
def trail;
def retrace;
if confirmed {
    ro = Round((c + (c - LP_low) / (openingLots - 2)) / tick, 0) * tick;
    stc = LP_low;
    trail = LP_low;
    retrace = LP_low;
} else {
    ro = CompoundValue(1, ro[1], nan);
    stc = stc[1];
    trail = Round(Max(trail[1], l[1] - stDev[1] * stDevMult) / tick, 0) * tick;
    retrace = Round(Max(retrace[1], l[1] - stDev[1] * addAtPercentStDev / 100) / tick, 0) * tick;
}

def ro_reached = if confirmed then 0 else 
if h > ro then 1 else ro_reached[1];
def added = if confirmed then 0 else
if l crosses below retrace then 1 else added[1];
def trail_hit = if confirmed then 0 else
if c < trail then 1 else trail_hit[1];
def stop_hit = if confirmed then 0 else
if l < stc then 1 else stop_hit[1];


plot 
PivotConfirmed = confirmed;
PivotConfirmed.SetDefaultColor(Color.LIGHT_GREEN);
PivotConfirmed.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_UP);

plot
BuyToOpen = if confirmed then c else nan;
BuyToOpen.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
BuyToOpen.SetDefaultColor(Color.LIGHT_GREEN);

plot 
SellToClose = if !stop_hit or stop_hit crosses above 0 then stc else nan;
SellToClose.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
SellToClose.SetDefaultColor(Color.RED);

plot 
TrailingStop = if ! trail_hit or trail_hit crosses above 0 then trail else nan;
TrailingStop.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
TrailingStop.SetDefaultColor(Color.PINK);

plot
Add = if !added or added crosses above 0 then retrace else nan;
Add.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
Add.SetDefaultColor(Color.DARK_GREEN);

plot
RiskOut = if !ro_reached or ro_reached crosses above 0 then ro else nan;
RiskOut.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
RiskOut.SetDefaultColor(CreateColor(215, 215, 215));

AddLabel(labels and BuyToOpen, " Buy: " + openingLots + " = " + BuyToOpen + " ", Color.LIGHT_GREEN);
AddLabel(labels and BuyToOpen, " ", CreateColor(0, 0, 0));
AddLabel(labels and ro_reached and Add, "Add: " + addedlots + " at = " + Add + " ", Color.DARK_GREEN);
AddLabel(labels and ro_reached and Add, " ", CreateColor(0, 0, 0));
AddLabel(labels and RiskOut, " Sell " + (openingLots - 2) + " = " + ro + " ", CreateColor(215, 215, 215));
AddLabel(labels and RiskOut, " ", CreateColor(0, 0, 0));
AddLabel(labels and ro_reached and TrailingStop, " Sell " + (1 + addedlots - 1) + ": " + trail + " ", Color.PINK);
AddLabel(labels and ro_reached and TrailingStop, " ", CreateColor(0, 0, 0));
AddLabel(labels and SellToClose, "Stop: " + stc + " ", Color.RED);
AddLabel(labels and SellToClose, " ", CreateColor(0, 0, 0));
#def totalCash = GetNetLiq();
#AddLabel(labels, "TotalCash: " + if (totalCash) then 1000 else totalCash);
#AddLabel(labels, "TradingSize: "+ 
#Round((if totalCash then totalCash else 0)*tradingToCashPortion/ (if stop_hit or trail_hit then low else high),0)
#+"~" + Round((if totalCash then totalCash else 0)*0.05/ (if stop_hit or trail_hit then low else high),0)
#, Color.WHITE);

Alert(confirmed and l crosses below stc, "Pivot SHORT Confirmed", Alert.BAR, Sound.Ding);

Alert(confirmed and h crosses above stc, "Pivot LONG Confirmed", Alert.BAR, Sound.Ding); 

def tradesizeInAction = TradingAmount / if stop_hit or trail_hit then low else high;

# (Agg / 1000 / 60 / 60) + "h"



##https://usethinkscript.com/threads/pivot-confirmation-with-trading-levels.1843/
AddOrder(condition = confirmed, type = OrderType.BUY_TO_OPEN, price = high, name = "LE", tradeSize=tradesizeInAction, tickcolor = Color.DARK_GREEN, arrowcolor = Color.DARK_GREEN);
AddOrder(condition = stop_hit, type = OrderType.SELL_TO_CLOSE, price = low, name = "LX", tradeSize=tradesizeInAction, tickcolor = Color.DARK_RED, arrowcolor = Color.DARK_RED);
AddOrder(condition = trail_hit, type = OrderType.SELL_TO_CLOSE, price = low, name = "STP", tradeSize=tradesizeInAction, tickcolor = Color.DARK_RED, arrowcolor = Color.DARK_RED);
#f/ Pivot Confirmation With Trading Levels 

