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

# A broad market correction makes the distribution day count irrelevent
# reset distribution count to 0
# Distribution day count should reset after 2nd confirmation day
# To do: automate the reset day when correction or follow-up day appears
# input distributionRstDay = 20191010;   a prior 2nd confirmation day
input distributionRstDay = 20200402;

# to do: Comparison of preholiday data may be invalid.

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

# Get proper high for future 25 days
def prHi = high;
def prLo = low;


# To do:
# IBD's book: "The Successful Investor"
#    If most of the 3 to 5 days of distributions have small spreads from high to low
#    the distribution is not large enough to cause market turning down.
#    Significant distributions should have the spreads a little wider than average.
#

# Add an indication of 1st rally day to start FTD count
# in a market correction period
# pink rally day is a day satisfying the following conditions:
# 1). Close above ½ of daily TRUE range and below prior day close
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
#def prRng    = TrueRange(prHi, cls, prLo); #prHi - prLo;
def pinkRday = cls > (prLo + (prHi - prLo)/2) and cls < cls[1] and
               prLo <= lowest(prLo[1],rDayInterval) and
               prLo <= lowest(futureLow, rDayInterval);
def realRday = cls > cls[1] and
               cls <= lowest(futureCls, rDayInterval) and
               cls[1] <= lowest(cls[1], rDayInterval) and
               !pinkRday[1];              
def RallyDay1 = (mktCr or mktCr[1]) and (pinkRday or realRday);

plot scan = RallyDay1 or RallyDay1[1];