#posted by @bp805
#edited by @mjlinhle


declare lower;

input anchorDate = 20200820;

input barsGoBack = 120;


#Zero
input showStopLabelZero = yes;

input devStopZero = {default Zero};# {default One, Two, Three, Zero, NegOne, NegTwo, NegThree, Custom}


#One
input showStopLabelOne = yes;

input devStopOne = {default One};


#Two
input showStopLabelTwo = yes;

input devStopTwo = {default Two};


#Three
input showStopLabelThree = yes;

input devStopThree = {default Three};


#NegOne
input showStopLabelNegOne = yes;

input devStopNegOne = {default NegOne};


#NegTwo
input showStopLabelNegTwo = yes;

input devStopNegTwo = {default NegTwo};


#***NegThree
input showStopLabelNegThree = yes;

input devStopNegThree = {default NegThree};

#***custom
input showStopLabelCustom = yes;

input devStopCustom = {default Custom};
input customDev = 0.15;



def postAnchorDate = if GetYYYYMMDD() >= anchorDate then 1 else 0;


def yyyyMmDd = GetYYYYMMDD();

def periodIndx = if GetAggregationPeriod() < AggregationPeriod.HOUR then yyyyMmDd else postAnchorDate;

def isPeriodRolled = CompoundValue(1, periodIndx != periodIndx[1], yes);


def volumeSum;

def volumeVwapSum;

def volumeVwap2Sum;


if (isPeriodRolled) {

    volumeSum = volume;

    volumeVwapSum = volume * vwap;

    volumeVwap2Sum = volume * Sqr(vwap);

} else {

    volumeSum = CompoundValue(1, volumeSum[1] + volume, volume);

    volumeVwapSum = CompoundValue(1, volumeVwapSum[1] + volume * vwap, volume * vwap);

    volumeVwap2Sum = CompoundValue(1, volumeVwap2Sum[1] + volume * Sqr(vwap), volume * Sqr(vwap));

}

def price = volumeVwapSum / volumeSum;

def deviation = Sqrt(Max(volumeVwap2Sum / volumeSum - Sqr(price), 0));


plot VScore = if (((price - close) * (-1)) / deviation) > 5 or (((price - close) * (-1)) / deviation) < -5 then 0 else (((price - close) * (-1)) / (deviation));

plot zero = 0;

plot one = 1;

plot two = 2;

plot three = 3;

plot negOne = -1;

plot negTwo = -2;

plot negThree = -3;

plot posInt = 0.3;

plot negInt = -0.3;

#Zero
def stopPriceZero = (0) * (deviation) + (price);

AddLabel(showStopLabelZero, "Price at [" + 0 + "] SD: " + AsPrice(Round(stopPriceZero, 2)), Color.WHITE);

#One
def stopPriceOne = (1) * (deviation) + (price);

AddLabel(showStopLabelOne, "Price at [" + 1 + "] SD: " + AsPrice(Round(stopPriceOne, 2)), Color.WHITE);

#Two
def stopPriceTwo = (2) * (deviation) + (price);

AddLabel(showStopLabelTwo, "Price at [" + 2 + "] SD: " + AsPrice(Round(stopPriceTwo, 2)), Color.WHITE);

#Three
def stopPriceThree = (3) * (deviation) + (price);

AddLabel(showStopLabelThree, "Price at [" + 3 + "] SD: " + AsPrice(Round(stopPriceThree, 2)), Color.WHITE);

#NegOne
def stopPriceNegOne = (-1) * (deviation) + (price);

AddLabel(showStopLabelNegOne, "Price at [" + -1 + "] SD: " + AsPrice(Round(stopPriceNegOne, 2)), Color.WHITE);

#NegTwo
def stopPriceNegTwo = (-2) * (deviation) + (price);

AddLabel(showStopLabelNegTwo, "Price at [" + -2 + "] SD: " + AsPrice(Round(stopPriceNegTwo, 2)), Color.WHITE);

#NegThree
def stopPriceNegThree = (-3) * (deviation) + (price);

AddLabel(showStopLabelNegThree, "Price at [" + -3 + "] SD: " + AsPrice(Round(stopPriceNegThree, 2)), Color.WHITE);


def zeroAndOne = if VScore > zero and VScore <= one then 1 else 0;

def oneAndTwo = if VScore > one and VScore <= two then 1 else 0;

def twoAndThree = if VScore > two and VScore <= three then 1 else 0;


def negZeroAndOne = if VScore > negOne and VScore < zero then 1 else 0;

def negOneAndTwo = if VScore > negTwo and VScore <= negOne then 1 else 0;

def negTwoAndThree = if VScore > negThree and VScore <= negTwo then 1 else 0;


def cloud1;

def cloud2;

if Sum(zeroAndOne, barsGoBack) > Sum(oneAndTwo, barsGoBack) and Sum(zeroAndOne, barsGoBack) > Sum(twoAndThree, barsGoBack) and Sum(zeroAndOne, barsGoBack) > Sum(negZeroAndOne, barsGoBack) and Sum(zeroAndOne, barsGoBack) > Sum(negOneAndTwo, barsGoBack) and Sum(zeroAndOne, barsGoBack) > Sum(negTwoAndThree, barsGoBack) {

    cloud1 = zero;

    cloud2 = one;

}

else if Sum(oneAndTwo, barsGoBack) > Sum(zeroAndOne, barsGoBack) and Sum(oneAndTwo, barsGoBack) > Sum(twoAndThree, barsGoBack) and Sum(oneAndTwo, barsGoBack) > Sum(negZeroAndOne, barsGoBack) and Sum(oneAndTwo, barsGoBack) > Sum(negOneAndTwo, barsGoBack) and Sum(oneAndTwo, barsGoBack) > Sum(negTwoAndThree, barsGoBack) {

    cloud1 = one;

    cloud2 = two;

}

else if Sum(twoAndThree, barsGoBack) > Sum(zeroAndOne, barsGoBack) and Sum(twoAndThree, barsGoBack) > Sum(oneAndTwo, barsGoBack) and Sum(twoAndThree, barsGoBack) > Sum(negZeroAndOne, barsGoBack) and Sum(twoAndThree, barsGoBack) > Sum(negOneAndTwo, barsGoBack) and Sum(twoAndThree, barsGoBack) > Sum(negTwoAndThree, barsGoBack) {

    cloud1 = two;

    cloud2 = three;

}

else if Sum(negZeroAndOne, barsGoBack) > Sum(zeroAndOne, barsGoBack) and Sum(negZeroAndOne, barsGoBack) > Sum(oneAndTwo, barsGoBack) and Sum(negZeroAndOne, barsGoBack) > Sum(twoAndThree, barsGoBack) and Sum(negZeroAndOne, barsGoBack) > Sum(negOneAndTwo, barsGoBack) and Sum(negZeroAndOne, barsGoBack) > Sum(negTwoAndThree, barsGoBack) {

    cloud1 = zero;

    cloud2 = negOne;

}

else if Sum(negOneAndTwo, barsGoBack) > Sum(zeroAndOne, barsGoBack) and Sum(negOneAndTwo, barsGoBack) > Sum(oneAndTwo, barsGoBack) and Sum(negOneAndTwo, barsGoBack) > Sum(twoAndThree, barsGoBack) and Sum(negOneAndTwo, barsGoBack) > Sum(negZeroAndOne, barsGoBack) and Sum(negOneAndTwo, barsGoBack) > Sum(negTwoAndThree, barsGoBack) {

    cloud1 = negOne;

    cloud2 = negTwo;

}

else if Sum(negTwoAndThree, barsGoBack) > Sum(zeroAndOne, barsGoBack) and Sum(negTwoAndThree, barsGoBack) > Sum(oneAndTwo, barsGoBack) and Sum(negTwoAndThree, barsGoBack) > Sum(twoAndThree, barsGoBack) and Sum(negTwoAndThree, barsGoBack) > Sum(negZeroAndOne, barsGoBack) and Sum(negTwoAndThree, barsGoBack) > Sum(negOneAndTwo, barsGoBack) {

    cloud1 = negTwo;

    cloud2 = negThree;

}

else {

    cloud1 = Double.NaN;

    cloud2 = Double.NaN;

}

AddCloud(cloud1, cloud2, Color.LIGHT_RED, Color.LIGHT_GREEN);



plot BullSignal = if (cloud1 == one or cloud2 == one or cloud1 == two or cloud2 == two or cloud1 == three or cloud2 == three) and (VScore <= 0.3 and VScore[1] > 0) and CCI() > -100 then -2 else Double.NaN;


plot BearSignal = if (cloud1 == negOne or cloud2 == negOne or cloud1 == negTwo or cloud2 == negTwo or cloud1 == negThree or cloud2 == negThree) and (VScore >= 0.3 and VScore[1] < 0) and CCI() < 100 then 2 else Double.NaN;


BullSignal.SetPaintingStrategy(PaintingStrategy.ARROW_UP);

BearSignal.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);

BullSignal.SetLineWeight(3);

BearSignal.SetLineWeight(3);


input soundAlertsOn = no;

Alert((cloud1 == one or cloud2 == one or cloud1 == two or cloud2 == two or cloud1 == three or cloud2 == three) and (VScore <= 0 and VScore[1] > 0) and (soundAlertsOn), "Bullish VScore Entry", Alert.BAR);

Alert((cloud1 == negOne or cloud2 == negOne or cloud1 == negTwo or cloud2 == negTwo or cloud1 == negThree or cloud2 == negThree) and (VScore >= 0 and VScore[1] < 0) and (soundAlertsOn), "Bearish VScore Entry", Alert.BAR);