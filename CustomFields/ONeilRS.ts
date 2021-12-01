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

plot rsrank = round(100* calc,0);
#addlabel (yes,RSRank);

#AddLabel (yes, if  RSRank >= 1 and RSRank < 100 then "000" + astext(RSRank) else astext( RSRank)   );

assignbackgroundcolor (if RSRank > 80 then color.dark_green else
                       if RSRank > 60 and RSRank <= 80 then createcolor(0,175,0) else
                       if RSRank > 40 and RSRank <= 60 then color.gray else
                       if RSRank > 20 and RSRank <= 40 then CreateColor(220, 0,0) else
                       if RSRank <= 20 then CreateColor(150, 0,0) else
                       color.white);