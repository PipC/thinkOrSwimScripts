# PRC_HalfTrend Strategy
#global variables:
input price = close;
input displace = 0;
input Length = 14;
input OB = 80;
input OS = 20;
input Smoother = 5;
input std_dev_up = 2; # default 2
input std_dev_down = -2 ; # 2
input stdev_length = 20; # 20
def zero = 0 ;
input MidLine  = 50;
# ########################################################
# PRC_HalfTrend | indicator
# 10.03.2017
# Ported by Mobius Apr 2020

input Amplitude = 3;

def lowpricei;
def highpricei;
def lowma;
def highma;
def barindex = BarNumber();
def nexttrend;
def maxlowprice;
def trend;
def minhighprice;
def up;
def down;

def halftrend;

lowpricei = Lowest(low, Amplitude);
highpricei = Highest(high, Amplitude);
lowma = Average(low, Amplitude);
highma = Average(high, Amplitude);
if barindex > Amplitude and
          nexttrend[1] == 1
{
    maxlowprice = Max(lowpricei, maxlowprice[1]);
    trend = if highma < maxlowprice[1] and close < low[1]
             then 1
             else trend[1];
    nexttrend = if highma < maxlowprice[1] and close < low[1]
                 then 0
                 else nexttrend[1];
    minhighprice = if highma < maxlowprice[1] and close < low[1]
                    then highpricei
                    else minhighprice[1];
}
else if nexttrend[1] == 0
{
    minhighprice = Min(highpricei, minhighprice[1]);
    trend = if lowma > minhighprice[1] and close > high[1]
             then 0
             else trend[1];
    nexttrend = if lowma > minhighprice[1] and close > high[1]
                 then 1
                 else nexttrend[1];
    maxlowprice = if lowma > minhighprice[1] and close > high[1]
                   then lowpricei
                   else maxlowprice[1];
}
else
{
    maxlowprice = maxlowprice[1];
    trend = trend[1];
    nexttrend = nexttrend[1];
    minhighprice = minhighprice[1];
}
if trend == 0
{
    up = if trend[1] <> 0
          then down[1]
          else Max(maxlowprice[1], up[1]);
    down = 0;
}
else if trend[1] <> 1
{
    down = up[1];
    up = 0;# up[1] este era el error
}
else if trend == 1
{
    down = Min(minhighprice, down[1]);
    up = up[1];
}
else
{
    up = up[1];
    down = down[1];
}
if up > 0
{
    halftrend = up;
}
else
{
    halftrend = down;
}
#halftrend.SetStyle(Curve.FIRM);
#halftrend.AssignValueColor(if up > 0 then Color.CYAN else Color.RED);
#halftrend.SetLineWeight(2);
def bulltrend = up > 0 ;
# End Code
# ########################################################
# #2. Define exit 
# TOS Accumulation Swing Index
def asi = AccumulationSwingIndex()."ASI" ;
def sma = SimpleMovingAvg(asi,10);
def ASI_crossesbelow = asi crosses below sma ;
# ########################################################
#Define where you want arrows plotted 
# This plots at 30% of bar range above the bar high.
# Change plotter to whatever you want to customize it.
def range = high – low;
def na = Double.NaN;
def plotHigh = high + range * 0.3;
def plotLow  = low  - range * 0.3;
DefineGlobalColor("LabelGreen", CreateColor(0, 190, 0)) ;
DefineGlobalColor("VividCyan", CreateColor(85, 255, 205)) ;
# ########################################################
#Order Management

def buy_criteria  =  bulltrend  ;
def sell_criteria =  ASI_crossesbelow ;

#Order Setups
def buyTrigger = buy_criteria[-1]  ;
plot buyTriggerPlot = if  buyTrigger[1] then plotLow else Double.NaN;
buyTriggerPlot.SetDefaultColor(GlobalColor("VividCyan"));
buyTriggerPlot.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
buyTriggerPlot.SetLineWeight(1);
buyTriggerPlot.HideTitle() ;

def sellTrigger = sell_criteria[-1] ;
plot sellTriggerPlot = if sellTrigger[1] then plotHigh else Double.NaN;
sellTriggerPlot.HideBubble() ;
sellTriggerPlot.HideTitle() ;
sellTriggerPlot.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_DOWN);
sellTriggerPlot.SetLineWeight(1);
sellTriggerPlot.SetDefaultColor(Color.PINK) ;  
# debugging
#AddChartBubble(buy_criteria, close,  " TMO: " + Main , Color.LIGHT_GREEN );

       
# uses a negative offset for the close price of the buy/sell order to accomodate the way ThinkScript places the #AddOrder arrows
AddLabel(yes, "Shares to buy: " + Round(5000 / close, 0), Color.CYAN);
def tradesize = 12000 / close;
AddOrder(OrderType.BUY_TO_OPEN, condition = buyTrigger, price = close[-1], tradeSize = tradesize, tickcolor = Color.GREEN, arrowcolor = Color.DARK_GREEN, "Buy $"+close[-1]) ; # , "buy"

AddOrder(OrderType.SELL_TO_CLOSE, condition = sellTrigger, price = close[-1], tradeSize = tradesize, tickcolor = Color.ORANGE, arrowcolor = Color.DARK_RED, "Sell $"+close[-1]) ;  #  , "sell"

############################
# FPL Extended
# Extended Floating P&L study.
# Author: Eddielee394
# Version: 1.2
# inspired by FPL Dashboard script developed by Mobius
############################

############################
# Instructions
# - Due to limitations with the thinkscript public api, this specific script must be added to a "strategy" study.
#   Generally best practice is to append this script to the end of your custom strategy (ensuring it runs AFTER the
#   `AddOrder()` function is called from the strategy).  A better method would be to use as a lower study but unless
#    a workaround is implemented to handle the `Entry()` function in a lower study, it can only be applied to upper strategies.
#
# - the script uses the `HidePrice()` function which will hide the actual price candles within the upper study,
#   only displaying the FPL histogram.
#
############################


############################
#    Metrics               #
#  - Active Trade return % #
#  - Entry Count           #
#  - Winning Entry Count   #
#  - Win rate              #
#  - Avg return            #
#  - avg win               #
#  - avg loss              #
#  - peak to valley dd     #
#  - largest equity dd     #
#  - P&L low               #
#  - P&L high              #
#  - Highest return        #
#  - Lowest return         #
############################

############################
#     Todo:                #
# - Sharpe Ratio           #
# - Sortino Ratio          #
# - Calmar Ratio           #
# - Avg trade              #
#   duration               #
# -Buy/hold comparison     #
############################


#Globals
def nan = Double.NaN;
def bn = if !IsNaN(close) and !IsNaN(close[1]) and !IsNaN(close[-1]) then BarNumber() else bn[1];
DefineGlobalColor("LabelGreen", CreateColor(0, 190, 0)) ;
#Inputs
input fplBegin = 0000;
#hint fplBegin: start time: the time in which then dailyHighLow profit should consider the day start.  Recommended value is 0000.

input fplTargetWinLoss = .50;
#hint fplTargetWinLoss: sets the target winlossRatio (in percent) which determines display colors of the W/L label.

input fplTargetWinRate = 1;
#hint fplTargetWinRate: sets the target winRate (float) which determines display colors of the WinRate label;

input fplHidePrice = no;
#hint fplHidePrice: hide's the underlying price graph. \nDefault is no.

input fplHideFPL = yes;
#hint fplHideFPL: hide's the underlying P&L graph.\nDefault is yes.

input fplShowEntryBubbles = no;
#hint fplShowEntryBubbles: display bubbles on the FPL showing the entry and exit P&L values

input fplEnableDebugging = no;
#hint fplEnableDebugging: displays various debugging labels and chart bubbles. \nIt's recommended to hide the price chart & set the fpl hide fpl setting to yes, when enabling. 

#temp input var references
def begin = fplBegin;
def targetWinLoss = fplTargetWinLoss;
def targetWinRate = fplTargetWinRate;
def hidePrice = fplHidePrice;
def hideFPL = fplHideFPL;
def showEntryBubbles = fplShowEntryBubbles;
def enableDebugging = fplEnableDebugging;

#hide chart candles
HidePricePlot(hidePrice);

#Plot default Floating P&L
plot FPL = FPL();
FPL.SetPaintingStrategy(PaintingStrategy.SQUARED_HISTOGRAM);
FPL.DefineColor("Positive and Up", GlobalColor("LabelGreen"));
FPL.DefineColor("Positive and Down", GlobalColor("LabelGreen"));
FPL.DefineColor("Negative and Down", Color.RED);
FPL.DefineColor("Negative and Up", Color.DARK_RED);
FPL.AssignValueColor(if FPL >= 0
                            then if FPL > FPL[1]
                            then FPL.Color("Positive and Up")
                            else FPL.Color("Positive and Down")
                            else if FPL < FPL[1]
                            then FPL.Color("Negative and Down")
                            else FPL.Color("Negative and Up"));
FPL.SetHiding(hideFPL);

plot ZeroLine = if IsNaN(close)
                then nan
                else 0;
ZeroLine.SetDefaultColor(Color.GRAY);
ZeroLine.SetHiding(hideFPL);

#Global Scripts
script calculateDrawdown {
    input plLow = 1;
    input plHigh = 1;

    def _drawdown = if plHigh == 0 
                   then 0 #handles the divide by zero error
                   else (plLow - plHigh) / plHigh;
    plot calculateDrawdown = _drawdown;
}

script incrementValue {
    input condition = yes;
    input increment =  1;
    input startingValue = 0;

    def _value = CompoundValue(1, 
                 if condition
                 then _value[1] + increment
                 else _value[1], startingValue);

    plot incrementValue = _value;
}
;

script getDurationInMins {
    input gdimBarCount = 1;

    #get the aggregation period (MS per bar)
    def aggPeriod = GetAggregationPeriod();

    #multiply length of bars by aggPeriod to determine total milliseconds then convert to minutes
    def _getDurationInMins = Floor((gdimBarCount * aggPeriod) / 60000);
    plot getDurationInMins = _getDurationInMins;
}

script formatDuration {
    input fdBarCount = 1;
    def _fdDuration = getDurationInMins(fdBarCount);
    def _formatDuration = if _fdDuration >= 60 and _fdDuration < 1440 #hours but not days
                         then 1
                         else if _fdDuration >= 1440 #days
                         then 2
                         else 0;

    plot formatDuration = _formatDuration;
}

script calculateDuration {
    input cdBarCount = 1;
    def _cdDurationFormat = formatDuration(cdBarCount);
    def _cdDuration = getDurationInMins(cdBarCount);
    
    #if minutes > hour convert to hour, else if minutes > day, then convert to days
    def _calculateDuration = if _cdDurationFormat == 1
                             then _cdDuration / 60 #convert to hours if greater than 60min but less than a day (1440)
                             else if  _cdDurationFormat == 2
                             then Ceil(_cdDuration / 1440) #convert to days if greater than 1440mins
                             else _cdDuration; #fallback to minutes

    plot calculateDuration = _calculateDuration;
}

# Entry Calculations.  Note: Only parses on a Strategy Chart
def entry = EntryPrice();

def entryPrice = if !IsNaN(entry)
                 then entry
                 else entryPrice[1];

def hasEntry = !IsNaN(entry);

def isNewEntry = entryPrice != entryPrice[1];

#is active trade
def Active = if SecondsTillTime(begin) == 0 and
                SecondsFromTime(begin) == 0
             then 1
             else 0;

def highFPL = HighestAll(FPL);
def lowFPL = LowestAll(FPL);

def fplreturn = (FPL - FPL[1]) / FPL[1];
def cumsum = Sum(fplreturn);

def highBarNumber = CompoundValue(1, if FPL == highFPL
                                     then bn
                                     else highBarNumber[1], 0);

def lowBarNumber = CompoundValue(1, if FPL == lowFPL
                                    then bn
                                    else lowBarNumber[1], 0);


#Win/Loss ratios
def entryBarsTemp = if hasEntry
                    then bn
                    else nan;

def entryBarNum = if hasEntry and isNewEntry
                  then bn
                  else entryBarNum[1];

def isEntryBar = entryBarNum != entryBarNum[1];

def entryBarPL = if isEntryBar
                 then FPL
                 else entryBarPL[1];

def exitBarsTemp = if !hasEntry
                   and bn > entryBarsTemp[1]
                   then bn
                   else nan;

def exitBarNum = if !hasEntry and !IsNaN(exitBarsTemp[1])
                 then bn
                 else exitBarNum[1];

def isExitBar = exitBarNum != exitBarNum[1];

def exitBarPL = if isExitBar
                then FPL
                else exitBarPL[1];

def entryReturn = if isExitBar then exitBarPL - exitBarPL[1] else entryReturn[1];
def isWin = if isExitBar and entryReturn >= 0 then 1 else 0;
def isLoss = if isExitBar and entryReturn < 0 then 1 else 0;
def entryReturnWin = if isWin then entryReturn else entryReturnWin[1];
def entryReturnLoss = if isLoss then entryReturn else entryReturnLoss[1];
def entryFPLWins = if isWin then entryReturn else 0;
def entryFPLLosses = if isLoss then entryReturn else 0;
def entryFPLAll = if isLoss or isWin then entryReturn else 0;


#Counts
def entryCount = incrementValue(entryFPLAll);
def winCount = incrementValue(isWin);
def lossCount = incrementValue(isLoss);

def highestReturn = if entryReturnWin[1] > highestReturn[1] 
                    then entryReturnWin[1] 
                    else highestReturn[1];

def lowestReturn = if entryReturnLoss[1] < lowestReturn[1] 
                   then entryReturnLoss[1] 
                   else lowestReturn[1];


def winRate = winCount / lossCount;
def winLossRatio = winCount / entryCount;
def avgReturn = TotalSum(entryFPLAll) / entryCount;
def avgWin = TotalSum(entryFPLWins) / winCount;
def avgLoss = TotalSum(entryFPLLosses) / lossCount;

#Drawdown
def lowestLowBarNumber = HighestAll(if FPL == lowFPL then bn else 0);
def highestHighBarNumber = HighestAll(if FPL == highFPL and FPL != FPL[1] then bn else 0);
def hasPrevLow = lowestLowBarNumber < highestHighBarNumber;

def isPeak = FPL > Highest(FPL[1], 12) and FPL > Highest(FPL[-12], 12);
def isTrough = FPL < Lowest(FPL[1], 12) and FPL < Lowest(FPL[-12], 12);
def _peak = if isPeak then FPL else nan;
def _trough = if isTrough then FPL else nan;
def peak = if !IsNaN(_peak) then FPL else peak[1];
def trough = if !IsNaN(_trough) then FPL else trough[1];
def peakBN = if isPeak then bn else peakBN[1];
def troughBN = if isTrough then bn else troughBN[1];

def ptvDrawdown = if !hasPrevLow then calculateDrawdown(lowFPL, highFPL) else ptvDrawdown[1];
def equityDrawdown = if isTrough and trough < peak then trough - peak else equityDrawdown[1];
def equityDrawdownPercent = if isTrough and trough < peak then calculateDrawdown(trough, peak) else equityDrawdownPercent[1];
def largestEquityDrawdown = LowestAll(equityDrawdown);
def largestEquityDrawdownPercent = LowestAll(equityDrawdownPercent);

def drawdown = if hasPrevLow
               then largestEquityDrawdownPercent
               else ptvDrawdown;


# Drawdown Durations
def equityDrawdownLength = if bn >= peakBN and bn <= troughBN 
                           then troughBN - peakBN 
                           else equityDrawdownLength[1];

def ptvDrawdownLength = if bn >= highestHighBarNumber and bn <= lowestLowBarNumber 
                        then lowestLowBarNumber - highestHighBarNumber 
                        else ptvDrawdownLength[1];

def equityDrawdownDuration = calculateDuration(HighestAll(equityDrawdownLength));
def equityDrawdownDurationFormat = formatDuration(HighestAll(equityDrawdownLength));
def ptvDrawdownDuration = calculateDuration(ptvDrawdownLength);

def ptvDrawdownDurationFormat = formatDuration(ptvDrawdownLength);


#Daily profit
def Midnight = if Active then FPL else Midnight[1];
def DaysProfit = FPL - Midnight;


#Plots
AddChartBubble(!hideFPL and showEntryBubbles and isEntryBar, FPL, "Entry: " + entryBarPL + " | " + bn, Color.CYAN);
AddChartBubble(!hideFPL and showEntryBubbles and isExitBar, FPL, "Exit: " + exitBarPL,
               color = if isWin
                       then GlobalColor("LabelGreen")
                       else if isLoss
                       then Color.DARK_RED
                       else Color.GRAY,
               up = no
              );

#Labels

AddLabel(yes,
         text = "Total Trades: " + entryCount,
         color = Color.CYAN
         );

AddLabel(yes,
         text = "WinCount: " + winCount +
                " | LossCount: " + lossCount +
                " | WinRate: " + winRate,
         color = if winRate >= targetWinRate
                 then GlobalColor("LabelGreen")
                 else Color.RED
         );

AddLabel(yes,
         text = "W/L: " + AsPercent(winLossRatio),
         color = if winLossRatio > targetWinLoss
                 then GlobalColor("LabelGreen")
                 else Color.RED
         );

AddLabel(yes,
        text = "HighestReturn: " +  AsDollars(highestReturn),
        color = if highestReturn > 0
                then GlobalColor("LabelGreen")
                else Color.RED
        );

AddLabel(yes,
        text = "LowestReturn: " +  AsDollars(lowestReturn),
        color = if lowestReturn > 0
                then GlobalColor("LabelGreen")
                else Color.RED
        );


AddLabel(yes,
         text = "P&L High" +
                (if enableDebugging
                then " at bar " + highBarNumber
                else "") +
                ":  " + AsDollars(highFPL),
        color = GlobalColor("LabelGreen")
       );

AddLabel(yes,
         text = "P&L Low" +
                (if enableDebugging
                then " at bar " + lowBarNumber
                else "") +
                ":  " + AsDollars(lowFPL),
        color = Color.RED
       );