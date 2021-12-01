# Trading Analysis Swing Waves
# Version 1.0.1
# 4/20/2015
#
# Author: Brian Strong (brian@microquant.com)
# MicroQuant
#

input MajorLeftStr = 13;
input MajorRightStr = 13;
input MinorLeftStr = 5;
input MinorRightStr = 5;
input SwingTickOffset = 2;
input AlertsOn = yes;

# This indicator must be applied to a bar interval larger than 5 ticks.

def offset = TickSize() * (HighestAll(high) - LowestAll(low)) * SwingTickOffset;

#Calculate Major Swings
def pivotH = if high > Highest(high[1], MajorLeftStr) and high > Highest(high[-MajorRightStr], MajorRightStr) then 1 else 0;
def pValH = if pivotH then high + offset else Double.NaN;
def pivotL = if low < Lowest(low[1], MajorLeftStr) and low < Lowest(low[-MajorRightStr], MajorRightStr) then 1 else 0;
def pValL = if pivotL then low - offset else Double.NaN;

#Plot Major Swings
plot MajorSwHigh = pValH;
MajorSwHigh.setpaintingStrategy(paintingStrategy.POINTS);
MajorSwHigh.setLineWeight(5);
MajorSwHigh.setdefaultColor(Color.BLUE);
plot MajorSwLow = pValL;
MajorSwLow.setpaintingStrategy(paintingStrategy.POINTS);
MajorSwLow.setLineWeight(5);
MajorSwLow.setdefaultColor(Color.BLUE);