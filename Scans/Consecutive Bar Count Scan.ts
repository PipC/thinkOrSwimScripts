#
# ConsecutiveBarCount
#
# Study to indicate count consecutive up/down bars.
#
# Author: Kory Gill, @korygill
#
# VERSION HISTORY (sortable date and time (your local time is fine), and your initials
# 20190709-1200-KG    - created
# ...
# ...
#
# Comment out unnecessary portions to preserve TOS memory and enhance speed
#

declare lower;
declare once_per_bar;

#
# Common variables. Using variables reduces calls to TOS iData server.
#

# iData Definitions
#def vHigh = high;
#def initHigh =  CompoundValue(1, high, high);  # creates an initialized variable for high
#def vLow = low;
#def initLow = CompoundValue(1, low, low);
#def vOpen = open;
#def initOpen = CompoundValue(1, open, open);
def vClose = close;
#def initClose = CompoundValue(1, close, close);
#def vVolume = volume;
#def initVolume = CompoundValue(1, volume, volume);
def nan = Double.NaN;

# Bar Time & Date
#def bn = BarNumber();
#def currentBar = HighestAll(if !IsNaN(vHigh) then bn else nan);
#def Today = GetDay() ==GetLastDay();
#def time = GetTime();
#def GlobeX = GetTime() < RegularTradingStart(GetYYYYMMDD());
#def globeX_v2 = if time crosses below RegularTradingEnd(GetYYYYMMDD()) then bn else GlobeX[1];
#def RTS  = RegularTradingStart(GetYYYYMMDD());
#def RTE  = RegularTradingEnd(GetYYYYMMDD());
#def RTH = GetTime() > RegularTradingStart(GetYYYYMMDD());
#def RTH_v2 = if time crosses above RegularTradingStart(GetYYYYMMDD()) then bn else RTH[1];

# Bars that start and end the sessions
#def rthStartBar    = CompoundValue(1,
#                         if   !IsNaN(vClose)
#                         &&   time crosses above RegularTradingStart(GetYYYYMMDD())
#                         then bn
#                         else rthStartBar[1], 0);
#def rthEndBar      = CompoundValue(1,
#                         if   !IsNaN(vClose)
#                         &&   time crosses above RegularTradingEnd(GetYYYYMMDD())
#                         then bn
#                         else rthEndBar[1], 1);
#def globexStartBar = CompoundValue(1,
#                         if   !IsNaN(vClose)
#                         &&   time crosses below RegularTradingEnd(GetYYYYMMDD())
#                         then bn
#                         else globexStartBar[1], 1);
#def rthSession = if bn crosses above rthStartBar #+ barsExtendedBeyondSession
#                    then 1
#                    else if   bn crosses above rthEndBar #+ barsExtendedBeyondSession
#                         then 0
#                    else rthSession[1];

def zeroLine = 0;
def upLine = 5;
def downLine = -5;

def barUp = vClose > vClose[1];
def barDown = vClose < vClose[1];

def barUpCount = CompoundValue(1, if barUp then barUpCount[1] + 1 else 0, 0);
def pBarUpCount = if barUpCount > 0 then barUpCount else nan;

def barDownCount = CompoundValue(1, if barDown then barDownCount[1] - 1 else 0, 0);
def pBarDownCount = if barDownCount < 0 then barDownCount else nan;

#input ShowLabel = no;

def close_diffpositive = if barUp then close - close[1] else 0;
def totalpositive = compoundvalue ( 1,if barupcount then close_diffpositive + totalpositive[1] else 0,0);
def close_diffnegative = if barDown then (close[1] - close) * -1 else 0;
def totalnegative = CompoundValue(1, if bardowncount then close_diffnegative + totalnegative[1] else 0, 0);
#AddChartBubble(ShowLabel, pBarUpCount, totalpositive, Color.GREEN);
#AddChartBubble(ShowLabel, pBarDownCount, totalnegative, Color.RED, 0);

plot scan = pBarUpCount >= upLine;