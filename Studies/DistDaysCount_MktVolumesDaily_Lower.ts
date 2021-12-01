# SMO_MktVolumesDaily.ts
# For daily charts only.
# Nasdaq total volume: $TVOL/Q ;   NYSE total volume: $TVOL
# Distribution day count tracking by IBD:
# https://www.investors.com/how-to-invest/investors-corner/
# tracking-distribution-days-a-crucial-habit/
# Stalling daysFromDate tracking by IBD:
# https://www.investors.com/how-to-invest/investors-corner/
# can-slim-market-tops-stalling-distribution/
# https://usethinkscript.com/threads/ibd-distribution-days-study-for-tos.748/

declare lower;
declare zerobase;

def length = 20;        # volume moving average lenth in days

input volumeSymbol = {default NYSE, NASDAQ, SPX};

def volCl;
def volHi;
def findSymbol;

# To make volume differences more visible, use a base volume number
# The subtracted volume number is then magnified to present a bigger difference
def volMin;    # base number for volume

switch (volumeSymbol) {

# It was found there may be erratic volume data on close values
# On 2/19/2020, NYSE volume close values were 0 on 2/18 & 2/12
case NYSE:
    volCl = if close("$TVOL") == 0 then high("$TVOL") else close("$TVOL");
    #volCl = close("$TVOL");
    volHi = high("$TVOL");
# use SPX volume change percentage to replace erratic NYSE volume   
    findSymbol = if volCl == 0 then volCl[1] * (1+ (close("$TVOLSPC") - close("$TVOLSPC")[1])/close("$TVOLSPC")[1]) else volCl;
    volMin = 40000;
case NASDAQ:
    volcl = if close("$TVOL/Q") == 0 then high("$TVOL/Q") else close("$TVOL/Q");
    #volCl = close("$TVOL/Q");
    volHi = high("$TVOL/Q");
# use SPX volume change percentage to replace erratic NASDAQ volume   
    findSymbol = if volCl == 0 then volCl[1] * (1+ (close("$TVOLSPC") - close("$TVOLSPC")[1])/close("$TVOLSPC")[1]) else volCl;   
    volMin = 30000;
case SPX:
    volcl = if close("$TVOLSPC") == 0 then high("$TVOLSPC") else close("$TVOLSPC");    
    #volCl = close("$TVOLSPC");
    volHi = high("$TVOLSPC");
# use NYSE volume change percentage to replace erratic SPX volume   
    findSymbol = if volCl == 0 then volCl[1] * (1+ (close("$TVOL") - close("$TVOL")[1])/close("$TVOL")[1]) else volCl;
    volMin = 10000;

}

def cls = close;

def lastBar = HighestAll(if (IsNaN(cls), Double.NaN, BarNumber()));
def volumes = if IsNaN(findSymbol) and BarNumber() == lastBar then volumes[1] else findSymbol;

plot Vol = 3 * (volumes - volMin);
plot VolAvg = 3 * (Average(volumes, length) - volMin);

Vol.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
Vol.SetLineWeight(3);
Vol.DefineColor("Up", Color.UPTICK);
Vol.DefineColor("Down", Color.DOWNTICK);
Vol.AssignValueColor(if cls > cls[1] then Vol.color("Up")
                     else if cls < cls[1] then Vol.color("Down")
                     else GetColor(1));
VolAvg.SetDefaultColor(GetColor(8));

# Display useful texts starting at upper left corner
# End of Day volume change
def VolChangePercentDay = if (IsNaN(volumes[1]), 0,
                              100 * (volumes - volumes[1])/volumes[1]);

# InvalidDay was added since volume on 2019/11/29 (after Thanksgiving) was N/A.
addLabel( yes, if volChangePercentDay == 0 then "InvalidDay" else "" +
               "VolmChg="+ Concat("", round(VolChangePercentDay)) +
               "%", if VolChangePercentDay < 0 then
               Color.DARK_GRAY else if cls > cls[1] then Color.DARK_GREEN
               else Color.DARK_RED);

# Count distributionDay only if market price drops 0.2% or more
def downDay = cls <= (cls[1] * 0.998);

def volIncrease = volumes > volumes[1];

#
# After 25 sessions, a distribution day expires
# Use 25 bar numbers to represent 25 live sessions. GetDay or alike includes weekends.
#

def lastDays = if (BarNumber() > lastBar - 25) then 1 else 0;

# a distribution day can fall off the count if the index rises 6% or more,
# on an intraday basis, from its close on the day the higher-volume loss appears.
# Remove distribution days after prices increases 6% WHEN market is in uptrend.
# Need to fix:
# During market bottomed on 2-28-2020, stock price rose to 9.8% with market still in
# correction. The high volume selloff on 2-28 would still be counted as a distribution.
# The highest date should be after the distribution day

# Get proper high for future 25 days
def prHi = high;
def prLo = low;

def futureHigh = if isNaN(prHi[-25]) then futureHigh[1] else prHi[-25];
def prHighest = Highest(futureHigh, 25);
# Note: This condition disqualifies D-Days after large bear rally
# This is acceptable for now since D-Days in bear market are not really useful
def priceInRange = (cls * 1.06 >= prHighest);

def distributionDay = downDay and volIncrease and LastDays and priceInRange;

# Count valid distribution days in last 25 days
def distDayCount = sum(distributionDay, 25);


# A broad market correction makes the distribution day count irrelevent
# reset distribution count to 0
# Distribution day count should reset after 2nd confirmation day
# To do: automate the reset day when correction or follow-up day appears
# input distributionRstDay = 20191010;   a prior 2nd confirmation day
input distributionRstDay = 20200402;

def newDistributionCycle = GetYYYYMMDD() > distributionRstDay;
# Need to use above variable to restart d-day count
def newDistDays = sum(distributionDay and newDistributionCycle, 25);

# Display bubble red is count > 5, yellow >3, else while
AddChartBubble(distributionDay and !newDistributionCycle, vol, concat("", distDayCount),
                if distDayCount < 3 then color.WHITE
                else if distDayCount < 5 then color.LIGHT_ORANGE
                else color.RED);

# Show D-Day reset line at the next trading day after the reset date
# If D-Day is on Friday, then show it on next Monday
AddVerticalLine(if (GetDayOfWeek(distributionRstDay) < 5) and
                    (GetYYYYMMDD() == distributionRstDay + 1) then yes
                else if (GetDayOfWeek(distributionRstDay) == 5) and
                    (GetYYYYMMDD() == distributionRstDay + 3) then yes
                else no,
                "2ndCnfm", Color.GREEN, Curve.MEDIUM_DASH);

# to do: Comparison of preholiday data may be invalid.

#------------------------------------------------------------
# Stalling day counts
# 1. market has been rising and price is within 3% of 25 day high
# 2. Price making a high
#      current close >= prior 2 day close, or
#      current close >= prior day high
# 3. volume >= 95% of prior day volume
# 4. close in lower half of daily range
# 5. small gain within 0.4% for SPX & NASDAQ
# 6. The above IBD criteria disclosed in one article generates too many stalling days
#    Additional rules from IBD book are used to further reduce stalling counts
#    6.1 close up smaller than prior 2 days
#    6.2 low is lower than high of prior day (No unfilled gap-up)
#    6.3 there is at least one decent gain in prior 2 days
#    6.4 daily trading range should be similar to last 2 days
# 7. stalling counts are reduced due to time (25 days) and significantly upward
#    movement (6%) of the index
# Ex. 2019/11/12 was a stalling day on SPX, 2019/12/18 was stalling for Nasdaq

def priceIsHigh = cls >= cls[2] or cls >= prHi[1];
def priceLowHalf = cls < (prHi - prLo)/2 + prLo;
def priceGainSmall = cls - cls[1] > 0 and
                     ((cls - cls[1] < (cls[1] - cls[2])) or
                     ((cls - cls[1] < cls[2] - cls[3])));

# Added a 0.2% gap from prior day high to allow 2020/05/26 to count
# as a stalling day for NASDAQ
def priceGapFill = prLo < prHi[1] * 1.002;
def priceGainOk = (cls[1] - cls[2] > 0.002 * cls[2]) or
                   (cls[2] - cls[3] > 0.002 * cls[3]);
# price trading range is the high - low plus the gapup if any
def priceRange = if prLo > prHi[1] then prHi-prHi[1] else prHi -prLo;
def priceRangeBig = priceGainOk and priceRange > 0.8 * min(priceRange[1], priceRange[2]);

def stallDay = cls - cls[25] > 0 and
               cls >= 0.97 * Highest( prHi, 25) and
               volumes > 0.95 * volumes[1] and
               cls - cls[1] > 0 and
               cls - cls[1] < 1.004 * cls[1] and
               priceIsHigh and priceLowHalf and priceGainSmall and priceGapFill and
               priceRangeBig and lastDays;

# Count stalling days
def stallDayCount = sum(stallDay, 25);


# calculate new stalling days after the reset day (e.g. follow-up date)
def newStallDays = sum(StallDay and newDistributionCycle, 25);

# Display final distribution count (incl. stall days)
# red if >= 5, >3: yellow, else green
def totalDdays = distDayCount+stallDayCount;
def totalNdDays = newDistDays+StallDayCount;

AddChartBubble(distributionDay and newDistributionCycle, vol,
                if volCl == 0 then concat("?", newDistDays) else concat("", newDistDays),
                if totalNdDays < 3 then color.WHITE
                else if totalNdDays < 5 then color.LIGHT_ORANGE
                else color.RED);

AddChartBubble(stallDay AND lastDays, vol,
                if volCl == 0 then "?S" + concat("", stallDayCount)
                              else "S" + concat("", stallDayCount),
                if totalNdDays < 3 then color.WHITE
                else if totalNdDays < 5 then color.LIGHT_ORANGE
                else color.RED);
AddChartBubble(volCl == 0 AND !stallDay AND !distributionDay, vol, "?", color.LIGHT_GRAY);

addLabel(totalDdays != totalNdDays, "AllDdays =" + concat("", totalDdays), Color.GRAY);
addLabel(yes, "NewDdays =" + concat("",totalNdDays ),
         if totalNdDays <=2 then Color.Green
         else if totalNdDays <= 4 then Color.ORANGE
         else Color.RED);

# To do:
# IBD's book: "The Successful Investor"
#    If most of the 3 to 5 days of distributions have small spreads from high to low
#    the distribution is not large enough to cause market turning down.
#    Significant distributions should have the spreads a little wider than average.
#


# Add an indication of 1st rally day to start FTD count
# in a market correction period
# pink rally day is a day satisfying the following conditions:
# 1). Close above ? of daily TRUE range and below prior day close
# 2). Low is the lowest during the market correction,
#     including future lows if available
# resolution of each 1st rally day is set to about 2 weeks
def rDayInterval = round(25/2, 0);

def futureLow = if isNaN(prLo[-rDayInterval]) then futureLow[1]
                else prLo[-rDayInterval];
def futureCls = if isNaN(cls[-rDayInterval]) then futureCls[1]
                else cls[-rDayInterval];

# market correction is currently defined as down 8% from top
def mktCr    = prLo <= highest(high, 25) * .92;
def prRng    = TrueRange(prHi, cls, prLo); #prHi - prLo;
def pinkRday = cls > (prLo + (prHi - prLo)/2) and cls < cls[1] and
               prLo <= lowest(prLo[1],rDayInterval) and
               prLo <= lowest(futureLow, rDayInterval);
def realRday = cls > cls[1] and
               cls <= lowest(futureCls, rDayInterval) and
               cls[1] <= lowest(cls[1], rDayInterval) and
               !pinkRday[1];              
def RallyDay1 = (mktCr or mktCr[1]) and (pinkRday or realRday);

AddChartBubble(RallyDay1, vol, "R1", color.LIGHT_GREEN);