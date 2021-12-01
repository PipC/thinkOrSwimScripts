# WLC NRelSt
# WatchListColumn TSL 09:56 Dave_S: # October 9 2019
# Hi markos: here's is your repaired script;
#
# I am attempting to create my own version of a RS Rating watchlist column that is weighted to the latest 3 months.  This little code throws a complex script warning .
# The idea here is a hack to create a Weighted Relative Strength

# V2.0 12-29-19 Added Data 2 code from uTS Nick & Commented out my Data 2 as well as Changed Data1 1 to ITOT which is Total Stock Market ETF
# V2.1 12-31-19 Changed Data1 back to close / Average(close, 6); For some reason, without this setting, NaN comes up on most numbers. Fixed now.

# Uncomment (#)  declare lower & plots at bottom if you want it on a chart.

#declare lower;

input lengthYR = 252;
input length3QTRs = 189;
input lengthHalfYr = 126;
input lengthQTR = 63;
input lengthWk = 6;
# input mid = 50;

  def C252 = Average(close, lengthYR);
  def C189  = Average(close, length3QTRs);
  def C126  = Average(close, lengthHalfYr);
  def C63  = Average(close, lengthQTR);
  def C6 = Average(close, lengthWk);

#def Data1 = close / close("SPX");
def Data1 = close / Average(close, 6);
# def Data2 = (((2*(c/c63))+(1.25*(c/c126))+(c/c189)+(0.75*(c/c252)))/4);
#def lastms Data2 = (((2*(close/c63))+(1.00*(close/c126))+(0.75*(close/c189))+(0.50*(close/c252)))/4);
# def Data2 = (((5*(close/c63))+(3.00*(close/c126))+(1.00*(close/c189))+(0.25*(close/c252)))/4);
def Data2 = ((2*(close/close[63])+1.25*(close/close[126])+(close/189)+0.75*(close/252))/4);
def Data3 = Data1 * Data2;
def newRngMin = 1;
def newRngMax = 100;
def HHData3 = HighestAll( Data3);
def LLData3 = LowestAll( Data3 );
plot RSRank = ((( newRngMax - newRngMin ) * ( Data3 - LLData3 )) / ( HHData3 - LLData3 )) + newRngMin;
#plot midline = mid;
# End MyexpRS3 Markos
# Renamed NRelSt 12-29-19
##

assignbackgroundcolor (if RSRank > 80 then color.dark_green else
                       if RSRank > 60 and RSRank <= 80 then createcolor(0,175,0) else
                       if RSRank > 40 and RSRank <= 60 then color.gray else
                       if RSRank > 20 and RSRank <= 40 then CreateColor(220, 0,0) else
                       if RSRank <= 20 then CreateColor(150, 0,0) else
                       color.white);