######################################################################
input showlabels = yes;
######################################################################
# VWAP
input timeFrame = {default DAY, WEEK, MONTH};

def cap = getAggregationPeriod();
def errorInAggregation =
timeFrame == timeFrame.DAY and cap >= AggregationPeriod.WEEK or
timeFrame == timeFrame.WEEK and cap >= AggregationPeriod.MONTH;
assert(!errorInAggregation, "timeFrame should be not less than current chart aggregation period");

def yyyyMmDd = getYyyyMmDd();
def periodIndx;
switch (timeFrame) {
case DAY:
periodIndx = yyyyMmDd;
case WEEK:
periodIndx = Floor((daysFromDate(first(yyyyMmDd)) + getDayOfWeek(first(yyyyMmDd))) / 7);
case MONTH:
periodIndx = roundDown(yyyyMmDd / 100, 0);
}
def isPeriodRolled = compoundValue(1, periodIndx != periodIndx[1], yes);

def volumeSum;
def volumeVwapSum;
def volumeVwap2Sum;

if (isPeriodRolled) {
volumeSum = volume;
volumeVwapSum = volume * vwap;
volumeVwap2Sum = volume * Sqr(vwap);
} else {
volumeSum = compoundValue(1, volumeSum[1] + volume, volume);
volumeVwapSum = compoundValue(1, volumeVwapSum[1] + volume * vwap, volume * vwap);
volumeVwap2Sum = compoundValue(1, volumeVwap2Sum[1] + volume * Sqr(vwap), volume * Sqr(vwap));
}
def price_VWAP = volumeVwapSum / volumeSum;
def deviation = Sqrt(Max(volumeVwap2Sum / volumeSum - Sqr(price_VWAP), 0));

plot VWAP = price_VWAP;
VWAP.setDefaultColor(Color.YELLOW);
VWAP.setLineWeight(2);
AddLabel(Showlabels, " VWAP = " + Round(VWAP, 2), if close >= VWAP then color.LIGHT_GREEN else color.LIGHT_RED);
######################################################################
#TWAP
input price = FundamentalType.HLC3;
script TimeWAP {

input price = hlc3;
input timeFrame = {default Day, Week, Month, Chart};


def yyyyMmDd = GetYYYYMMDD();
def periodIndx;
switch (timeFrame) {
case Day:
periodIndx = yyyyMmDd;
case Week:
periodIndx = Floor((DaysFromDate(First(yyyyMmDd)) + GetDayOfWeek(First(yyyyMmDd))) / 7);
case Month:
periodIndx = RoundDown(yyyyMmDd / 100, 0);
case Chart:
periodIndx = 0;
}

def newday = CompoundValue(1, periodIndx != periodIndx[1], yes);
rec cumeprice = if newday then price else price + cumeprice[1];
rec cumebarnumber = if newday then 1 else 1 + cumebarnumber[1];

plot TWAP = Round(cumeprice / cumebarnumber, 4);

}

plot TWAP = TimeWAP(Fundamental(price));
TWAP.AssignValueColor(if TWAP > TWAP[1] then Color.LIGHT_GREEN else if TWAP is equal to TWAP[1] then Color.GRAY else Color.RED);
TWAP.SetStyle(Curve.SHORT_DASH);
TWAP.SetLineWeight(3);
TWAP.HideBubble();
AddLabel(Showlabels, " TWAP = " + Round(TWAP, 2) + "  ", if close >= TWAP then color.LIGHT_GREEN else color.LIGHT_RED);
######################################################################
Addlabel(showlabels, (if VWAP >= TWAP then "Above" else "Below") + "  ", if VWAP >= TWAP then color.WHITE else color.DARK_GRAY);
######################################################################