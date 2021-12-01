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

def percentDLength = 4;
def percentKLength = 5;

# Stochastic Momentum Index (SMI)

def min_low = Lowest(low, percentKLength);
def max_high = Highest(high, percentKLength);
def rel_diff = close - (max_high + min_low) / 2;
def diff = max_high - min_low;
def avgrel = ExpAverage(ExpAverage(rel_diff, percentDLength), percentDLength);
def avgdiff = ExpAverage(ExpAverage(diff, percentDLength), percentDLength);

def SMI = if avgdiff != 0 then avgrel / (avgdiff / 2) * 100 else 0;


def AvgSMI = ExpAverage(SMI, percentDLength);

# Plot the Breakout/Breakdown Signals

plot UpSignal = SMI crosses above AvgSMI;

