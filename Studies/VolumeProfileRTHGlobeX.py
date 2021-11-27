# Volume Profile for RTH and GlobeX
# Mobius
# Chat Room Discussion 03.26.2018

input pricePerRowHeightMode = {AUTOMATIC, TICKSIZE, default CUSTOM};
input customRowHeight = 1.0;
input onExpansion = no;
input profiles = 5; #Hint profiles: for just RTH 1 for GlobeX and RTH 2
input showPointOfControl = yes;
input showValueArea = yes;
input valueAreaPercent = 68;
input opacity = 5;
input RthBegin = 0930;
input RthEnd = 1600;

def TS = TickSize();
def Active = getTime() >= RegularTradingStart(getYYYYMMDD());
def cond = getTime() crosses above RegularTradingStart(getYYYYMMDD());
def height;
switch (pricePerRowHeightMode) {
case AUTOMATIC:
height = PricePerRow.AUTOMATIC;
case TICKSIZE:
height = PricePerRow.TICKSIZE;
case CUSTOM:
height = customRowHeight;
}
profile vol = VolumeProfile("startNewProfile" = cond, "onExpansion" = onExpansion, "numberOfProfiles" = profiles, "pricePerRow" = height, "value area percent" = valueAreaPercent);
def con = CompoundValue(1, onExpansion, no);
def pc = if IsNaN(vol.GetPointOfControl()) and con
then pc[1]
else vol.GetPointOfControl();
def hVA = if IsNaN(vol.GetHighestValueArea()) and con
then hVA[1]
else Round(vol.GetHighestValueArea(), 0);
def lVA = if IsNaN(vol.GetLowestValueArea()) and con
then lVA[1]
else vol.GetLowestValueArea();
def hProfile = if IsNaN(vol.GetHighest()) and con
then hProfile[1]
else vol.GetHighest();
def lProfile = if IsNaN(vol.GetLowest()) and con
then lProfile[1]
else vol.GetLowest();
def plotsDomain = IsNaN(close) == onExpansion;

plot POC = if plotsDomain
then Round(pc / TS, 0) * TS
else Double.NaN;
plot ProfileHigh = if plotsDomain
then Round(hProfile / TS, 0) * TS
else Double.NaN;
plot ProfileLow = if plotsDomain
then Round(lProfile / TS, 0) * TS
else Double.NaN;
plot VAHigh = if plotsDomain
then Round(hVA / TS, 0) * TS
else Double.NaN;
plot VALow = if plotsDomain
then Round(lVA / TS, 0) * TS
else Double.NaN;

DefineGlobalColor("Profile", GetColor(1));
DefineGlobalColor("Point Of Control", GetColor(5));
DefineGlobalColor("Value Area", GetColor(8));

vol.Show(GlobalColor("Profile"), if showPointOfControl then GlobalColor("Point Of Control") else Color.CURRENT, if showValueArea then GlobalColor("Value Area") else Color.CURRENT, opacity);

POC.SetDefaultColor(GlobalColor("Point Of Control"));
POC.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
VAHigh.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
VAHigh.HideBubble();
VAHigh.HideTitle();
VALow.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
VALow.HideBubble();
VALow.HideTitle();
VAHigh.SetDefaultColor(GlobalColor("Value Area"));
VALow.SetDefaultColor(GlobalColor("Value Area"));
ProfileHigh.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
ProfileLow.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
ProfileHigh.SetDefaultColor(GetColor(3));
ProfileLow.SetDefaultColor(GetColor(3));
ProfileHigh.Hide();
ProfileLow.Hide();
def bubble = isNaN(close[2]) and !isNaN(close[3]);
AddChartBubble(bubble, VAHigh[3], "VAH", color = Color.YELLOW, yes);
AddChartBubble(bubble, VALow[3], "VAL", Color.YELLOW, no);
AddChartBubble(bubble, POC[3], "POC", Color.RED, no);
# End Code Volume Profile RTH and GlobeX