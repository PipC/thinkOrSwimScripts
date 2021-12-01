# Opening_Range_Breakout Strategy with Risk and Target Lines
# Mobius
# This is V03.02.2017  Other versions start with V01.01.2001 Ported to TOS 06.2011
#hint: Opening Range Breakout is one of the original Floor Trader Strategies.\n Why it works: Overnight orders accumulate. Those orders being placed during the first 15 minutes of Regular Trading Hours combined with the typical high volume in the first 30 minutes of trading make this the most volatile trading period of the day. Regularly released reports during the first 30 minutes of trading add to the volatility and effect the days direction.\n  Features of this study: The yellow dashed line is the Day Filter Line and is used to determin the trend direction for the day. The dominant time spent above or below this line during the Opening Range Period typically determines the days trend. Green points indicate a close at EOD above the yellow line. Red Points a close below the yellow line. Yellow points a neutral or balanced day, close Between the Opening Range Extremes and often very near the Day Filter Line. The Opening Range is plotted with a green and red dashed line. Trades can be taken when there is an open outside these range lines. Up to 5 Targets are generated using Average True Range to plot target lines. When price crosses the first target line part of the trade should be taken as Risk Off profit and a stop should be placed at the entry point ensuring a profitable trade. If price crosses further targets stops should be moved to the preceeding target until stopped or your profit target is met. Initial Risk Stops are an open below the bar's low prior to entry or the Risk Lines plotted below the Opening range Lines. When price tests the opening range lines from below for the upper line or above for the lower lines trades can be taken with a first target to the yellow line from either direction and a Risk Stop line outside the opening range at the First Target lines or a close outside the Opening Range Lines. \n FYI the color of Probable close direction points are statistically accurate between 60% and 70% of the time. Trading against the direction of the ORB's Day Filtered Direction should be considered counter trend trades.\n As of 01.03.2017 You have just under a 52% probability that a DAILY bar will close green. So a 60% to 70% probability is a nice edge.
# https://usethinkscript.com/threads/opening-range-breakout-indicator-for-thinkorswim.16/
# 
# One Fine Day in 2016-2017 TSL – Mobius talks ORB in the ThinkScript Lounge
# Mobius' ORB V.3 draws a green and red long-dash lines, but while the red reacts to price, the green seems it
# does not - and is always drawn. Is this the expected behavior for the green?
# allopt - 11.00 AM
# The Red and Green ORB lines should not move after they are initially set (according to the time specified in
# the ORB settings).
# Alphalnvestor ? 11:02 AM
# There are two green lines and two red lines. The heavy red and green Ones are the Opening Range high and
# low the thin red and green lines are Risk Off markers for an Opening Range Breakout Trade
# Mobius - 11:02 AM
# What he said (I was talking about the heavy ORB lines)
# AlphaInvestor ? 11:03 AM
# The Risk Off Red line is drawn only when price is below the yellow line (mid?), while the Risk Off Green line
# is drawn consistently since the open (although earlier it was below the yellow).
# allopt - 11:06 AM
# yeah, I had been playing with the two different plots when I posted the code. you can go into the code and
# change the red line condition to match the green lines condition and the red will plot the same as the green
# Mobius ? 11:08 AM
# Replace lines 225 - 227 with this
# plot ORLriskDN = if bar >= OREndBar and ! ORActive and today then
# HighestAll(ORL2ext + InitialRisk) else Double.NaN;
# Mobius ? 11:10 AM
# to confirm, draw both, consistently throughout the session, regardless of price. Correct?
# allopt ? 11:10 AM
# Yes - It's just plotting the RISK line for a Short trade when Price Breaks Below the OR Low
# Mobius - 11:11 AM
# Mobius, is not defined in version
# V03.02.2017. Is there a newer version than the one I have?
# allopt ? 11:23 AM
# Not defined in mine either - I was previously told to put ATR in there
# AlphaInvestor ? 11:24 AM
# allopt -this is the study I have running https://tos.mx/M6TsmG
# Mobius ? 11:28 AM
# Remember if you find errors or omissions send complaints to the same place you sent payment to for the
# study.
# Mobius - 11:30 AM
# I constantly mess with that study. Always looking for ways to improve it or emulate my trading. So, over a few
# years it will change some but never very much
# Mobius ? 11:44 AM
# in the version I just posted I added a few studies I always run with it, just to make it easier for me.
# Mobius - 11:47 AM
# I also run this study with ORB and will likely
# build this into my unified code too.
# htto://tos mx/CDZDJ4 Mobius ? 11:49 AM 

declare Hide_On_Daily;
declare Once_per_bar;

input OrMeanS  = 0930.0; #hint OrMeanS: Begin Mean Period. Usually Market Open EST.
input OrMeanE  = 0935.0; #hint OrMeanE: End Mean period. Usually End of first bar.
input OrBegin  = 0930.0; #hint OrBegin: Beginning for Period of Opening Range Breakout.
input OrEnd    = 1000.0; #hint OrEnd: End of Period of Opening Range Breakout.
input CloudOn  = no;     #hint CloudOn: Clouds Opening Range.
input AlertOn  = yes;    #hint AlertOn: Alerts on cross of Opening Range.
input ShowTodayOnly = {"No", default "Yes"};   
input nAtr = 4;          #hint nATR: Lenght for the ATR Risk and Target Lines.
input AtrTargetMult = 2.0; #hint ATRmult: Multiplier for the ATR calculations.

  def h = high;
  def l = low;
  def c = close;
  def bar = barNumber();
  def s = ShowTodayOnly;
  def ORActive = if secondsTillTime(OrMeanE) > 0 and
                    secondsFromTime(OrMeanS) >= 0 
                 then 1 
                 else 0;
  def today = if s == 0 
              or getDay() == getLastDay() and
                 secondsFromTime(OrMeanS) >= 0 
              then 1 
              else 0;
  def ORHigh = if ORHigh[1] == 0 
               or ORActive[1] == 0 and 
                  ORActive == 1 
               then h 
               else if ORActive and
                       h > ORHigh[1] 
               then h 
               else ORHigh[1];
  def ORLow = if ORLow[1] == 0 
              or ORActive[1] == 0 and
                 ORActive == 1 
              then l 
              else if ORActive and
                      l < ORLow[1] 
              then l 
              else ORLow[1];
  def ORWidth = ORHigh - ORLow;
  def na = double.nan;
  def ORHA = if ORActive 
             or today < 1 
             then na 
             else ORHigh;
  def ORLA = if ORActive 
             or today < 1 
             then na 
             else ORLow;
  def O = ORHA - Round(((ORHA - ORLA) / 2) / TickSize(), 0) * TickSize();
  def ORActive2 = if secondsTillTime(OREnd) > 0 and
                     secondsFromTime(ORBegin) >= 0 
                  then 1 
                  else 0;
  def ORHigh2 = if ORHigh2[1] == 0 
                  or ORActive2[1] == 0 and
                     ORActive2 == 1 
                then h
                else if ORActive2 and
                        h > ORHigh2[1] 
                then h 
                else ORHigh2[1];
  def ORLow2 = if ORLow2[1] == 0 
                or ORActive2[1] == 0 and
                   ORActive2 == 1 
               then l 
               else if ORActive2 and
                       l < ORLow2[1] 
               then l 
               else ORLow2[1];
  def ORWidth2 = ORHigh2 - ORLow2;
  def TimeLine = if secondsTillTime(OREnd) == 0  
                 then 1 
                 else 0;
  def ORmeanBar = if !ORActive and ORActive[1]
                  then barNumber()
                  else ORmeanBar[1];
  def ORendBar = if !ORActive2 and ORActive2[1]
                 then barNumber()
                 else ORendBar[1];
  def ORL = if (o == 0 , na, o);
plot ORLext = if barNumber() >= highestAll(ORmeanBar) 
              then HighestAll(if isNaN(c[-1]) 
                              then ORL[1] 
                              else double.nan) 
              else double.nan;
     ORLext.SetDefaultColor(color.Yellow);
     ORLext.SetStyle(curve.Long_DASH);
     ORLext.SetLineWeight(1);
     ORLext.HideTitle();
  def ORH2 = if ORActive2 
             or today < 1 
             then na 
             else ORHigh2;
plot ORH2ext = if barNumber() >= highestAll(ORendBar) 
               then HighestAll(if isNaN(c[-1]) 
                               then ORH2[1] 
                               else double.nan) 
               else double.nan;
     ORH2ext.SetDefaultColor(color.Green);
     ORH2ext.SetStyle(curve.Long_DASH);
     ORH2ext.SetLineWeight(1);
     ORH2ext.HideTitle();
  def ORL2 = if ORActive2 
               or today < 1 
             then na 
             else ORLow2;
plot ORL2ext = if barNumber() >= highestAll(ORendBar) 
               then HighestAll(if isNaN(c[-1]) 
                               then ORL2[1] 
                               else double.nan) 
               else double.nan;
     ORL2ext.SetDefaultColor(color.Red);
     ORL2ext.SetStyle(curve.Long_DASH);
     ORL2ext.SetLineWeight(1);
     ORL2ext.HideTitle();
  def RelDay = (ORL - ORL2) / (ORH2 - ORL2);
  def dColor = if RelDay > .5
               then 5
               else if RelDay < .5
                    then 6
               else 4;
  def pos = (ORH2 - ORL2)/10;
plot d1 = if (TimeLine , ORH2, na);
plot d2 = if (TimeLine , ORH2 - ( pos * 2), na);
plot d3 = if (TimeLine , ORH2 - ( pos * 3), na);
plot d4 = if (TimeLine , ORH2 - ( pos * 4), na);
plot d5 = if (TimeLine , ORH2 - ( pos * 5), na);
plot d6 = if (TimeLine , ORH2 - ( pos * 6), na);
plot d7 = if (TimeLine , ORH2 - ( pos * 7), na);
plot d8 = if (TimeLine , ORH2 - ( pos * 8), na);
plot d9 = if (TimeLine , ORH2 - ( pos * 9), na);
plot d10 = if (TimeLine ,(ORL2), na);
     d1.SetPaintingStrategy(PaintingStrategy.points);
     d2.SetPaintingStrategy(PaintingStrategy.points);
     d3.SetPaintingStrategy(PaintingStrategy.points);
     d4.SetPaintingStrategy(PaintingStrategy.points);
     d5.SetPaintingStrategy(PaintingStrategy.points);
     d6.SetPaintingStrategy(PaintingStrategy.points);
     d7.SetPaintingStrategy(PaintingStrategy.points);
     d8.SetPaintingStrategy(PaintingStrategy.points);
     d9.SetPaintingStrategy(PaintingStrategy.points);
    d10.SetPaintingStrategy(PaintingStrategy.points);
     d1.AssignValueColor(GetColor(Dcolor));
     d2.AssignValueColor(GetColor(Dcolor));
     d3.AssignValueColor(GetColor(Dcolor));
     d4.AssignValueColor(GetColor(Dcolor));
     d5.AssignValueColor(GetColor(Dcolor));
     d6.AssignValueColor(GetColor(Dcolor));
     d7.AssignValueColor(GetColor(Dcolor));
     d8.AssignValueColor(GetColor(Dcolor));
     d9.AssignValueColor(GetColor(Dcolor));
    d10.AssignValueColor(GetColor(Dcolor));
     d1.HideBubble();
     d2.HideBubble();
     d3.HideBubble();
     d4.HideBubble();
     d5.HideBubble();
     d6.HideBubble();
     d7.HideBubble();
     d8.HideBubble();
     d9.HideBubble();
    d10.HideBubble();
     d1.HideTitle();
     d2.HideTitle();
     d3.HideTitle();
     d4.HideTitle();
     d5.HideTitle();
     d6.HideTitle();
     d7.HideTitle();
     d8.HideTitle();
     d9.HideTitle();
    d10.HideTitle();
addCloud(if CloudOn == yes 
         then orl 
         else double.nan
       , orl2,createColor(50,25,25), createColor(50,25,25));
addCloud(if CloudOn == yes 
         then orl 
         else double.nan
       , orh2,createColor(25,50,50), createColor(25,50,50));
# Begin Risk Algorithm
# First Breakout or Breakdown bars
  def Bubbleloc1 = isNaN(close[-1]);
  def BreakoutBar = if ORActive
                    then double.nan
                    else if !ORActive and c crosses above ORH2
                         then bar
                         else if !isNaN(BreakoutBar[1]) and c crosses ORH2
                              then BreakoutBar[1]
                    else BreakoutBar[1];
  def ATR = if ORActive2
  then Round((Average(TrueRange(h, c, l), nATR)) / TickSize(), 0) * TickSize()
  else ATR[1];
  def cond1 =  if h > ORH2 and 
                  h[1] <= ORH2
               then Round((ORH2  + (ATR * AtrTargetMult)) / TickSize(), 0) * TickSize() 
               else cond1[1];
plot ORLriskUP = if bar >= OREndBar and !ORActive and today 
                 then HighestAll(ORH2ext - 2) 
                 else double.nan;
     ORLriskUP.SetStyle(Curve.Long_Dash);
     ORLriskUP.SetDefaultColor(Color.Green);
     ORLriskUP.HideTitle();
  def crossUpBar = if close crosses above ORH2
                   then bar
                   else double.nan;
AddChartBubble(bar == HighestAll(crossUpBar), ORLriskUP, "Risk\nON ORH", color.green, no);
plot ORLriskDN = if bar >= OREndBar and !ORActive and close < ORL
                 then HighestAll(ORL2ext + 2) 
                 else double.nan;
     ORLriskDN.SetStyle(Curve.Long_Dash);
     ORLriskDN.SetDefaultColor(Color.Red);
     ORLriskDN.HideTitle();
  def crossDnBar = if close crosses below ORL2ext
                   then bar
                   else double.nan;
AddChartBubble(bar == HighestAll(crossDnBar), HighestAll(ORLriskDN), "Risk\nON ORL", color.red, yes);
# High Targets
plot Htarget = if bar >= BreakoutBar
               then cond1 
               else double.nan;
     Htarget.SetPaintingStrategy(paintingStrategy.LINE);
     Htarget.SetStyle(Curve.SHORT_DASH);
     Htarget.SetLineWeight(1);
     Htarget.SetDefaultColor(Color.White);
     Htarget.HideTitle();
AddChartBubble(BubbleLoc1, Htarget, "RO", color.white, if c > Htarget then no else yes);
  def condHtarget2 = if c crosses above cond1
  then Round((cond1 + (ATR * AtrTargetMult)) / TickSize(), 0) * TickSize()
  else condHtarget2[1];
plot Htarget2 = if bar >= BreakoutBar 
                then  condHtarget2 
                else double.nan;
     Htarget2.SetPaintingStrategy(paintingStrategy.LINE);
     Htarget2.SetStyle(Curve.SHORT_DASH);
     Htarget2.SetLineWeight(1);
     Htarget2.SetDefaultColor(Color.Plum);
     Htarget2.HideTitle();
AddChartBubble(BubbleLoc1, Htarget2, "2nd T", color.plum, if c > Htarget2 
                                                          then no 
                                                          else yes);
  def condHtarget3 = if c crosses above condHtarget2
  then Round((condHtarget2 + (ATR * AtrTargetMult)) / TickSize(), 0) * TickSize()
  else condHtarget3[1];
plot Htarget3 = if bar >= BreakoutBar 
                then condHtarget3 
                else double.nan;
     Htarget3.SetPaintingStrategy(paintingStrategy.LINE);
     Htarget3.SetStyle(Curve.SHORT_DASH);
     Htarget3.SetLineWeight(1);
     Htarget3.SetDefaultColor(Color.Plum);
     Htarget3.HideTitle();
AddChartBubble(isNaN(C[-1]), Htarget3, "3rd T", color.plum, if c > Htarget3 then no else yes);
  def condHtarget4 = if c crosses above condHtarget3
  then Round((condHtarget3 + (ATR * AtrTargetMult)) / TickSize(), 0) * TickSize()
  else condHtarget4[1];
plot Htarget4 = if bar >= HighestAll(BreakoutBar) 
                then condHtarget4 
                else double.nan;
     Htarget4.SetPaintingStrategy(paintingStrategy.LINE);
     Htarget4.SetStyle(Curve.SHORT_DASH);
     Htarget4.SetLineWeight(1);
     Htarget4.SetDefaultColor(Color.Plum);
     Htarget4.HideTitle();
AddChartBubble(BubbleLoc1, Htarget4, "4th T", color.plum, if c > Htarget4 then no else yes);
  def condHtarget5 = if c crosses above condHtarget4
  then Round((condHtarget4 + (ATR * AtrTargetMult)) / TickSize(), 0) * TickSize()
  else condHtarget5[1];
plot Htarget5 = if bar >= BreakoutBar 
                then condHtarget5 
                else double.nan;
     Htarget5.SetPaintingStrategy(paintingStrategy.LINE);
     Htarget5.SetStyle(Curve.SHORT_DASH);
     Htarget5.SetLineWeight(1);
     Htarget5.SetDefaultColor(Color.Plum);
     Htarget5.HideTitle();
AddChartBubble(BubbleLoc1, Htarget5, "5th T", color.plum, if c > Htarget5 then no else yes);
# Low Targets
  def cond2 = if L < ORL2 and 
                 L[1] >= ORL2 
              then Round((ORL2  - (AtrTargetMult * ATR)) / TickSize(), 0) * TickSize()
              else cond2[1];
plot Ltarget =  if bar >= HighestAll(OREndBar)
                then highestAll(if isNaN(c[-1])
                                then cond2
                                else double.nan)
                else double.nan;
     Ltarget.SetPaintingStrategy(paintingStrategy.LINE);
     Ltarget.SetStyle(Curve.SHORT_DASH);
     Ltarget.SetLineWeight(1);
     Ltarget.SetDefaultColor(Color.White);
     Ltarget.HideTitle();
AddChartBubble(BubbleLoc1, cond2, "RO", color.white, if c < Ltarget 
                                                     then yes 
                                                     else no);
  def condLtarget2 = if c crosses below cond2
  then Round((cond2 - (AtrTargetMult * ATR)) / TickSize(), 0) * TickSize()
  else condLtarget2[1];
plot Ltarget2 =  if bar >= HighestAll(OREndBar)
                 then highestAll(if isNaN(c[-1])
                                 then condLtarget2
                                 else double.nan)
                 else double.nan;
     Ltarget2.SetPaintingStrategy(paintingStrategy.LINE);
     Ltarget2.SetStyle(Curve.SHORT_DASH);
     Ltarget2.SetLineWeight(1);
     Ltarget2.SetDefaultColor(Color.Plum);
     Ltarget2.HideTitle();
AddChartBubble(BubbleLoc1, condLtarget2, "2nd T", color.plum, if c < condLtarget2 
                                                              then yes 
                                                              else no);
  def condLtarget3 = if c crosses below condLtarget2
  then Round((condLtarget2 - (AtrTargetMult * ATR)) / TickSize(), 0) * TickSize()
  else condLtarget3[1];
plot Ltarget3 = if bar >= HighestAll(OREndBar)
                then highestAll(if isNaN(c[-1])
                                then condLtarget3 
                                else double.nan)
                else double.nan;
     Ltarget3.SetPaintingStrategy(paintingStrategy.LINE);
     Ltarget3.SetStyle(Curve.SHORT_DASH);
     Ltarget3.SetLineWeight(1);
     Ltarget3.SetDefaultColor(Color.Plum);
     Ltarget3.HideTitle();
AddChartBubble(BubbleLoc1, condLtarget3, "3rd T", color.plum, if c < Ltarget3 
                                                              then yes 
                                                              else no);
  def condLtarget4 = if c crosses condLtarget3
  then Round((condLtarget3 - (AtrTargetMult * ATR)) / TickSize(), 0) * TickSize()
  else condLtarget4[1];
plot Ltarget4 = if bar >= HighestAll(OREndBar)
                then highestAll(if isNaN(c[-1])
                                then condLtarget4 
                                else double.nan)
                else double.nan;
     Ltarget4.SetPaintingStrategy(paintingStrategy.LINE);
     Ltarget4.SetStyle(Curve.SHORT_DASH);
     Ltarget4.SetLineWeight(1);
     Ltarget4.SetDefaultColor(Color.Plum);
     Ltarget4.HideTitle();
AddChartBubble(BubbleLoc1, condLtarget4, "4th T", color.plum, if c < Ltarget4 
                                                              then yes 
                                                              else no);
  def condLtarget5 = if c crosses condLtarget4
  then Round((condLtarget4 - (AtrTargetMult * ATR)) / TickSize(), 0) * TickSize()
  else condLtarget5[1];
plot Ltarget5 = if bar >= HighestAll(OREndBar)
                then highestAll(if isNaN(c[-1])
                                then condLtarget5 
                                else double.nan)
                else double.nan;
     Ltarget5.SetPaintingStrategy(paintingStrategy.LINE);
     Ltarget5.SetStyle(Curve.SHORT_DASH);
     Ltarget5.SetLineWeight(1);
     Ltarget5.SetDefaultColor(Color.Plum);
     Ltarget5.HideTitle();
AddChartBubble(BubbleLoc1, condLtarget5, "5th T", color.plum, if c < Ltarget5 
                                                              then yes 
                                                              else no);
def last = if secondsTillTime(1600) == 0 and
              secondsFromTime(1600) == 0
           then c[1]
           else last[1];
plot LastClose = if Today and last != 0 
                 then last 
                 else Double.NaN;
     LastClose.SetPaintingStrategy(paintingStrategy.DASHES);
     LastClose.SetDefaultColor(Color.White);
     LastClose.HideBubble();
     LastClose.HideTitle();
AddChartBubble(SecondsTillTime(0930) == 0, LastClose, "LastClose", color.gray, yes);
alert(c crosses above ORH2, "", Alert.Bar, Sound.Bell);
alert(c crosses below ORL2, "", Alert.Bar, Sound.Ring);
# End Code ORB with Risk and targets