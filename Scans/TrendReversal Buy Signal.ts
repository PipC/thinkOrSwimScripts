#https://usethinkscript.com/threads/trend-reversal-indicator-with-signals-for-thinkorswim.183/
#Trend Reversal Indicator with Signals
def price = close;
def superfast_length = 9;
def fast_length = 14;
def slow_length = 21;
def displace = 0;

def mov_avg9 = ExpAverage(price[-displace], superfast_length);
def mov_avg14 = ExpAverage(price[-displace], fast_length);
def mov_avg21 = ExpAverage(price[-displace], slow_length);

#moving averages
def Superfast = mov_avg9;
def Fast = mov_avg14;
def Slow = mov_avg21;

def buy = mov_avg9 > mov_avg14 and mov_avg14 > mov_avg21 and low > mov_avg9;
def stopbuy = mov_avg9 <= mov_avg14;
def buynow = !buy[1] and buy;
def buysignal = CompoundValue(1, if buynow and !stopbuy then 1 else if buysignal[1] == 1 and stopbuy then 0 else buysignal[1], 0);

def Buy_Signal = buysignal[1] == 0 and buysignal == 1;

#Alert(condition = buysignal[1] == 0 and buysignal == 1, text = "Buy Signal", sound = Sound.Bell, "alert type" = Alert.BAR);

#def Momentum_Down = buysignal[1] == 1 and buysignal == 0;

#Alert(condition = buysignal[1] == 1 and buysignal == 0, text = "Momentum_Down", sound = Sound.Bell, "alert type" = Alert.BAR);

#def sell = mov_avg9 < mov_avg14 and mov_avg14 < mov_avg21 and high < mov_avg9;
#def stopsell = mov_avg9 >= mov_avg14;
#def sellnow = !sell[1] and sell;
#def sellsignal = CompoundValue(1, if sellnow and !stopsell then 1 else if sellsignal[1] == 1 and stopsell then 0 else sellsignal[1], 0);

#def Sell_Signal = sellsignal[1] == 0 and sellsignal;

#Alert(condition = sellsignal[1] == 0 and sellsignal == 1, text = "Sell Signal", sound = Sound.Bell, "alert type" = Alert.BAR);

#def Momentum_Up = sellsignal[1] == 1 and sellsignal == 0;

#ONeilRS
#    O'Neil price performance RS ranking
#    WTF_Dude
#    5.5.20
#    color styling codes from #WLC_RS1Yr RS_Rank by GHorschman
#     `
#    RS_Rank > 80       -- Dark Green
#    80 <= RS_Rank < 60 -- Light Green
#    60 <= RS_Rank < 40 -- Gray
#    40 <= RS_Rank < 20 -- Light Red
#    RS_Rank <= 20      -- Dark Red
######################################################################

# Set length to period of interest.

#  1 Wk – 5 trading days
#  1 Mos – 21 Days
#  3 Mos – 63 Days
#  6 Mos – 126 Days
#  12 Mos – 252 Days

def year = if close-close[252] is less than 0 then 0 else close-close[252] ;
def nine =  if close-close[189] is less than 0 then 0 else close-close[189] ;
def six =  if close-close[126] is less than 0 then 0 else close-close[126] ;;
def three = if close-close[63] is less than 0 then 0 else close-close[63] ;;
def weighted = if ((2*three) + six + nine + year)/4 is less than 0 then 0 else ((2*three + six + nine + year)/4); #decimal

def h = highest(high, 252);
def l = lowest(low, 252);
def hilo = absvalue(h-l);
def calc = weighted/ hilo;

def rsrank = round(100* calc,0);
#addlabel (yes,RSRank);

#AddLabel (yes, if  RSRank >= 1 and RSRank < 100 then "000" + astext(RSRank) else astext( RSRank)   );

#assignbackgroundcolor (if RSRank > 80 then color.dark_green else
#                       if RSRank > 60 and RSRank <= 80 then createcolor(0,175,0) else
#                       if RSRank > 40 and RSRank <= 60 then color.gray else
#                       if RSRank > 20 and RSRank <= 40 then CreateColor(220, 0,0) else
#                       if RSRank <= 20 then CreateColor(150, 0,0) else
#                       color.white);
#ONeilRS

plot scan = rsrank > 50 and (Buy_Signal);