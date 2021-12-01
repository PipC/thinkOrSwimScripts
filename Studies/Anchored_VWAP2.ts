## START STUDY
## Anchored_VWAP2
## linus, 2014-03-10, v0.1

#10:24 linus: it carries over the previous pivot's lines for high, low and close. (it plots vwaps of the high, low and close that are reset each time a new pivot is found.)
#10:25 linus: i wrote it to experiment with vwap as stops. (the high and low vwaps that can be offset by the ticks input.)
#10:25 linus: but it should serve as an example of how to reset the vwaps based on a signal.
#10:35 linus: #hint: VWAP stops anchored off  fractalTrader pivots.
#10:37 linus: the code calculates the pivots as PivH and PivL, and then restarts the high, low and close vwaps when it finds a new pivot.  Otherwise it continues to calculate the high, low and close vwaps.
#10:37 linus: the dashed vwap plots are the saved from the previous pivot, and the solid vwap plots are since the last pivot.


#hint: VWAP stops anchored off  fractalTrader pivots.

#hint n: Lookback period for finding swing highs, lows.
input n = 20;

#hint ticks: Offset High/Low VWAP lines by this number of ticks.
input ticks = 2.0;

def bnOK = BarNumber() > n;

def isHigher = fold i = 1 to n + 1 with p = 1
               while p do high > GetValue(high, -i);

def HH = if bnOK and isHigher
         and high == Highest(high, n)
         then high else Double.NaN;

def isLower = fold j = 1 to n + 1 with q = 1
              while q do low < GetValue(low, -j);

def LL = if bnOK and isLower
         and low == Lowest(low, n)
         then low else Double.NaN;

def PivH = if HH > 0 then HH else Double.NaN;
def PivL = if LL > 0 then LL else Double.NaN;

plot Up = !IsNaN(PivL);
Up.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_UP);
Up.SetLineWeight(2);
Up.SetDefaultColor(Color.WHITE);

plot Dn = !IsNaN(PivH);
Dn.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_DOWN);
Dn.SetLineWeight(2);
Dn.SetDefaultColor(Color.ORANGE);

def LocH = (high + (TickSize() * ticks)) * volume;
def LocL = (low - (TickSize() * ticks)) * volume;
def LocC = close * volume;

rec PC;
rec VC;
rec PC2;
rec VC2;
rec PH;
rec VH;
rec PL;
rec VL;
rec PH2;
rec VH2;
rec PL2;
rec VL2;

if Dn or Up {
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

if Dn {
    PH = LocH;
    VH = volume;
    PH2 = PH[1];
    VH2 = VH[1];
} else {
    PH = CompoundValue(1, LocH + PH[1], Double.NaN);
    VH = CompoundValue(1, volume + VH[1], Double.NaN);
    PH2 = CompoundValue(1, LocH + PH2[1], Double.NaN);
    VH2 = CompoundValue(1, volume + VH2[1], Double.NaN);
}
if Up  {
    PL = LocL;
    VL = volume;
    PL2 = PL[1];
    VL2 = VL[1];
} else {
    PL = CompoundValue(1, LocL + PL[1], Double.NaN);
    VL = CompoundValue(1, volume + VL[1], Double.NaN);
    PL2 = CompoundValue(1, LocL + PL2[1], Double.NaN);
    VL2 = CompoundValue(1, volume + VL2[1], Double.NaN);
}

plot VwapC = if Dn or Up then Double.NaN else PC / VC;
plot VwapC2 = if Dn or Up then Double.NaN else PC2 / VC2;
plot VwapH = if Dn then Double.NaN else PH / VH;
plot VwapL = if Up then Double.NaN else PL / VL;
plot VwapH2 = if Dn then Double.NaN else PH2 / VH2;
plot VwapL2 = if Up then Double.NaN else PL2 / VL2;

VwapC.SetDefaultColor(Color.YELLOW);
VwapC.SetLineWeight(2);
VwapC.HideBubble();

VwapC2.SetDefaultColor(Color.YELLOW);
VwapC2.SetLineWeight(2);
VwapC2.SetStyle(Curve.SHORT_DASH);
VwapC2.HideBubble();

VwapH.SetDefaultColor(Color.DARK_RED);
VwapH.HideBubble();

VwapL.SetDefaultColor(Color.DARK_GREEN);
VwapL.HideBubble();

VwapH2.SetDefaultColor(Color.DARK_RED);
VwapH2.SetStyle(Curve.SHORT_DASH);
VwapH2.HideBubble();

VwapL2.SetDefaultColor(Color.DARK_GREEN);
VwapL2.SetStyle(Curve.SHORT_DASH);
VwapL2.HideBubble();


Alert(PivL,"VWAP Signal BUY",alert.BAR,Sound.Bell);
Alert(PivH, "VWAP Signal Sell", Alert.BAR, Sound.Ding);