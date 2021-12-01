input length = 21;
input returnLength = 1;
input index = {default SPX, "Nasdaq Composite", NDX, Dow30, "Russell 2000"};

Assert(returnLength > 0, "'return length' must be positive: " + returnLength);

def primary = if close[returnLength] == 0 then 0 else (close - close[returnLength]) / close[returnLength] * 100;

def logic;
switch (index) {
case SPX:
    logic = close("SPX");
case "Nasdaq Composite":
    logic = close("$COMP");
case NDX:
    logic = close("NDX");
case "Dow30":
    logic = close("$DJI");
case "Russell 2000":
    logic = close("RUT");
}

def secondary = if logic[returnLength] == 0 then 0 else (logic - logic[returnLength]) / logic[returnLength] * 100;

def Beta = Covariance(primary, secondary, length) / Sqr(StDev(secondary, length));

def pctChgIndex =  if logic[returnlength] == 0 then 0 else (logic - logic[returnlength]) / logic[returnlength];
def fastVarianceIndex = WMA(Sqr(pctChgIndex), length) - Sqr(WMA(pctChgIndex, length));
def pctChg = if close[returnlength] == 0 then 0 else (close - close[returnlength]) / close[returnlength];
def fastCovariance = WMA(pctChgIndex * pctChg, length) - WMA(pctChgIndex, length) * WMA(pctChg, length);

def fastBeta = fastCovariance / fastVarianceIndex;


AddLabel(yes, 
"Beta: f" + fastBeta + ", s" + Beta
, Color.WHITE);