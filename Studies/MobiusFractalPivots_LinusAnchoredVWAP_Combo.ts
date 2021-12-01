# Mobius Fractal Pivots and Linus Anchored VWAP Combo
# 20180223 BLT modified Linus Anchored VWAP to work with Mobius Fractal Pivots

# 20210427 Sleepyz modified Mobius Fractal Pivots to just R1/S1 to more mimic Linus VWAP code, which does not plot properly without refreshing the chart. Now it should plot timely, but since it uses future bars, it will plot the pivot only after the future bar requirement is met. As this worked to overcome the problem in Linus' code, I did not spend anytime to try to figure out how to fix Linus' code
# ___________________________________________
# Support and Resistance Fractal Pivots
# Mobius
# V01.01.2011

# User Inputs
input n = 5;             #hint n: Length for calculations.

# Internal Script Reference
script LinePlot {
    input LineLimit = 0;
    input OnExpansion = yes;
    input data = close;
    input bar = 0;
    def ThisBar = HighestAll(bar);
    def cLine = if bar == ThisBar
                then data
                else Double.NaN;
    plot P = if ThisBar - LineLimit <= bar
             then HighestAll(cLine)
             else Double.NaN;
}

# Variables
def o = open;
def h = high;
def l = low;
def c = close;
def bar = BarNumber();
def hh = fold i = 1 to n + 1
         with p = 1
         while p
         do h > GetValue(h, -i);
def PH = if (bar > n and
             h == Highest(h, n) and
                hh)
         then h
         else Double.NaN;
def ll = fold j = 1 to n + 1
         with q = 1
         while q
         do l < GetValue(l, -j);
def PL = if (bar > n and
             l == Lowest(l, n) and
             ll)
         then l
            else Double.NaN;
def PHBar = if !IsNaN(PH)
               then bar
               else PHBar[1];
def PLBar = if !IsNaN(PL)
               then bar
               else PLBar[1];
def PointCount = if BarNumber() == 1 then 0 else
                 if IsNaN(c) then PointCount[1] else
                 if !IsNaN(PH) then Max(1, PointCount[1] + 1) else
                 if !IsNaN(PL) then Min(-1, PointCount[1] - 1)
                 else PointCount[1];
def PHL = if !IsNaN(PH)
             then PH
             else PHL[1];
def priorPHBar = if PHL != PHL[1]
                    then PHBar[1]
                    else priorPHBar[1];
def PLL = if !IsNaN(PL)
             then PL
             else PLL[1];
def priorPLBar = if PLL != PLL[1]
                    then PLBar[1]
                    else priorPLBar[1];
def HighPivots = bar >= HighestAll(priorPHBar);
def LowPivots = bar >= HighestAll(priorPLBar);
def R1pivot = if PHL > 0 and PointCount == 1
                 then PH
                 else Double.NaN;
def S1pivot = if PLL > 0 and PointCount == -1
                 then PL
                 else Double.NaN;
def R1value = R1pivot;
def S1value = S1pivot;

# Plots
input x = 1;
def  x1 = x + 1;
input showbubbles = yes;
input showlines = yes;
plot R1 = if !showlines then Double.NaN else LinePlot(Linelimit = 0, data = phl, bar = PHBar);
R1.SetDefaultColor(Color.ORANGE);
R1.SetLineWeight(3);
AddChartBubble(showbubbles and IsNaN(c[x]) and !IsNaN(c[x1]), R1, "R1", Color.RED);

plot S1 = if !showlines then Double.NaN else LinePlot(LineLimit = 0, data = pll, bar = PLBar);
S1.SetDefaultColor(Color.WHITE);
S1.SetLineWeight(3);
AddChartBubble(showbubbles and IsNaN(c[x]) and !IsNaN(c[x1]), S1, "S1", Color.GREEN);

input showarrows = yes;
plot R1arrow = if showarrows and R1value then high else double.nan;
R1arrow.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
R1arrow.SetLineWeight(3);
R1arrow.SetDefaultColor(Color.ORANGE);
plot S1arrow = if showarrows and S1value then low else double.nan;
S1arrow.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
S1arrow.SetLineWeight(3);
S1arrow.SetDefaultColor(Color.WHITE);
# End Code Support and Resistance Fractal Pivots

# ______________________________
# Linus Anchored VWAP code
def up = !IsNaN(S1value);#modified
def dn = !IsNaN(R1value);#modified
input ticks = 0.0;
def LocH = (high + (TickSize() * ticks)) * volume;
def LocL = (low - (TickSize() * ticks)) * volume;
def LocC = close * volume;

rec PC;
rec VC;
rec PC2;
rec VC2;
rec PHV;#modified
rec VH;
rec PLV;#modified
rec VL;
rec PH2;
rec VH2;
rec PL2;
rec VL2;

if dn or up {
    PC = LocC;
    VC = volume;
    PC2 = PC[1];
    VC2 = VC[1];
} else {
    PC = CompoundValue(1, LocC + PC[1], Double.NaN);
    VC = CompoundValue(1, volume + VC[1], Double.NaN);
    PC2 = CompoundValue(1, LocC + PC2[1], Double.NaN);
    VC2 = CompoundValue(1, volume + VC2[1], Double.NaN);
}

if dn {
    PHV = LocH;
    VH = volume;
    PH2 = PHV[1];
    VH2 = VH[1];
} else {
    PHV = CompoundValue(1, LocH + PHV[1], Double.NaN);
    VH = CompoundValue(1, volume + VH[1], Double.NaN);
    PH2 = CompoundValue(1, LocH + PH2[1], Double.NaN);
    VH2 = CompoundValue(1, volume + VH2[1], Double.NaN);
}
if up  {
    PLV = LocL;
    VL = volume;
    PL2 = PLV[1];
    VL2 = VL[1];
} else {
    PLV = CompoundValue(1, LocL + PLV[1], Double.NaN);
    VL = CompoundValue(1, volume + VL[1], Double.NaN);
    PL2 = CompoundValue(1, LocL + PL2[1], Double.NaN);
    VL2 = CompoundValue(1, volume + VL2[1], Double.NaN);
}

plot VwapC  = if dn or up then Double.NaN else PC / VC;
plot VwapC2 = if dn or up then Double.NaN else PC2 / VC2;
plot VwapH  = if dn then Double.NaN else PHV / VH;
plot VwapL  = if up then Double.NaN else PLV / VL;
plot VwapH2 = if dn then Double.NaN else PH2 / VH2;
plot VwapL2 = if up then Double.NaN else PL2 / VL2;

VwapC.SetDefaultColor(Color.YELLOW);
VwapC.SetLineWeight(2);
VwapC.HideBubble();

VwapC2.SetDefaultColor(Color.YELLOW);
VwapC2.SetLineWeight(2);
VwapC2.SetStyle(Curve.SHORT_DASH);
VwapC2.HideBubble();

VwapH.SetDefaultColor(Color.DARK_RED);
VwapH.HideBubble();

VwapL.SetDefaultColor(Color.GREEN);
VwapL.HideBubble();

VwapH2.SetDefaultColor(Color.DARK_RED);
VwapH2.SetStyle(Curve.SHORT_DASH);
VwapH2.HideBubble();

VwapL2.SetDefaultColor(Color.GREEN);
VwapL2.SetStyle(Curve.SHORT_DASH);
VwapL2.HideBubble();

## END modified Linus Anchored VWAP STUDY