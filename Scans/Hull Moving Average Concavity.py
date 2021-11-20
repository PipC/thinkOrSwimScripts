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

input price = HL2;
input HMA_Length = 55;
input lookback = 2;
input tradesize = 1;

# I read somewhere that it's faster to define nan's and then use the def'd var rather than call double.nan every time.
def nan = double.nan;

def HMA = HullMovingAvg(price = price, length = HMA_Length);

def delta = HMA[1] - HMA[lookback + 1];
def delta_per_bar = delta / lookback;

def next_bar = HMA[1] + delta_per_bar;

def concavity = if HMA > next_bar then 1 else -1;

def turning_point = if concavity[1] != concavity then HMA else nan;


#plot MA_Max = if HMA[-1] < HMA and HMA > HMA[1] then HMA else NaN;

#plot MA_Min = if HMA[-1] > HMA and HMA < HMA[1] then HMA else Nan;


# NOTE: I PREFER TO TURN OFF UP ARROWS WHEN IN DOWN TREND.  IF IN DOWNTRENDING SWINGARM, THE TURN ON ONLY DOWN SELL ARROWS. YOU CAN DO THIS USING THE INPUT SETTINGS SCREEN.

#plot sell = if turning_point and concavity == -1 then high else nan;

plot buy = if turning_point and concavity == 1 and close > HMA then 1 else nan;

#AddOrder(OrderType.BUY_AUTO, buy, open[-1], tradesize, Color.CYAN, Color.CYAN, "Buy $" + open[-1]);
#AddOrder(OrderType.SELL_AUTO, sell, open[-1], tradesize, Color.RED, Color.RED, "Sell $" + open[-1]);
