input n = 5;#hint n: For pivot and standard deviation 
input addAtPercentStDev = 75;#hint addAtPercentStDev: Add at this percent of standard deviation below previous low
input initialLots = 4;#hint initialLots: Set to preference
input lotsToAdd = 2;#hint lotsToAdd: Number of lots to add on a pull back 
input stDevMult = 2.0;#hint stDevMult: trail stop multiplier 
input labels = yes;

#def openingLots = Max(4, initialLots);
#def addedlots = Max(2, lotsToAdd);

def h = high;
def l = low;
def c = close;
def nan = Double.NaN;
def tick = TickSize();
def x = BarNumber();
def stDev = CompoundValue(1, StDev(c, n), nan);
def ll = l == Lowest(l, n);
def LPx = if ll then x else nan; 
def LP_low = if !IsNaN(LPx) then l else LP_Low[1]; 
def LP_High = if !IsNaN(LPx) then h else LP_High[1];
def confirmation_count = if ll then 0 else 
if c crosses above LP_high 
then confirmation_count[1] + 1 
else confirmation_count[1];
#def confirmationX = if confirmation_count crosses above 0
#then x else nan;
def confirmed = confirmation_count crosses above 0;

#def ro;
def stc;
#def trail;
#def retrace;
if confirmed {
#ro = Round((c + (c - LP_Low) / (openingLots - 2)) / tick, 0) * tick;
stc = LP_Low;
#trail = LP_Low;
#retrace = LP_Low;
}else{
#ro = CompoundValue(1, ro[1], nan);
stc = stc[1];
#trail = Round(Max(trail[1], l[1] - stDev[1] * stDevMult) / tick, 0) * tick; 
#retrace = Round(Max(retrace[1], l[1] - StDev[1] * addAtPercentStDev / 100) / tick, 0) * tick; 
}

#def ro_reached = if confirmed then 0 else 
#if h > ro then 1 else ro_reached[1];
#def added = if confirmed then 0 else
#if l crosses below retrace then 1 else added[1];
#def trail_hit = if confirmed then 0 else
#if c < trail then 1 else trail_hit[1];
def stop_hit = if confirmed then 0 else
if l < stc then 1 else stop_hit[1];

#def PivotConfirmed = confirmed;
#def BuyToOpen = if confirmed then c else nan;
def SellToClose = if !stop_hit or stop_hit crosses above 0 then stc else nan;
#def TrailingStop = if ! trail_hit or trail_hit crosses above 0 then trail else nan;

#plot scan = confirmed and (SellToClose / close) < 0.9;

plot stopPct = round((1-(SellToClose / close))*100,2);

#plot stopPrice = round(SellToClose,2);

stopPct.assignValueColor(if stopPct < 0 then color.RED else 
                       if stopPct <= 5 then color.LIGHT_GREEN else
                       if stopPct > 5 and stopPct <= 8 then color.GREEN else
                       if stopPct > 8 and stopPct <= 10 then color.DARK_GREEN else color.DARK_GRAY);


