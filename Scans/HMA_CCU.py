#hint: <b>Upper Label Colors:</b>\nthese are useful for getting ready to enter a trade, or exit a trade and serve #as warnings that a turning point may be reached soon\n<b>Green:</b> Concave up and divergence (the distance from the expected HMA value to the actual HMA value is increasing). That is, we're moving away from a 2nd derivative zero crossover.\n<b>Yellow:</b> Concave up but the divergence is decreasing (heading toward a 2nd derivative zero crossover); it may soon be time to exit the trade.\n<b>Red:</b> Concave down and the absolute value of the divergence is increasing (moving away from crossover)\n<b>Pink:</b> Concave down but approaching a zero crossover from below (remember that is the entry signal, so pink means 'get ready').

# blackFLAG FTS BUY AND SELL CONFIRMATION LABELS FOR SwingArms
# 5-24-2020
# Hull Moving Average Concavity and Turning Points
#  or
# The Second Derivative of the Hull Moving Average
#
# Author: Seth Urion (Mahsume)
# Version: 2020-05-01 V4
#
# Now with support for ToS Mobile
#
# This code is licensed (as applicable) under the GPL v3
# UseThinkScript.com
# https://usethinkscript.com/threads/hull-moving-average-turning-points-and-concavity-2nd-derivatives.1803/page-14#post-23080
# https://usethinkscript.com/threads/hull-moving-average-turning-points-and-concavity-2nd-derivatives.1803/
# ----------------------
# ************** Settings Update: 5-26-2020 **************
# INSTRUCTIONS:
# SETTINGS TO SET UP ALERT NOTIFICATIONS - JAzcarate -
# BUY / SELL CHART ALERTS WITH EMAIL / TEXT
# STUDY NAME: HULL MOVING AVERAGE TURNING POINTS
# 1 MINUTE CHART SETTING 255 period HMA
# 5 MINUTE CHART SETTING 255 period HMA
# 4 Hour CHART SETTING 255 PERIOD HMA
# DAILY CHART SETTING 75 PERIOD HMA ( BEST ESTIMATE )

# SELL FROM RESISTANCE - BUY FROM SUPPORT


declare upper;

input price = high; #HL2 is default
input HMA_Length = 55;
input lookback = 2;
input tradingAmount = 5000; #Hint tradingAmount: tradingsize = tradingAmount / buy price
input ShowTradePrice = yes;

# I read somewhere that it's faster to define nan's and then use the def'd var rather than call double.nan every time.
def nan = Double.NaN;

def HMA = HullMovingAvg(price = price, length = HMA_Length);

def delta = HMA[1] - HMA[lookback + 1];
def delta_per_bar = delta / lookback;

def next_bar = HMA[1] + delta_per_bar;

def concavity = if HMA > next_bar then 1 else -1;

def turning_point = if concavity[1] != concavity then HMA else nan;

#HMA.AssignValueColor(color = if concavity[1] == -1 then
#    if HMA > HMA[1] then Color.DARK_ORANGE else Color.RED else
#    if HMA < HMA[1] then Color.WHITE else Color.GREEN);

def divergence = HMA - next_bar;


#
# 2020-05-01
#
# MOBILE TOS SUPPORT
#
# Each color of the HMA needs to be a separate plot as ToS Mobile
# lacks the ability to assign colors the way ToS Desktop does.
# I recommend a plain colored HMA behind the line
# Set the line color of the HMA above to gray or some neutral
#
# CCD_D -> ConCave Down and Decreasing
# CCD_I -> ConCave Down and Increasing
# CCU_D -> ConCave Up and Decreasing
# CCU_I -> ConCave Up and Increasing
#
###################
#plot CCD_D = if concavity == -1 and HMA < HMA[1] then HMA else nan;
#CCD_D.SetDefaultColor(Color.DARK_RED);
#CCD_D.SetLineWeight(2);

#def CCD_I = if concavity == -1 and HMA >= HMA[1] then HMA else nan;
#CCD_I.SetDefaultColor(Color.DARK_ORANGE);
#CCD_I.SetLineWeight(2);

def CCU_D = if concavity == 1 and HMA <= HMA[1] then HMA else nan;
#CCU_D.SetDefaultColor(Color.DARK_GREEN);

#def CCU_I = if concavity == 1 and HMA > HMA[1] then HMA else nan;
#CCU_I.SetDefaultColor(Color.GREEN);


# --------------------------------------
#Edited by: Jose Azcarate
#May 25, 2020
#Reason: Adding Bubble - Labels

#AddChartBubble(MA_MAX == MA_MAX , MA_MAX*1.005 , "Sell" , Color.RED, yes);
#AddChartBubble(MA_MIN == MA_MIN , MA_MIN*.995, "Buy" , Color.GREEN, no);

def MA100 = MovingAverage(AverageType.SIMPLE, price[0], 100);
def MA200 = MovingAverage(AverageType.SIMPLE, price[0], 200);

plot scan = if !isNaN(CCU_D) and CCU_D < close and close > MA100 and MA100>=MA200 then 1 else 0;