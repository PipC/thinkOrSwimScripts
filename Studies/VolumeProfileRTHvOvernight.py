#VolumeProfile_RTHvOvernight
#JoeBone87 in TSL May 2019 (No Guarantee it will plot but math should be good)

input pricePerRowHeightMode = {default AUTOMATIC, TICKSIZE, CUSTOM};
input customRowHeight = 1.0;
input onExpansion = no;
input profiles = 1000;
input showPointOfControl = yes;
input showValueArea = yes;
input valueAreaPercent = 70;
input opacity = 50;

input rthbegin  = 0930;
input rthend    = 1600;
def count = secondsfromTime(rthbegin)>0 and secondstillTime(rthend)>0;
def cond = count != count[1];
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
def pc = if IsNaN(vol.GetPointOfControl()) and con then pc[1] else vol.GetPointOfControl();
def hVA = if IsNaN(vol.GetHighestValueArea()) and con then hVA[1] else vol.GetHighestValueArea();
def lVA = if IsNaN(vol.GetLowestValueArea()) and con then lVA[1] else vol.GetLowestValueArea();

def hProfile = if IsNaN(vol.GetHighest()) and con then hProfile[1] else vol.GetHighest();
def lProfile = if IsNaN(vol.GetLowest()) and con then lProfile[1] else vol.GetLowest();
def plotsDomain = IsNaN(close) == onExpansion;

plot POC = if plotsDomain then pc else Double.NaN;
plot ProfileHigh = if plotsDomain then hProfile else Double.NaN;
plot ProfileLow = if plotsDomain then lProfile else Double.NaN;
plot VAHigh = if plotsDomain then hVA else Double.NaN;
plot VALow = if plotsDomain then lVA else Double.NaN;

DefineGlobalColor("Profile", GetColor(1));
DefineGlobalColor("Point Of Control", GetColor(5));
DefineGlobalColor("Value Area", GetColor(8));

vol.Show(GlobalColor("Profile"), if showPointOfControl then GlobalColor("Point Of Control") else Color.CURRENT, if showValueArea then GlobalColor("Value Area") else Color.CURRENT, opacity);
POC.SetDefaultColor(GlobalColor("Point Of Control"));
POC.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
VAHigh.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
VALow.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
VAHigh.SetDefaultColor(GlobalColor("Value Area"));
VALow.SetDefaultColor(GlobalColor("Value Area"));
ProfileHigh.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
ProfileLow.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
ProfileHigh.SetDefaultColor(GetColor(3));
ProfileLow.SetDefaultColor(GetColor(3));
ProfileHigh.Hide();
ProfileLow.Hide();

input bubbles = yes;
input n  = 2;
def   n1 = n + 1;
AddChartBubble(bubbles and !IsNaN(close[n1]) and IsNaN(close[n]), VAHigh[n1], "V-VAH", color = Color.YELLOW, yes);
AddChartBubble(bubbles and !IsNaN(close[n1]) and IsNaN(close[n]), VALow[n1], "V-VAL", Color.YELLOW, no);
AddChartBubble(bubbles and !IsNaN(close[n1]) and IsNaN(close[n]), POC[n1], "V-POC", Color.RED, no);