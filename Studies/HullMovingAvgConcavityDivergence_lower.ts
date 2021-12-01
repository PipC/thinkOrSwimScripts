#
# Hull Moving Average Concavity Divergence
#  or
# The Second Derivative of the Hull Moving Average
#
# Author: Seth Urion (Mashume)
# Version: 2020-02-23 V3
#
# This code is licensed (as applicable) under the GPL v3
#
# ----------------------
# https://usethinkscript.com/threads/hull-moving-average-turning-points-and-concavity-2nd-derivatives.1803/

declare lower;

input price = OPEN;

input HMA_length = 55;
input lookback = 2;

def HMA = HullMovingAvg(length = HMA_length, price = price);

def delta = HMA[1] - HMA[lookback + 1];
def delta_per_bar = delta / lookback;

def next_bar = HMA[1] + delta_per_bar;

def concavity = if HMA > next_bar then 1 else -1;

plot zero = 0;
zero.setdefaultcolor(color.gray);
zero.setpaintingstrategy(PaintingStrategy.DASHES);

plot divergence = HMA - next_bar;
#divergence.setDefaultColor(Color.LIME);
divergence.AssignValueColor(if divergence > 0 then color.LIME else color.LIGHT_ORANGE);
divergence.SetLineweight(2);

plot cx_up = if divergence crosses above zero then 0 else double.nan;
cx_up.SetPaintingStrategy(PaintingStrategy.POINTS);
cx_up.SetDefaultColor(Color.LIGHT_GREEN);
cx_up.SetLineWeight(4);

plot cx_down = if divergence crosses below zero then 0 else double.nan;
cx_down.SetPaintingStrategy(PaintingStrategy.POINTS);
cx_down.SetDefaultColor(Color.RED);
cx_down.SetLineWeight(4);