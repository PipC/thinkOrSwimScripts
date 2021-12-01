# https://researchtrade.com/forum/read.php?7,2258,7937#msg-7937
# OptionMaster_ZIGZAG_Signal
#
input price = close;
input priceH = high; # swing high
input priceL = low; # swing low
input ATRreversalfactor = 3.2; #original is 3.2
def ATR = reference ATR(length = 5);
def reversalAmount = ATRreversalfactor * ATR;
input displace = 1;
def barNumber = BarNumber();
def barCount = HighestAll(If(IsNaN(price), 0, barNumber));
rec state = {default init, undefined, uptrend, downtrend};
rec minMaxPrice;

if (GetValue(state, 1) == GetValue(state.init, 0)) {
minMaxPrice = price;
state = state.undefined;
} else if (GetValue(state, 1) == GetValue(state.undefined, 0)) {
if (price <= GetValue(minMaxPrice, 1) - reversalAmount) {
state = state.downtrend;
minMaxPrice = priceL;
} else if (price >= GetValue(minMaxPrice, 1) + reversalAmount) {
state = state.uptrend;
minMaxPrice = priceH;
} else {
state = state.undefined;
minMaxPrice = GetValue(minMaxPrice, 1);
}
} else if (GetValue(state, 1) == GetValue(state.uptrend, 0)) {

if (price <= GetValue(minMaxPrice, 1) - reversalAmount) {
state = state.downtrend;

minMaxPrice = priceL;
} else {
state = state.uptrend;

minMaxPrice = Max(priceH, GetValue(minMaxPrice, 1));
}
} else {
if (price >= GetValue(minMaxPrice, 1) + reversalAmount) {
state = state.uptrend;
minMaxPrice = priceH;
} else {
state = state.downtrend;
minMaxPrice = Min(priceL, GetValue(minMaxPrice, 1));
}
}

def isCalculated = GetValue(state, 0) != GetValue(state, 1) and barNumber >= 1;
def futureDepth = barCount - barNumber;
def tmpLastPeriodBar;
if (isCalculated) {
if (futureDepth >= 1 and GetValue(state, 0) == GetValue(state, -1)) {
tmpLastPeriodBar = fold lastPeriodBarI = 2 to futureDepth + 1 with lastPeriodBarAcc = 1

while lastPeriodBarAcc > 0
do if (GetValue(state, 0) != GetValue(state, -lastPeriodBarI))
then -lastPeriodBarAcc
else lastPeriodBarAcc + 1;
} else {
tmpLastPeriodBar = 0;
}
} else {
tmpLastPeriodBar = Double.NaN;
}

def lastPeriodBar = if (!IsNaN(tmpLastPeriodBar)) then -AbsValue(tmpLastPeriodBar) else -futureDepth;
rec currentPriceLevel;
rec currentPoints;

if (state == state.uptrend and isCalculated) {
currentPriceLevel =
fold barWithMaxOnPeriodI = lastPeriodBar to 1 with barWithMaxOnPeriodAcc = minMaxPrice
do Max(barWithMaxOnPeriodAcc, GetValue(minMaxPrice, barWithMaxOnPeriodI));
currentPoints =
fold maxPointOnPeriodI = lastPeriodBar to 1 with maxPointOnPeriodAcc = Double.NaN

while IsNaN(maxPointOnPeriodAcc)
do if (GetValue(priceH, maxPointOnPeriodI) == currentPriceLevel)
then maxPointOnPeriodI
else maxPointOnPeriodAcc;
} else if (state == state.downtrend and isCalculated) {
currentPriceLevel =
fold barWithMinOnPeriodI = lastPeriodBar to 1 with barWithMinOnPeriodAcc = minMaxPrice

do Min(barWithMinOnPeriodAcc, GetValue(minMaxPrice, barWithMinOnPeriodI));

currentPoints =
fold minPointOnPeriodI = lastPeriodBar to 1 with minPointOnPeriodAcc = Double.NaN

while IsNaN(minPointOnPeriodAcc)
do if (GetValue(priceL, minPointOnPeriodI) == currentPriceLevel)
then minPointOnPeriodI
else minPointOnPeriodAcc;
} else if (!isCalculated and (state == state.uptrend or state == state.downtrend)) {
currentPriceLevel = GetValue(currentPriceLevel, 1);
currentPoints = GetValue(currentPoints, 1) + 1;
} else {
currentPoints = 1;
currentPriceLevel = GetValue(price, currentPoints);
}

def "ZZ$" = if (barNumber == barCount or barNumber == 1) then if state == state.uptrend then priceH else priceL else if (currentPoints == 0) then currentPriceLevel else Double.NaN;
rec zzSave = if !IsNaN("ZZ$" ) then if (barNumber == barCount or barNumber == 1) then if IsNaN(barNumber[-1]) and state == state.uptrend then priceH else priceL else currentPriceLevel else GetValue(zzSave, 1);
def chg = (if barNumber == barCount and currentPoints < 0 then priceH else if barNumber == barCount and currentPoints > 0 then priceL else currentPriceLevel) - GetValue(zzSave, 1);
def isUp = chg >= 0;

#Higher/Lower/Equal High, Higher/Lower/Equal Low
def xxhigh = if zzSave == priceH then Round(high, 2) else Round(xxhigh[1], 2);
def chghigh = Round(Round(high, 2) - Round(xxhigh[1], 2), 2);
def xxlow = if zzSave == priceL then Round(low, 2) else Round(xxlow[1], 2);
def chglow = Round(Round(low, 2) - Round(xxlow[1], 2), 2);

rec isConf = AbsValue(chg) >= reversalAmount or (IsNaN(GetValue("ZZ$", 1)) and GetValue(isConf, 1));


#"ZZ$".AssignValueColor(if !isConf then "ZZ$".Color("Undefined" ) else if isUp then "ZZ$".Color("Up Trend" ) else "ZZ$".Color("Down Trend" ));


#AddVerticalLine(showBubbleschange and !IsNaN("ZZ$") and barNumber != 1, 
#if isUp then "Sell" else "Buy", 
##if barCount == barNumber then "" else if isUp then "Sell" else "Buy",
#if barCount == barNumber or !isConf then GlobalColor("Unconfirmed" ) else if isUp then GlobalColor("Down" ) else GlobalColor("Up" #),curve.FIRM);

def sell = isUp and isConf and !IsNaN("ZZ$") and barNumber != 1;

plot scan = sell or sell[1];

## END CODE