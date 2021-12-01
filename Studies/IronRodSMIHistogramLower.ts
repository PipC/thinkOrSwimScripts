# IronRod SMI Histogram (Lower)
# BuyLow
# Modified by tomsk, 1.18.2020 to add breakout/breakdown signals

# V1.0 - 02.09.2015 - BuyLow  - Initial release of IronRod SMI Histogram (Lower) study
# V1.1 - 01.18.2020 - tomsk   - Added the breakout/breakdown signals at @Playstation's request

# MA - yellow hma's are weak, red is bearish, green bullish.
# On the lower (shows hma angle)- anything above (green) the 0 angle line is bullish, below (red) bearish.
#
# The angle size is directly proportional to trend strength, so you easily see increasing or decreasing trend strength/momentum.
# I use the dark/light graduation as a doubling signal for strong moves.
# https://usethinkscript.com/threads/buylow_mp_smi_triggersystem-for-thinkorswim.1211/page-2

declare lower;

input audioalarm=yes;
input Price = hlc3;
input RsqLength = 5;
input RsqLimit = .5;
input SmiLimit = 30;
input chopband2= 70;
input smibarbufr = 4;
input showBreakoutSignals = yes;

def overbought = SmiLimit;
def oversold = -SmiLimit;
def percentDLength = 4;
def percentKLength = 5;

# Stochastic Momentum Index (SMI)

def min_low = Lowest(low, percentKLength);
def max_high = Highest(high, percentKLength);
def rel_diff = close - (max_high + min_low) / 2;
def diff = max_high - min_low;
def avgrel = ExpAverage(ExpAverage(rel_diff, percentDLength), percentDLength);
def avgdiff = ExpAverage(ExpAverage(diff, percentDLength), percentDLength);

plot chopband = if IsNaN(close) then Double.NaN else 0;
plot SMI = if avgdiff != 0 then avgrel / (avgdiff / 2) * 100 else 0;

#SMI.SetDefaultColor(Color.BLUE);

SMI.DefineColor("Up", CreateColor(0, 153, 51));
SMI.definecolor("Weak", Color.LIGHT_GRAY);
SMI.DefineColor("Down", Color.RED);
SMI.AssignValueColor(if SMI > SMI[1] then SMI.Color("Up") else if SMI < SMI[1] then SMI.Color("Down") else SMI.Color("Weak"));
SMI.SetLineWeight(2);
SMI.SetStyle(Curve.SHORT_DASH);
SMI.SetLineWeight(3);

plot AvgSMI = ExpAverage(SMI, percentDLength);

AvgSMI.DefineColor("Up", CreateColor(0, 153, 51));
AvgSMI.definecolor("Weak", Color.LIGHT_GRAY);
AvgSMI.DefineColor("Down", Color.RED);
AvgSMI.AssignValueColor(if AvgSMI > AvgSMI[1] then AvgSMI.Color("Up") else if AvgSMI < AvgSMI[1] then AvgSMI.Color("Down") else AvgSMI.Color("Weak"));
AvgSMI.SetLineWeight(3);

# Plot the Breakout/Breakdown Signals

plot UpSignal = if SMI crosses above AvgSMI then SMI * (if SMI > 0 then 0.9 else 1.1) else Double.NaN;
UpSignal.SetHiding(!showBreakoutSignals);
UpSignal.SetDefaultColor(Color.WHITE);
UpSignal.SetLineWeight(3);
UpSignal.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
UpSignal.HideTitle();

plot DownSignal = if SMI crosses below AvgSMI then SMI * (if SMI > 0 then 1.05 else 1.1) else Double.NaN;
DownSignal.SetHiding(!showBreakoutSignals);
DownSignal.SetDefaultColor(Color.PINK);
DownSignal.SetLineWeight(3);
DownSignal.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
DownSignal.HideTitle();

#SMI1.SetPaintingStrategy(PaintingStrategy.DASHES);

plot SMIBAR = AvgSMI;

SMIBAR.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
SMIBAR.SetLineWeight(3);
SMIBAR.DefineColor("Upstrong", CreateColor (0, 255, 0));
SMIBAR.DefineColor("Weak", Color.LIGHT_GRAY);
SMIBAR.DefineColor("Downstrong", CreateColor(255, 51, 51));
SMIBAR.AssignValueColor (if (SMI + smibarbufr) >= SMI[1] and SMI > -SmiLimit then SMIBAR.Color("Upstrong") else if (SMI - smibarbufr) <= SMI[1] and SMI < SmiLimit then SMIBAR.Color("Downstrong") else SMIBAR.Color("Weak"));

# r-Square Centerline Indicator

#def sma = Average(close, RsqLength);
#def RSq = Sqr(WMA(close, RsqLength) - sma) / (Average(Sqr(close), RsqLength) - Sqr(sma)) * 3 * (RsqLength + 1) / (RsqLength - 1);

chopband.HideBubble();
chopband.SetLineWeight(5);
chopband.DefineColor("Trade", CreateColor(0, 150,200));
chopband.DefineColor("Hold", Color.ORANGE);
chopband.AssignValueColor(if SMI > -smiLimit and SMI < smilimit then chopband.Color("Hold") else chopband.Color("Trade"));

# Chop Cloud

plot upper= smilimit;
plot lower= -smilimit;

upper.setDefaultColor(Color.GRAY);
lower.setDefaultColor(Color.GRAY);

def choplimits = SmiLimit;

#input choplimits= 1;

AddCloud(choplimits, -choplimits, CreateColor(210,210,210));

#addcloud(-choplimits, -chopband2, CreateColor(175,175,175));
#addcloud(chopband2, choplimits, CreateColor(175,175,175));

# Labels

# AddLabel(yes, "SMI Legend: ", Color.WHITE);
AddLabel(yes, "Bull", Color.UPTICK);
AddLabel(yes, "Bear", Color.DOWNTICK);
AddLabel(yes, "Changing", Color.GRAY);
# AddLabel(yes, "MidLine: ", Color.WHITE);
AddLabel(yes, "Trending", CreateColor(0,150,200));
AddLabel(yes, "ChopZone", Color.ORANGE);
AddLabel(yes, "SmiLimit: " + SmiLimit, Color.GRAY);

alert (audioalarm and SMI crosses AvgSMI and SMI <= -smilimit or SMI crosses AvgSMI AND SMI >= smilimit, "SMI CROSS", alert.bar, sound.ding);
# End Study