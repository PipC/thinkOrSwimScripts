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
declare lower;
# Set length to period of interest.

input avgApartFactor = 1;

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

plot middleLevel = 50;
middleLevel.AssignValueColor(color.White);

plot rsrank = round(100* calc,0);

plot rsAvg1 = SimpleMovingAvg(rsrank, avgApartFactor * 7);
plot rsAvg2 = SimpleMovingAvg(rsrank, avgApartFactor * 14);
plot rsAvg3 = SimpleMovingAvg(rsrank, avgApartFactor * 21);
plot rsAvg4 = SimpleMovingAvg(rsrank, avgApartFactor * 28);
plot rsAvg5 = SimpleMovingAvg(rsrank, avgApartFactor * 35);
plot rsAvg6 = SimpleMovingAvg(rsrank, avgApartFactor * 42);
plot rsAvg7 = SimpleMovingAvg(rsrank, avgApartFactor * 49);
plot rsAvg8 = SimpleMovingAvg(rsrank, avgApartFactor * 56);
plot rsAvg9 = SimpleMovingAvg(rsrank, avgApartFactor * 63);

#rs10dAvg.setDefaultColor(GetColor(1));
#rs20dAvg.setDefaultColor(GetColor(2));
#rs50dAvg.setDefaultColor(GetColor(3));
#rs100dAvg.setDefaultColor(GetColor(4));
#rs200dAvg.setDefaultColor(GetColor(5));

#rsAvg1.setDefaultColor(CreateColor(250, 170, 0));
#rsAvg2.SetDefaultColor(CreateColor(240, 180, 20));
#rsAvg3.SetDefaultColor(CreateColor(230, 190, 40));
#rsAvg4.SetDefaultColor(CreateColor(220, 200, 60));
#rsAvg5.SetDefaultColor(CreateColor(210, 210, 80));
#rsAvg6.SetDefaultColor(CreateColor(200, 220, 100));
#rsAvg7.SetDefaultColor(CreateColor(190, 230, 120));
#rsAvg8.SetDefaultColor(CreateColor(180, 240, 140));
#rsAvg9.SetDefaultColor(CreateColor(170, 250, 160));

rsAvg1.setDefaultColor(CreateColor(247, 223, 115));
rsAvg2.SetDefaultColor(CreateColor(241, 199, 137));
rsAvg3.SetDefaultColor(CreateColor(229, 237, 11));
rsAvg4.SetDefaultColor(CreateColor(214, 110, 70));
rsAvg5.SetDefaultColor(CreateColor(193, 76, 50));
rsAvg6.SetDefaultColor(CreateColor(164, 51, 40));
rsAvg7.SetDefaultColor(CreateColor(134, 31, 36));
rsAvg8.SetDefaultColor(CreateColor(113, 17, 32));
rsAvg9.SetDefaultColor(CreateColor(89, 8, 20));

#addlabel (yes,RSRank);

#AddLabel (yes, if  RSRank >= 1 and RSRank < 100 then "000" + astext(RSRank) else astext( RSRank)   );

#assignbackgroundcolor (if RSRank > 80 then color.dark_green else
#                       if RSRank > 60 and RSRank <= 80 then #createcolor(0,175,0) else
#                       if RSRank > 40 and RSRank <= 60 then color.#gray else
#                       if RSRank > 20 and RSRank <= 40 then #CreateColor(220, 0,0) else
#                       if RSRank <= 20 then CreateColor(150, 0,0) #else
#                       color.white);

rsrank.AssignValueColor(if RSRank > 80 then color.dark_green else
                       if RSRank > 60 and RSRank <= 80 then createcolor(0,175,0) else
                       if RSRank > 40 and RSRank <= 60 then color.gray else
                       if RSRank > 20 and RSRank <= 40 then CreateColor(220, 0,0) else
                       if RSRank <= 20 then CreateColor(150, 0,0) else
                       color.white);
rsrank.SetLineWeight(2);

AddLabel(RSRank, "RS Rank: " + RSRank, if RSRank > 80 then color.dark_green else
                       if RSRank > 60 and RSRank <= 80 then createcolor(0,175,0) else
                       if RSRank > 40 and RSRank <= 60 then color.gray else
                       if RSRank > 20 and RSRank <= 40 then CreateColor(220, 0,0) else
                       if RSRank <= 20 then CreateColor(150, 0,0) else
                       color.white);
