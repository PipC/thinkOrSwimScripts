#HeikinAshi_Assume_Seven
#Author @dublin_capital
#Version History 202005301044ds
#2020-05-30

#based on a 2020-05-30 tweet from @RealBrianWatt, suggesting that you can assume 7 candles on a 30 minute Heikin Ashi chart

#https://usethinkscript.com/threads/heikin-ashi-just-assume-seven-strategy-for-thinkorswim.2673/

input barStop = 2;

def heikinAshiClose = (open + high + low + close) / 4;

rec heikinAshiOpen = CompoundValue(1, (heikinAshiOpen[1] + heikinAshiClose[1]) / 2, (open[1] + close[1]) / 2);

def difference = heikinAshiClose - heikinAshiOpen;

def longSignal = difference > 0 and difference[1] <= 0;
def shortSignal = difference < 0 and difference[1] >= 0;


def barNumberLong = CompoundValue(1, if difference > 0 then barNumberLong[1] + 1 else 0, 0);
def barNumberShort = CompoundValue(1, if difference < 0 then barNumberShort[1] + 1 else 0, 0);

def barsUp = if barNumberLong > 0 then barNumberLong else Double.NaN;

def barsDown = if barNumberShort > 0 then barNumberShort else Double.NaN;

#AddOrder(OrderType.BUY_AUTO, longSignal, tickcolor = Color.DARK_GREEN, arrowcolor = Color.DARK_GREEN, name = "LONG");
#AddOrder(OrderType.SELL_TO_CLOSE, barNumberLong > barStop - 1 and close < close[1], tickcolor = Color.DARK_GREEN, arrowcolor = Color.DARK_GREEN, name = "CLOSE");

#AddOrder(OrderType.SELL_AUTO, shortSignal, tickcolor = Color.DARK_RED, arrowcolor = Color.DARK_RED, name = "SHORT");
#AddOrder(OrderType.BUY_TO_CLOSE, barNumberShort > barStop - 1 and close > close[1], tickcolor = Color.DARK_RED, arrowcolor = Color.DARK_RED, name = "CLOSE");

plot scan = longSignal or  barNumberShort > barStop - 1 and close > close[1];

#AddLabel(yes, if difference > 0 then "Consecutive Bars Up: " + barsUp else if difference < 0 then "Consecutive Bars Down: " + barsDown else "0", if difference > 0 then color.DARK_GREEN else if difference < 0 then color.DARK_RED else color.GRAY);