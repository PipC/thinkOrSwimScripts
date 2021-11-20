#shadow factor looks for tails based  body height of the candle in a downtrend  the idea was to find tails at the bottom of downtrend setup signifying liquidity being bought

input downtrendSetup = 6; #Number of bars to calculate downtrend slope...not all of these bars have to be descending as long as the overall value is neg it is descending

input shadowFactor = 1; #size of tail in relation to body  higher number less signals can be like .50 for more signals just not below zero or zero


assert(shadowFactor >0, "'shadow factor' must not be negative or zero: " + shadowFactor);

def BodyHeight = BodyHeight();

plot Bullish = IsDescending(close, downtrendSetup) and low<low[1] and low[1]<low[2] and low[2]<low[3]
    and
    Min(open, close) - low > shadowFactor * BodyHeight;

Bullish.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_UP);
Bullish.SetDefaultColor(GetColor(4));
Bullish.SetLineWeight(2);