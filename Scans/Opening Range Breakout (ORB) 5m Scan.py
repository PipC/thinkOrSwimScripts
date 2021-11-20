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


input OrMeanS  = 0930.0; #hint OrMeanS: Begin Mean Period. Usually Market Open EST.
#input OrMeanE  = 0935.0; #hint OrMeanE: End Mean period. Usually End of first bar.
input OrBegin  = 0930.0; #hint OrBegin: Beginning for Period of Opening Range Breakout.
input OrEnd    = 1000.0; #hint OrEnd: End of Period of Opening Range Breakout.
#input CloudOn  = no;     #hint CloudOn: Clouds Opening Range.
#input AlertOn  = yes;    #hint AlertOn: Alerts on cross of Opening Range.
input ShowTodayOnly = {"No", default "Yes"};   
#input nAtr = 4;          #hint nATR: Lenght for the ATR Risk and Target Lines.
#input AtrTargetMult = 2.0; #hint ATRmult: Multiplier for the ATR calculations.

  def h = high;
  def c = close;
  def s = ShowTodayOnly;
  def today = if s == 0 
              or getDay() == getLastDay() and
                 secondsFromTime(OrMeanS) >= 0 
              then 1 
              else 0;
  def na = double.nan;
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

def ORH2 = if ORActive2 
             or today < 1 
             then na 
             else ORHigh2;
#alert(c crosses above ORH2, "", Alert.Bar, Sound.Bell);
#alert(c crosses below ORL2, "", Alert.Bar, Sound.Ring);
# End Code ORB with Risk and targets

plot scan = c crosses above ORH2;
