# https://usethinkscript.com/threads/opening-range-breakout-indicator-for-thinkorswim.16/page-25

declare Once_per_bar;

input Mopen  = 0930; # Begin
input M5min  = 0935; #hint End of first 5 min bar
input OREnd    = 1000; #hint OrEnd: End Period of Opening Range Breakout.
input lengthAtr = 4;  #hint Lenght for the ATR Risk Target Lines.
input AtrMult = 2.0; #hint ATRmult: Multiplier for the ATR calculations.

def min5Active = if secondsTillTime(m5min) > 0 and secondsFromTime(mopen) >= 0 then 1 else 0;
def today = if GetAggregationPeriod() <= AggregationPeriod.fifteen_MIN and getDay() == getLastDay() and secondsFromTime(mopen) >= 0 then 1 else 0;

def m5High = if m5High[1] == 0
               or min5Active[1] == 0 and
                  min5Active == 1
               then high
               else if min5Active and
                       high > m5High[1]
               then high
               else m5High[1];
  def m5Low = if m5Low[1] == 0
              or min5Active[1] == 0 and
                 min5Active == 1
              then low
              else if min5Active and
                      low < m5Low[1]
              then low
              else m5Low[1];
  def m5Width = m5High - m5Low;
 
  def m5HighAct = if min5Active
             or today < 1
             then double.NaN
             else m5High;
  def m5LowAct = if min5Active
             or today < 1
             then double.NaN
             else m5Low;
  def min5mid = m5HighAct - Round(((m5HighAct - m5LowAct) / 2) / TickSize(), 0) * TickSize();
  def ORActive = if secondsTillTime(OREnd) > 0 and
                     secondsFromTime(mopen) >= 0
                  then 1
                  else 0;
  def ORHigh = if ORHigh[1] == 0
                  or ORActive[1] == 0 and
                     ORActive == 1
                then high
                else if ORActive and
                        high > ORHigh[1]
                then high
                else ORHigh[1];
  def ORLow = if ORLow[1] == 0
                or ORActive[1] == 0 and
                   ORActive == 1
               then low
               else if ORActive and
                       low < ORLow[1]
               then low
               else ORLow[1];
  def ORWidth = ORHigh - ORLow;
  def ORendTime = if secondsTillTime(OREnd) == 0
                 then 1
                 else 0;
  def min5meanBar = if !min5Active and min5Active[1] and today
                  then barNumber()
                  else min5meanBar[1];
  def ORendBar = if !ORActive and ORActive[1] and today
                 then barNumber()
                 else ORendBar[1];
  def Mopenm = if (min5mid == 0 , double.NaN, min5mid);

plot OpenMidp =   if barNumber() >= highestall(min5meanBar) then Highestall(if isNaN(close[-1]) then Mopenm[1] else double.nan) else double.nan;
     OpenMidp.SetDefaultColor(color.Yellow);
     OpenMidp.SetStyle(curve.medium_DASH);
     OpenMidp.SetLineWeight(1);
     OpenMidp.HideTitle();

  def ORHi = if ORActive
             or today < 1
             then double.NaN
             else ORHigh;


plot ORHighP = if barNumber() >= highestAll(ORendBar)
               then HighestAll(if isNaN(close[-1])
                               then ORHi[1]
                               else double.nan)
               else double.nan;
     ORHighP.SetDefaultColor(color.dark_red);
     ORHighP.SetStyle(curve.Long_DASH);
     ORHighP.SetLineWeight(1);
     ORHighP.HideTitle();
  def ORLo = if ORActive
               or today < 1
             then double.NaN
             else ORLow;
plot ORLowP = if barNumber() >= highestAll(ORendBar)
               then HighestAll(if isNaN(close[-1])
                               then ORLo[1]
                               else double.nan)
               else double.nan;
     ORLowP.SetDefaultColor(color.dark_green);
     ORLowP.SetStyle(curve.medium_DASH);
     ORLowP.SetLineWeight(1);
     ORLowP.HideTitle();
 
# Begin Risk Algorithm
# First Breakout or Breakdown bars
  def Bubbleloc1 = isNaN(close[-1]);
  def BreakoutBar = if min5Active
                    then double.nan
                    else if !min5Active and close crosses above ORHi
                         then barnumber()
                         else if !isNaN(BreakoutBar[1]) and close crosses ORHi
                              then BreakoutBar[1]
                    else BreakoutBar[1];
  def ATR = if ORActive
  then Round((Average(TrueRange(high, close, low), lengthATR)) / TickSize(), 0) * TickSize()
  else ATR[1];
 def cond1 =  if high > ORHi and
                  high[1] <= ORHi
               then Round((ORHi  + (ATR * AtrMult)) / TickSize(), 0) * TickSize()
               else cond1[1];
# High Targets
plot Htarget = if barnumber() >= BreakoutBar
               then cond1
               else double.nan;
     Htarget.SetPaintingStrategy(paintingStrategy.Squares);
     Htarget.SetLineWeight(1);
     Htarget.SetDefaultColor(Color.White);
     Htarget.HideTitle();
AddChartBubble(BubbleLoc1, Htarget, "RO", color.white, if close > Htarget then no else yes);
  def condHtarget2 = if close crosses above cond1
  then Round((cond1 + (ATR * AtrMult)) / TickSize(), 0) * TickSize()
  else condHtarget2[1];
plot Htarget2 = if barnumber() >= BreakoutBar
                then  condHtarget2
                else double.nan;
     Htarget2.SetPaintingStrategy(PaintingStrategy.Squares);
     Htarget2.SetLineWeight(1);
     Htarget2.SetDefaultColor(Color.Plum);
     Htarget2.HideTitle();
AddChartBubble(BubbleLoc1, Htarget2, "2nd T", color.plum, if close > Htarget2
                                                          then no
                                                          else yes);
  def condHtarget3 = if close crosses above condHtarget2
  then Round((condHtarget2 + (ATR * AtrMult)) / TickSize(), 0) * TickSize()
  else condHtarget3[1];
plot Htarget3 = if barnumber() >= BreakoutBar
                then condHtarget3
                else double.nan;
     Htarget3.SetPaintingStrategy(PaintingStrategy.Squares);
     Htarget3.SetLineWeight(1);
     Htarget3.SetDefaultColor(Color.Plum);
     Htarget3.HideTitle();
AddChartBubble(isNaN(close[-1]), Htarget3, "3rd T", color.plum, if close > Htarget3 then no else yes);
  def condHtarget4 = if close crosses above condHtarget3
  then Round((condHtarget3 + (ATR * AtrMult)) / TickSize(), 0) * TickSize()
  else condHtarget4[1];
plot Htarget4 = if barnumber() >= HighestAll(BreakoutBar)
                then condHtarget4
                else double.nan;
     Htarget4.SetPaintingStrategy(PaintingStrategy.Squares);
     Htarget4.SetLineWeight(1);
     Htarget4.SetDefaultColor(Color.Plum);
     Htarget4.HideTitle();
AddChartBubble(BubbleLoc1, Htarget4, "4th T", color.plum, if close > Htarget4 then no else yes);
  def condHtarget5 = if close crosses above condHtarget4
  then Round((condHtarget4 + (ATR * AtrMult)) / TickSize(), 0) * TickSize()
  else condHtarget5[1];
plot Htarget5 = if barnumber() >= BreakoutBar
                then condHtarget5
                else double.nan;
     Htarget5.SetPaintingStrategy(PaintingStrategy.Squares);
     Htarget5.SetLineWeight(1);
     Htarget5.SetDefaultColor(Color.Plum);
     Htarget5.HideTitle();
AddChartBubble(BubbleLoc1, Htarget5, "5th T", color.plum, if close > Htarget5 then no else yes);
# Low Targets
  def cond2 = if low < ORLo and
                 low[1] >= ORLo
              then Round((ORLo  - (AtrMult * ATR)) / TickSize(), 0) * TickSize()
              else cond2[1];
plot Ltarget =  if barnumber() >= HighestAll(OREndBar)
                then highestAll(if isNaN(close[-1])
                                then cond2
                                else double.nan)
                else double.nan;
     Ltarget.SetPaintingStrategy(PaintingStrategy.Squares);
     Ltarget.SetLineWeight(1);
     Ltarget.SetDefaultColor(Color.White);
     Ltarget.HideTitle();
AddChartBubble(BubbleLoc1, cond2, "RO", color.white, if close < Ltarget
                                                     then yes
                                                     else no);
  def condLtarget2 = if close crosses below cond2
  then Round((cond2 - (AtrMult * ATR)) / TickSize(), 0) * TickSize()
  else condLtarget2[1];
plot Ltarget2 =  if barnumber() >= HighestAll(OREndBar)
                 then highestAll(if isNaN(close[-1])
                                 then condLtarget2
                                 else double.nan)
                 else double.nan;
     Ltarget2.SetPaintingStrategy(PaintingStrategy.Squares);
     Ltarget2.SetLineWeight(1);
     Ltarget2.SetDefaultColor(Color.Plum);
     Ltarget2.HideTitle();
AddChartBubble(BubbleLoc1, condLtarget2, "2nd T", color.plum, if close < condLtarget2
                                                              then yes
                                                              else no);
  def condLtarget3 = if close crosses below condLtarget2
  then Round((condLtarget2 - (AtrMult * ATR)) / TickSize(), 0) * TickSize()
  else condLtarget3[1];
plot Ltarget3 = if barnumber() >= HighestAll(OREndBar)
                then highestAll(if isNaN(close[-1])
                                then condLtarget3
                                else double.nan)
                else double.nan;
     Ltarget3.SetPaintingStrategy(PaintingStrategy.Squares);
     Ltarget3.SetLineWeight(1);
     Ltarget3.SetDefaultColor(Color.Plum);
     Ltarget3.HideTitle();
AddChartBubble(BubbleLoc1, condLtarget3, "3rd T", color.plum, if close < Ltarget3
                                                              then yes
                                                              else no);
  def condLtarget4 = if close crosses condLtarget3
  then Round((condLtarget3 - (AtrMult * ATR)) / TickSize(), 0) * TickSize()
  else condLtarget4[1];
plot Ltarget4 = if barnumber() >= HighestAll(OREndBar)
                then highestAll(if isNaN(close[-1])
                                then condLtarget4
                                else double.nan)
                else double.nan;
     Ltarget4.SetPaintingStrategy(PaintingStrategy.Squares);
     Ltarget4.SetLineWeight(1);
     Ltarget4.SetDefaultColor(Color.Plum);
     Ltarget4.HideTitle();
AddChartBubble(BubbleLoc1, condLtarget4, "4th T", color.plum, if close < Ltarget4
                                                              then yes
                                                              else no);
  def condLtarget5 = if close crosses condLtarget4
  then Round((condLtarget4 - (AtrMult * ATR)) / TickSize(), 0) * TickSize()
  else condLtarget5[1];
plot Ltarget5 = if barnumber() >= HighestAll(OREndBar)
                then highestAll(if isNaN(close[-1])
                                then condLtarget5
                                else double.nan)
                else double.nan;
     Ltarget5.SetPaintingStrategy(PaintingStrategy.Squares);
     Ltarget5.SetLineWeight(1);
     Ltarget5.SetDefaultColor(Color.Plum);
     Ltarget5.HideTitle();
AddChartBubble(BubbleLoc1, condLtarget5, "5th T", color.plum, if close < Ltarget5
                                                              then yes
                                                              else no);
                                                              

