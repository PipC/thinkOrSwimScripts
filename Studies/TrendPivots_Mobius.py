# Trend Pivots
# Mobius
# V01.01.29.2019
# Uses trend of higher highs with higher lows and trend of lower lows with lower highs to locate pivots. Distance for trend is set by the user. Confirmation of a reversal from pivots is set with a multiple of the pivot bars range. That multiple is also a user input.
# Trading Rules
# 1) Trade when price crosses and closes outside the pivot Confirmation line. At that point looking for best entry. Min trade is 2 contracts
# 2) Know your risk point before entering trade. Typical risk point is the pivot line itself. If your risk is crossed look for an exit. Never use hard stops - you'll often get out for little or no loss
# 3) Know your Risk off point before entering. Typical Risk Off is an ATR multiple. Offer Risk Off as soon as possible for a Risk Free trade
# 4) set mental stop one tick above entry when Risk Off is achieved
# 5) if trade continues your way move mental stop for your runner to last support / resistance each time a new support / resistance is hit.

input n = 5;
input R_Mult = .7;

def o = open;
def h = high;
def l = low;
def c = close;
def x = BarNumber();
def nan = Double.NaN;
def ts = tickSize();
def tr = TrueRange(h, c, l);
def hh = if Sum(h > h[1], n) >= n and
            Sum(l > l[1], n) >= n-1
         then h
         else if h > hh[1]
              then h
              else hh[1];
def xh = if h == hh
         then x
         else nan;
plot hh_ = if x >= HighestAll(xh)
           then HighestAll(if IsNaN(c[-1])
                           then hh
                           else nan)
           else nan;
     hh_.AssignValueColor(CreateColor(71, 120, 95));
     hh_.SetStyle(Curve.Long_Dash);
     hh_.HideTitle();
     hh_.HideBubble();
def hR = if h == hh
         then Round(Average(tr, n)/TickSize(), 0)*TickSize()
         else hR[1];
def PrevL = if h == hh
            then l[1]
            else PrevL[1];
plot STO = if x >= HighestAll(xh)
           then HighestAll(if IsNaN(c[-1])
           then Round((Max(PrevL, hh_ - (hR * R_Mult))) / ts, 0) * ts
                           else nan)
           else nan;
     STO.SetDefaultColor(Color.RED);
     STO.HideTitle();
     STO.HideBubble();
plot STO_RO = if x >= HighestAll(xh)
              then HighestAll(if isNaN(c[-1])
                              then STO - Min(hR, TickSize() * 16)
                              else nan)
              else nan;
     STO_RO.SetStyle(Curve.Long_Dash);
     STO_RO.SetDefaultColor(Color.White);
     STO_RO.HideBubble();
     STO_RO.HideTitle();
# AddChartBubble(x == HighestAll(x), STO_RO, "RO", STO_RO.TakeValueColor(), 0);
def ll = if Sum(l < l[1], n) >= n and
            Sum(h < h[1], n) >= n-1
         then l
         else if l < ll[1]
              then l
              else ll[1];
def xl = if l == ll
         then x
         else nan;
plot ll_ = if x >= HighestAll(xl)
           then HighestAll(if IsNaN(c[-1])
                           then ll
                           else nan)
           else nan;
     ll_.AssignValueColor(CreateColor(127, 62, 77));
     ll_.SetStyle(Curve.Long_Dash);
     ll_.HideTitle();
     ll_.HideBubble();
def lR = if l == ll
         then Round(Average(tr, n)/TickSize(), 0)*TickSize()
         else lR[1];
def PrevH = if l == ll
            then h[1]
            else PrevH[1];
plot BTO = if x >= HighestAll(xl)
           then HighestAll(if IsNaN(c[-1])
           then Round((Min(PrevH, ll_ + (lR * R_Mult))) / ts, 0) * ts
                           else nan)
           else nan;
     BTO.SetDefaultColor(Color.GREEN);
     BTO.HideTitle();
     BTO.HideBubble();
plot BTO_RO = if x >= HighestAll(xl)
              then HighestAll(if isNaN(c[-1])
                              then BTO + Min(lR, TickSize() * 16)
                              else nan)
              else nan;
     BTO_RO.SetStyle(Curve.Long_Dash);
     BTO_RO.SetDefaultColor(Color.White);
     BTO_RO.HideBubble();
     BTO_RO.HideTitle();
# AddChartBubble(x == HighestAll(x), BTO_RO, "RO", BTO_RO.TakeValueColor(), 1);
AddCloud(STO, hh_, Color.DARK_GRAY, Color.DARK_GRAY);
AddCloud(ll_, BTO, Color.DARK_GRAY, Color.DARK_GRAY);
Alert(c crosses below STO_RO, "", Alert.Bar, Sound.Ding);
Alert(c crosses above BTO_RO, "", Alert.Bar, Sound.Ding);
# End Code Trend Pivots