# RSI as Candles with atr trailing_stop
# Mobius
# German Burrito
# https://usethinkscript.com/threads/rsi-as-candles-with-atr-trailing-stop.5229/
 

# The AddChart() function isn't supported by TOS and so the colors are broken. If someone wants to go to the trouble it would be worked around with several instances of the plot.

 

declare lower;



def RSI = RSI();

def o = (RSI + RSI[1]) / 2;

def h = Max(RSI, RSI[1]);

def l = Min(RSI, RSI[1]);

def c = RSI;

AddChart(high = h, low = l, open = o, close = c, type = ChartType.BAR, Color.WHITE);

 
#
# TD Ameritrade IP Company, Inc. (c) 2009-2020
#

input trailType = {default modified, unmodified};
input ATRPeriod = 5;
input ATRFactor = 3.5;
input firstTrade = {default long, short};
input averageType = AverageType.WILDERS;

Assert(ATRFactor > 0, "'atr factor' must be positive: " + ATRFactor);

def HiLo = Min(o - l, 1.5 * Average(h - l, ATRPeriod));
def HRef = if l <= h[1]
    then h - c[1]
    else (h - c[1]) - 0.5 * (l - h[1]);
def LRef = if h >= l[1]
    then c[1] - l
    else (c[1] - l) - 0.5 * (l[1] - h);

def trueRange;
switch (trailType) {
case modified:
    trueRange = Max(HiLo, Max(HRef, LRef));
case unmodified:
    trueRange = TrueRange(h, c, l);
}
def loss = ATRFactor * MovingAverage(averageType, trueRange, ATRPeriod);

def state = {default init, long, short};
def trail;
switch (state[1]) {
case init:
    if (!IsNaN(loss)) {
        switch (firstTrade) {
        case long:
            state = state.long;
            trail =  c - loss;
        case short:
            state = state.short;
            trail = c + loss;
    }
    } else {
        state = state.init;
        trail = Double.NaN;
    }
case long:
    if (c > trail[1]) {
        state = state.long;
        trail = Max(trail[1], c - loss);
    } else {
        state = state.short;
        trail = c + loss;
    }
case short:
    if (c < trail[1]) {
        state = state.short;
        trail = Min(trail[1], c + loss);
    } else {
        state = state.long;
        trail =  c - loss;
    }
}

def BuySignal = Crosses(state == state.long, 0, CrossingDirection.ABOVE);
def SellSignal = Crosses(state == state.short, 0, CrossingDirection.ABOVE);

plot TrailingStop = trail;


TrailingStop.SetPaintingStrategy(PaintingStrategy.LINE);
TrailingStop.DefineColor("Buy", (Color.RED));
TrailingStop.DefineColor("Sell", (Color.GREEN));
TrailingStop.AssignValueColor(if state == state.long
    then TrailingStop.Color("Sell")
    else TrailingStop.Color("Buy"));

TrailingStop.SetLineWeight(1);



plot OverSold = if IsNaN(close[1]) then Double.NaN else 70;
plot OverBought = if IsNaN(close[1]) then Double.NaN else 30;


overBought.SetDefaultColor(Color.yellow);
overbought.SetLineWeight(1);
oversold.SetDefaultColor(Color.yellow);
oversold.SetLineWeight(1);