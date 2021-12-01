# Mobius
# Mobius on My Trade
# Support / Resistance          
# V01.06.2012 V02.08.2013
# Added lower bar for clouds, Volume condition for plot and Vertical line for time.
# https://usethinkscript.com/threads/high-and-low-reversals-indicator-day-trading-strategy.49/page-3#post-759

input n = 13;
input ShowLines = yes;
input PlotTime = 1215; #hint PlotTime: Enter Bars End to plot Bars Start 0 for none.
input ShowTimeMarker = no;
input ShowSupportResistLabel = no;

def h = high;
def l = low;
def v = volume;
def Firstbar = barNumber();
def Highest = fold i = 1 to n + 1
with p = 1
while p
do h > getValue(h,-i);

def HVn = if V == Highest(v, n)
then l
else Double.NaN;

def A = if (Firstbar > n
and h == highest(h, n)
and Highest)
and HVn
then h
else double.NaN;
def Alow = if (Firstbar > n
and h == highest(h, n)
and Highest)
and HVn
then l
else double.nan;
def Lowest = fold j = 1 to n + 1
with q = 1
while q
do l < getValue(l, -j);
def B = if (Firstbar > n
and l == lowest(l, n)
and Lowest)
and HVn
then l
else double.NaN;
def Bhigh = if (Firstbar > n
and l == lowest(l, n)
and Lowest)
and HVn
then h
else double.nan;
def Al = if !isNaN(A)
then A
else Al[1];
def A2 = if !isNaN(Alow)
then Alow
else A2[1];
def Bl = if !isNaN(B)
then B
else Bl[1];
def B2 = if !isNaN(Bhigh)
then Bhigh
else B2[1];

plot ph = Round(A, 2);
ph.setPaintingStrategy(PaintingStrategy.VALUES_ABOVE);

plot hL = if Al > 0 then Al else double.NaN;
hL.setHiding(!showLines);
hL.SetPaintingStrategy(PaintingStrategy.Dashes);
hL.SetDefaultColor(Color.Yellow);
plot hL2 = if A2 > 0 then A2 else double.nan;
hL2.setHiding(!showLines);
hL2.SetPaintingStrategy(PaintingStrategy.Dashes);
hL2.SetDefaultColor(Color.Yellow);
AddCloud(hL, hL2, Color.Light_Red, Color.Light_Red);
def showCtl = if hL2 > 0 then showCtl[1] + 1 else 0;
def show = !show[1];
AddChartBubble( ShowSupportResistLabel and ph[8], hL, "Resist:"+Round((hL+hL2)/2,2), Color.DARK_RED, yes);

plot pl = Round(B, 2);
pl.setPaintingStrategy(PaintingStrategy.VALUES_BELOW);

plot ll = if Bl > 0 then Bl else double.NaN;
ll.setHiding(!showLines);
ll.SetPaintingStrategy(PaintingStrategy.Dashes);
ll.SetDefaultColor(Color.Blue);
plot lH = if B2 > 0 then B2 else Double.NaN;
lH.setHiding(!showLines);
lH.SetPaintingStrategy(PaintingStrategy.Dashes);
lH.SetDefaultColor(Color.Blue);
AddCloud(ll, lH, Color.Light_Green, Color.Light_Green);
AddChartBubble( ShowSupportResistLabel and pl[8], ll, "Support:"+Round((ll+lH)/2,2), Color.DARK_GREEN, no);

# Time Markers
AddVerticalLine(SecondsTillTime(PlotTime) == 0 and ShowTimeMarker, "", Color.DARK_GRAY, Curve.SHORT_DASH);

plot priceLine = highestAll(if isNaN(close[-1]) and !isNAN(close) then close else Double.NaN);
priceLine.SetStyle(Curve.Long_Dash);
priceLine.SetDefaultColor(CreateColor(75,75,75));
priceLine.SetLineWeight(1);
# End Code