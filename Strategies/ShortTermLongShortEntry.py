input price = HL2;
input HMA_Length = 21;
input lookback = 2;
input tradesize = 1;
input buyDelayDay = -2;

def HMA = HullMovingAvg(price = price, length = HMA_Length);

def delta = HMA[1] - HMA[lookback + 1];
def delta_per_bar = delta / lookback;

def next_bar = HMA[1] + delta_per_bar;

def concavity = if HMA > next_bar then 1 else -1;

def turning_point = if concavity[-1] != concavity then HMA else Double.NaN;

AddOrder(condition = turning_point and concavity == -1, tickcolor = Color.DARK_GREEN, arrowcolor = Color.DARK_GREEN, name = "Buy $"+high[buyDelayDay], tradeSize = tradesize, price = high[buyDelayDay]);


AddOrder(OrderType.SELL_TO_CLOSE, turning_point and concavity == 1, tickcolor = Color.DARK_RED, arrowcolor = Color.DARK_RED, name = "Sell $" + low[buyDelayDay], tradeSize = tradesize, price = low[buyDelayDay]);