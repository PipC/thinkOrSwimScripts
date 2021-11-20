#
# HighLowLookback
#
# Study to show the highest high and lowest low after a given number of bars back.
#
# Author: Kory Gill, @korygill
#
# VERSION HISTORY (sortable date and time (your local time is fine), and your initials
# 20190710-2200-KG    - created
# ...
# ...
#

#
# Inputs
#
input labels = no;
input length = 13;

#
# Common Variables that may also reduce calls to server
#
def vClose = close;
def vLow = low;
def vHigh = high;
def nan = double.NaN;

#
# Logic
#
def currentBarNumber = if !IsNaN(vClose) then BarNumber() else nan;
def lastBarNumber = HighestAll(currentBarNumber);
def lookbackBar = lastBarNumber - length + 1;
def doPlot = if currentBarNumber >= lookbackBar then 1 else 0;

def mostRecentHigh = CompoundValue(1, if doPlot && vHigh > mostRecentHigh[1] then vHigh else mostRecentHigh[1],double.NEGATIVE_INFINITY);
def highBarNumber  = CompoundValue(1, if doPlot && vHIgh > mostRecentHigh[1] then currentBarNumber else highBarNumber[1],0);
plot mrh = if currentBarNumber >= HighestAll(highBarNumber) then mostRecentHigh else nan;
mrh.SetDefaultColor(Color.GREEN);

def mostRecentLow = CompoundValue(1, if doPlot && vLow < mostRecentLow[1] then vLow else mostRecentLow[1],double.POSITIVE_INFINITY);
def lowBarNumber  = CompoundValue(1, if doPlot && vLow < mostRecentLow[1] then currentBarNumber else lowBarNumber[1],0);
plot mrl = if currentBarNumber >= HighestAll(lowBarNumber) then mostRecentLow else nan;
mrl.SetDefaultColor(Color.RED);

#
# Visualizations
#
AddChartBubble(
    currentBarNumber == HighestAll(highBarNumber),
    vHigh,
    "HIGH",
    Color.WHITE,
    yes);

AddChartBubble(labels and
    currentBarNumber == HighestAll(lowBarNumber),
    vLow,
    "LOW",
    Color.WHITE,
    no);

AddChartBubble(labels and
    currentBarNumber == lookbackBar,
    (vHigh+vLow)/2,
    length+"\nBar",
    Color.GRAY,
    yes);

plot bbH = if currentBarNumber == lookbackBar then vHigh + TickSize()*1 else nan;
bbH.SetPaintingStrategy(PaintingStrategy.SQUARES);
bbH.SetDefaultColor(Color.MAGENTA);
bbH.SetLineWeight(5);
bbH.HideBubble();

plot bbL = if currentBarNumber == lookbackBar then vLow - TickSize()*1 else nan;
bbL.SetPaintingStrategy(PaintingStrategy.SQUARES);
bbL.SetDefaultColor(Color.MAGENTA);
bbL.SetLineWeight(5);
bbL.HideBubble();

#
# Labels
#
AddLabel(yes,
"RecentHigh: " + mostRecentHigh,
Color.Red);

AddLabel(yes,
"RecentLow: " + mostRecentLow,
Color.Green);

# Plots High/Low Price at Highest Volume

input barsago =60;

def Volbar = BarNumber();
def HighVolBar = if ((volume - Lowest(volume, barsago)) /
                     (Highest(volume, barsago) - Lowest(volume, barsago))) >= 1
                 then Volbar
                 else Double.NaN;
def VolHighLevel = if !IsNaN(HighVolBar) then high else VolHighLevel[1];
def VolLowLevel = if !IsNaN(HighVolBar) then low else VolLowLevel[1];

plot HighLine = if Volbar >= HighestAll(HighVolBar) then VolHighLevel else Double.NaN;
plot LowLine = if Volbar >= HighestAll(HighVolBar) then VolLowLevel else Double.NaN;

HighLine.SetDefaultColor(Color.LIGHT_GREEN);
HighLine.SetPaintingStrategy(PaintingStrategy.DASHES);
HighLine.SetLineWeight(2);
LowLine.SetDefaultColor(Color.LIGHT_RED);
LowLine.SetLineWeight(2);
LowLine.SetPaintingStrategy(PaintingStrategy.DASHES);
# End Plots High/Low Price at Highest Volume