# ref.: https://usethinkscript.com/threads/pivot-confirmation-with-trading-levels.1843/

#hint: Buy when sellToClose (redline) and buy signal having low risk

def Data = close;

#hint labels: display labels
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
#hint tradeSize: trading size
input tradeSize = 1;

def openingLots = Max(4, initialLots);
def addedlots = Max(2, lotsToAdd);
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


def 
PivotConfirmed = confirmed;


def
BuyToOpen = if confirmed then c else nan;

def 
SellToClose = if !stop_hit or stop_hit crosses above 0 then stc else nan;

def 
TrailingStop = if ! trail_hit or trail_hit crosses above 0 then trail else nan;

def
Add = if !added or added crosses above 0 then retrace else nan;

def
RiskOut = if !ro_reached or ro_reached crosses above 0 then ro else nan;


#AddLabel(labels and BuyToOpen, " BuyToOpen " + openingLots + " = " + BuyToOpen + " ", Color.LIGHT_GREEN);
#AddLabel(labels and BuyToOpen, " ", CreateColor(0, 0, 0));
#AddLabel(labels and ro_reached and Add, " Add " + addedlots + " at = " + Add + " ", Color.DARK_GREEN);
#AddLabel(labels and ro_reached and Add, " ", CreateColor(0, 0, 0));
#AddLabel(labels and RiskOut, " Sell " + (openingLots - 2) + " = " + ro + " ", CreateColor(215, 215, 215));
#AddLabel(labels and RiskOut, " ", CreateColor(0, 0, 0));
#AddLabel(labels and ro_reached and TrailingStop, " Sell " + (1 + addedlots - 1) + " at = " + trail + " ", Color.PINK);
#AddLabel(labels and ro_reached and TrailingStop, " ", CreateColor(0, 0, 0));
#AddLabel(labels and SellToClose, " Sell All = " + stc + " ", Color.RED);
#AddLabel(labels and SellToClose, " ", CreateColor(0, 0, 0));

def close_open_ratio = BuyToOpen / close;

plot scan = if  close_open_ratio > 0.95 and close_open_ratio < 1.05 then 1 else 0;
