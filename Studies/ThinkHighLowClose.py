# Previous High, Low, Close

declare upper;

def Today = if GetLastDay() == GetDay() then 1 else 0;
def DrawHighs = if (close < high(period="day" )[1] AND close > low(period="day" )[1]) OR high(period="day" ) > high(period="day" )[1] then 1 else 0;
def DrawLows = if (close < high(period="day" )[1] AND close > low(period="day" )[1]) OR low(period="day" ) < low(period="day" )[1] then 1 else 0;

plot OpenPivot = if Today then open(period = "day" )[0] else Double.NaN;
OpenPivot.SetDefaultColor(Color.GRAY);
OpenPivot.SetLineWeight(1);

plot yClose = if Today then close(period = "day" )[1] else Double.NaN;
yClose.SetDefaultColor(Color.LIGHT_GRAY);
yClose.SetLineWeight(1);
yClose.SetStyle(Curve.MEDIUM_DASH);

plot yhi = if Today  then high(period = "day" )[1] else Double.NaN;
yhi.SetDefaultColor(Color.CYAN);
yhi.SetLineWeight(2);

plot sweethi = if Today  then (if yhi * 1.01 > yhi + 0.75 then yhi + 0.75 else yhi * 1.01) else Double.NaN;
sweethi.SetDefaultColor(Color.CYAN);
sweethi.SetStyle(Curve.SHORT_DASH);

plot ylo = if Today then  low(period = "day" )[1] else Double.NaN;
ylo.SetDefaultColor(Color.PINK);
ylo.SetLineWeight(2);

plot sweetlo = if Today then  (if ylo * 0.99 < ylo - 0.75 then ylo - 0.75 else ylo * 0.99) else Double.NaN;
sweetlo.SetDefaultColor(Color.PINK);
sweetlo.SetStyle(Curve.SHORT_DASH);
