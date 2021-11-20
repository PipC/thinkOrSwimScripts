
#######################
# SlimRibbonATR
# SlimRibbon study with ATR
# Author: Eddielee394
# Version: 0.3
# inspired by SlimRibbon by Slim Miller and further customized by Markos 
#######################
SetChartType(ChartType.CANDLE_TREND);

input showLabel = no;
input price = close;
input superfast_length = 8;
input fast_length = 13;
input slow_length = 21;
input displace = 0;
input enableAlerts = no;
#hint enableAlerts: disables all alerts
input hideMovingAverages = yes;
#hint hideMovingAverages: hides all the moving average lines from the slimRibbon
input atrMult = 1.0;
#hint atrMult: increases the sensitivity of the ATR line.  Best settings for the following timeframes:  5m:  1.0,  15m: 1.2, 30m: 1.4
input nATR = 3; 
#hint nATR: 
input avgType = AverageType.HULL;
input tradeSizeBase = 10;
input tradeBasedOnVolume = yes;



def ATR = MovingAverage(avgType, TrueRange(high, close, low), nATR);
def UP = HL2 + (atrMult * ATR);
def DN = HL2 + (-atrMult * ATR);
def ST = if close < ST[1] then UP else DN;

plot SuperTrend = ST;

SuperTrend.AssignValueColor(if close < ST then Color.RED else Color.GREEN);

def SuperTrendUP = if ST crosses below close[-1] then 1 else 0;
def isSuperTrendUP = SuperTrend > close;
def SuperTrendDN = if ST crosses above close[-1] then 1 else 0;
def isSuperTrendDN = SuperTrend < close;

#moving averages
def mov_avg8 = ExpAverage(price[-displace], superfast_length);
def mov_avg13 = ExpAverage(price[-displace], fast_length);
def mov_avg21 = ExpAverage(price[-displace], slow_length);

plot Superfast = mov_avg8;
Superfast.SetHiding(hideMovingAverages);

plot Fast = mov_avg13;
Fast.SetHiding(hideMovingAverages);

plot Slow = mov_avg21;
Slow.SetHiding(hideMovingAverages);


def buy = mov_avg8 > mov_avg13 and mov_avg13 > mov_avg21 and low > mov_avg8;
def stopbuy = mov_avg8 <= mov_avg13;
def buynow = !buy[1] and buy;

def buysignal = CompoundValue(1, if buynow and !stopbuy then 1 else if buysignal[1] == 1 and stopbuy then 0 else buysignal[1], 0);

plot Buy_Signal = buysignal[1] == 0 and buysignal == 1;
Buy_Signal.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_UP);
Buy_Signal.SetDefaultColor(Color.GREEN);
Buy_Signal.HideTitle();

plot Momentum_Down = buysignal[1] == 1 and buysignal == 0;
Momentum_Down.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_DOWN);
Momentum_Down.SetDefaultColor(Color.YELLOW);
Momentum_Down.HideTitle();

def sell = mov_avg8 < mov_avg13 and mov_avg13 < mov_avg21 and high < mov_avg8;
def stopsell = mov_avg8 >= mov_avg13;
def sellnow = !sell[1] and sell;
def sellsignal = CompoundValue(1, if sellnow and !stopsell then 1 else if sellsignal[1] == 1 and stopsell then 0 else sellsignal[1], 0);


plot Sell_Signal = sellsignal[1] == 0 and sellsignal;
Sell_Signal.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_DOWN);
Sell_Signal.SetDefaultColor(Color.RED);
Sell_Signal.HideTitle();

plot Momentum_Up = sellsignal[1] == 1 and sellsignal == 0;
Momentum_Up.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_UP);
Momentum_Up.SetDefaultColor(Color.YELLOW);
Momentum_Up.HideTitle();

plot Colorbars = if buysignal == 1 then 1 else if sellsignal == 1 then 2 else if buysignal == 0 or sellsignal == 0 then 3 else 0;
Colorbars.Hide();
Colorbars.DefineColor("Buy_Signal_Bars", Color.GREEN);
Colorbars.DefineColor("Sell_Signal_Bars", Color.RED);
Colorbars.DefineColor("Neutral", Color.YELLOW);

AssignPriceColor(if Colorbars == 1 then Colorbars.Color("buy_signal_bars") else if Colorbars == 2 then Colorbars.Color("Sell_Signal_bars") else  Colorbars.Color("neutral"));

#Orders
def buyTrigger = Buy_Signal[-1];
def sellTrigger = if SuperTrendDN or Sell_Signal[-1] then 1 else 0;

plot buyTriggerPlot = if buyTrigger[1] then close else Double.NaN;
plot sellTriggerPlot = if sellTrigger[1] then close else Double.NaN;

def tradeSizeRef = 10000/close;

def tradeSize = if tradeBasedOnVolume and buyTrigger then 
(volume / MovingAverage(AverageType.SIMPLE, volume, 100)) * 
#tradeSizeBase
tradeSizeRef * MovingAverage(AverageType.SIMPLE, volume, 5) / MovingAverage(AverageType.SIMPLE, volume, 50) 
else tradeSizeBase;
#def tradeSize = tradeSizeBase;

rec lastTradeSize =  if buyTrigger then tradeSize else lastTradeSize[1];

# we use a negative offset for the close price of the buy/sell order to accomodate the way ThinkScript places the AddOrder arrows
#AddOrder(OrderType.BUY_TO_OPEN, condition = buyTrigger, price = close[-1], tradeSize = tradesize, tickcolor = Color.CYAN, arrowcolor = Color.CYAN);

#AddOrder(OrderType.SELL_TO_CLOSE, condition = sellTrigger, price = close[-1], tradeSize = tradesize, tickcolor = Color.PINK, arrowcolor = Color.DARK_RED); 

AddOrder(OrderType.BUY_TO_OPEN, condition = buyTrigger, price = close[-1], tradeSize = tradesize, tickcolor = Color.CYAN, arrowcolor = Color.WHITE, name="SRBuy");

AddOrder(OrderType.SELL_TO_CLOSE, condition = sellTrigger, price = close[-1], tradeSize = lastTradeSize, tickcolor = Color.PINK, arrowcolor = Color.RED, name = "SRSell"); 


#Alerts

Alert(condition = enableAlerts and buysignal[1] == 0 and buysignal == 1, text = "Buy Signal", sound = Sound.Bell, "alert type" = Alert.BAR);

Alert(condition = enableAlerts and buysignal[1] == 1 and buysignal == 0, text = "Momentum_Down", sound = Sound.Bell, "alert type" = Alert.BAR);

Alert(condition = enableAlerts and sellsignal[1] == 0 and sellsignal == 1, text = "Sell Signal", sound = Sound.Bell, "alert type" = Alert.BAR);

Alert(condition = enableAlerts and sellsignal[1] == 1 and sellsignal == 0, text = "Momentum_Up", sound = Sound.Bell, "alert type" = Alert.BAR);

#end strategy


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
FPL.DefineColor("Positive and Up", Color.GREEN);
FPL.DefineColor("Positive and Down", Color.DARK_GREEN);
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

# see https://usethinkscript.com/threads/extended-floating-profit-loss-backtesting-data-utility.1624/page-3
#def exitBarNum = if !hasEntry and !IsNaN(exitBarsTemp[1]) then bn else exitBarNum[1];
def exitBarNum = if !hasEntry and !IsNaN(exitBarsTemp) then bn else exitBarNum[1];

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
AddChartBubble(!hideFPL and showEntryBubbles and isEntryBar, FPL, "Entry: " + entryBarPL + " | " + bn, Color.WHITE);
AddChartBubble(!hideFPL and showEntryBubbles and isExitBar, FPL, "Exit: " + exitBarPL,
               color = if isWin
                       then Color.LIGHT_GREEN
                       else if isLoss
                       then Color.DARK_RED
                       else Color.GRAY,
               up = no
              );

#Labels

AddLabel(showLabel,
         text = "LastEntry: " + AsPrice(entryPrice)
         );

AddLabel(hasEntry && showLabel,
         text = "Current Trade % Return:  " + AsPercent(cumsum),
         color = if cumsum > 0
         then Color.GREEN
         else Color.RED
        );

AddLabel(showLabel,
         text = "Total Trades: " + entryCount,
         color = Color.WHITE
         );

AddLabel(showLabel,
         text = "WinCount: " + winCount +
                "|LossCount: " + lossCount +
                "|WinRate: " + winRate,
         color = if winRate >= targetWinRate
                 then Color.GREEN
                 else Color.RED
         );

AddLabel(showLabel,
         text = "W/L: " + AsPercent(winLossRatio),
         color = if winLossRatio > targetWinLoss
                 then Color.GREEN
                 else Color.RED
         );

AddLabel(showLabel,
        text = "HighestReturn: " +  AsDollars(highestReturn),
        color = if highestReturn > 0
                then Color.GREEN
                else Color.RED
        );

AddLabel(showLabel,
        text = "LowestReturn: " +  AsDollars(lowestReturn),
        color = if lowestReturn > 0
                then Color.GREEN
                else Color.RED
        );

AddLabel(showLabel,
         text = "AvgReturn: " + AsDollars(avgReturn) +
                "|AvgWin: " + AsDollars(avgWin) +
                "|AvgLoss: " + AsDollars(avgLoss),
         color = if avgReturn >= 0
                 then Color.LIGHT_GREEN
                 else Color.RED
         );

AddLabel(showLabel,
        text = "PeakToValley DD: " +  AsPercent(drawdown) + 
               "|Duration: " + ptvDrawdownDuration +
                if ptvDrawdownDurationFormat == 1
                then " hours"
                else if ptvDrawdownDurationFormat == 2
                then " days"
                else " mins" ,
        color = if drawdown > 0
                then Color.GREEN
                else Color.RED
        );


AddLabel(largestEquityDrawdown < 0 && showLabel,
        text = "Largest Equity DD: " +  AsDollars(largestEquityDrawdown) + 
               "|Duration: " + equityDrawdownDuration +
                if equityDrawdownDurationFormat == 1
                then " hours"
                else if equityDrawdownDurationFormat == 2
                then " days"
                else " mins",
        color = if largestEquityDrawdown > 0
                then Color.GREEN
                else Color.RED
        );

AddLabel(showLabel,
         text = "P&L High" +
                (if enableDebugging
                then " at bar " + highBarNumber
                else "") +
                ":  " + AsDollars(highFPL),
        color = Color.GREEN
       );

AddLabel(showLabel,
         text = "P&L Low" +
                (if enableDebugging
                then " at bar " + lowBarNumber
                else "") +
                ":  " + AsDollars(lowFPL),
        color = Color.RED
       );

AddLabel(showLabel,
         text = "Days Profit: $" + DaysProfit,
         color = if DaysProfit > 0
                 then Color.GREEN
                 else Color.RED
        );

AddLabel(showLabel,
         text = "Total Profit: " + AsDollars(FPL),
         color = if FPL > 0
                 then Color.GREEN
                 else Color.RED
        );

#debugging

#peaks & troughs
AddChartBubble(enableDebugging and isPeak, FPL,
               text = "FPL: " + FPL 
                      + "|Peak: " + peak 
                      + "|Trough: " + trough[-1] 
                      + "|Drawdown: " + AsPercent(calculateDrawdown(trough, peak))
                      + "|PeakBN: " + peakBN
                      + "|BarNumber: " + bn, 
               color = Color.LIME
              );

AddChartBubble(enableDebugging and isTrough, FPL, 
               text = "FPL: " + FPL
                      + "|Peak: " + peak 
                      + "|Trough: " + trough 
                      + "|Drawdown: " + AsPercent(calculateDrawdown(trough, peak))
                      + "|TroughBN: " + troughBN
                      + "|BarNumber: " + bn,
              color = Color.LIGHT_RED, 
              up = no
             );

AddVerticalLine(enableDebugging and isEntryBar,
                text = "EntryBarNum: " + entryBarNum 
                       + "|ExitBarNum: " + exitBarNum[-1] 
                       + "|BarNumber: " + bn, 
                color = Color.WHITE
);

AddVerticalLine(enableDebugging and isExitBar,
                text =  "EntryBarNum: " + entryBarNum[1] 
                        + "|ExitbarNum: " + exitBarNum
                        + "|BarNumber: " + bn
                        + "|EntryReturn: " + entryReturn, 
                color = if isWin 
                        then Color.LIGHT_GREEN
                        else if isLoss
                        then Color.LIGHT_RED
                        else Color.LIGHT_GREEN
);