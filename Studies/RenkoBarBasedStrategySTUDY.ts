# Version 1.0 Date: 2020-08-08
# Credits to rad14733 Renko Bar Based Strategy
# IrishGold Compilation of signals
# This Strategy best traded on Range -Renko Bar -10Ticks my preference - Options Trading
# Many parameters can be tweaked
# Strategy = opening a Long EntryPrice when a green WAE greater than ExplosiveBar signal, translation: MACD Calculation(trendUp) is positive and exceeds the  BollingerBands Bands Calculation (ex) which indicates the Strength of Signal
#Short Entry TrendDown and Signal Exceeds (ex)
# Also BullPowerSignal and Balance Of Power Signal  and RSI are used as alternate or confirmation signals


# Parameters
input Contracts = 1;
input TradeLong = 1;
input TradeShort = 0;
input sensitivity = 100; #"Sensitivity"
input fastLength =13; #"FastEMA Length"
input slowLength = 26; #"SlowEMA Length"
input channelLength = 20; #"BB Channel Length"
input mult = 2.0; #"BB Stdev Multiplier"
input deadZone = 0.2; #"No trade zone threshold"
input avgType = AverageType.HULL;
input length = 13;
input over_Bought = 70;
input over_Sold = 30;
input price = close;
input useRTH = 1;
input TradeTimeOpen = 0935.0;
input TradeTimeEnd = 1550.0;
input averageType = AverageType.WILDERS;
input EODCloseAll = 1;

# Limit trading time for Options especially
def RTH = if SecondsFromTime(TradeTimeOpen) >= 0 and
               SecondsTillTime(TradeTimeEnd) >= 0
            then 1
            else 0;

def NetChgAvg = MovingAverage(averageType, price - price[1], length);
def TotChgAvg = MovingAverage(averageType, AbsValue(price - price[1]), length);
def ChgRatio = if TotChgAvg != 0 then NetChgAvg / TotChgAvg else 0;

def RSI = 50 * (ChgRatio + 1);
def OverSold = over_Sold;
def OverBought = over_Bought;
def UpSignal = if RSI crosses above OverSold then OverSold else Double.NaN;
def DownSignal = if RSI crosses below OverBought then OverBought else Double.NaN;
def RSIDescending = isDescending(RSI(fastLength));

def FPL = FPL();
AddLabel(yes,
         text = "Total Profit: " + AsDollars(FPL),
         color = if FPL > 0
                 then Color.GREEN
                 else Color.RED
        );

# RSI reaching OverBought Take Profit signal
def TakeProfit = if RSI crosses above OverBought then 1 else 0;

# Calculations for "Waddah Attar Explosion " ------------#

script calc_macd {

    input source = close;
    input fastLength = 13;
    input slowLength = 26;

    def fastMA = MovAvgExponential(source, fastLength);
    def slowMA = MovAvgExponential(source, slowLength);

    plot out = fastMA - slowMA;

}

script calc_BBUpper {

    input source = close;
    input length = 20;
    input mult = 2.0;

    def basis = SimpleMovingAvg(source, length);
    def dev = mult * StDev(source, length);

    plot out = basis + dev;

}

script calc_BBLower {

    input source = close;
    input length = 20;
    input mult = 2.0;

    def basis = SimpleMovingAvg(source, length);
    def dev = mult * StDev(source, length);

    plot out = basis - dev;

}

def t1 = (calc_macd(price, fastLength, slowLength) - calc_macd(price[1],
fastLength, slowLength)) * sensitivity;

def t2 = (calc_macd(price[2], fastLength, slowLength) -
calc_macd(price[3], fastLength, slowLength)) * sensitivity;

def e1 = (calc_BBUpper(price, channelLength, mult) - calc_BBLower(price,
channelLength, mult));


def e2 = (calc_BBUpper(price[1], channelLength, mult) - calc_BBLower(price[1], channelLength, mult));

def trendUp = if t1 >= .50 then t1 else 0;
plot trendDown = if t1 < .50 then (-1 * t1) else 0;

def tUp = trendUp; #"UpTrend"
def tDn = trendDown; #"DownTrend"
def ExplosiveBar = if t1 > 0 and t1 > e1 then 1 else 0;
def ExplosiveBarShort = if trendDown > e1 then 1 else 0;

# //// WAE END CODE ////#


# BullPower Power
def BullPower = high - MovingAverage(avgType, close, length);
def BullPowerBuy = if BullPower > 0 then 1 else 0;
def BullPowerSell = if BullPower < 0 then 1 else 0;

# Balance of Power
def averageType2 = AverageType.HULL;
def rawBMP = if high != low then (close - open) / (high - low) else 1;
def BMP = MovingAverage(averageType2, rawBMP, length);
def BMPTrend = if BMP > 0 then 1 else 0;

# Conditions for Orders
def TradingTime = if useRTH then RTH else if !useRTH then 1 else 0;
def Close_EOD = if EODCloseAll and  SecondsTillTime(TradeTimeEnd) <= 60 then 1 else 0;
def BuyTrend = TradingTime and ExplosiveBar and trendUp and BullPowerBuy and BMPTrend  ;
def SellTrend = trendDown or BullPowerSell  or !ExplosiveBar;
def LongOrder = BuyTrend and TradeLong and RSI < 65 ;
def CloseLong = SellTrend ;
def TakeProfitSell = TakeProfit == 1;
def ShortOrder = TradingTime  and trendDown and BullPowerSell and TradeShort and ExplosiveBarShort;
def CloseShort = BuyTrend or RSIDescending or !ExplosiveBarShort;
def orderPrice = (open[-1]+close[-1])/2;


# Long Trades
AddOrder(type = OrderType.BUY_TO_OPEN,LongOrder, price =orderPrice, tradeSize = Contracts, name = "Long", tickcolor = Color.GREEN);
AddOrder(type = OrderType.SELL_TO_CLOSE, CloseLong, price = open[-1],  name = "Close");

# Special Closing Orders
AddOrder(type = OrderType.SELL_TO_CLOSE,TakeProfitSell, price = open[-1],name = "Profit");
AddOrder(type = OrderType.SELL_TO_CLOSE,Close_EOD, price = open[-1],name = "EODLong");

#Short Orders
AddOrder(type = OrderType.SELL_TO_OPEN, ShortOrder, price = orderPrice, tradeSize = Contracts, name = "Short", tickcolor = Color.GREEN);
AddOrder(type = OrderType.BUY_TO_CLOSE,CloseShort, price = open[-1], tradeSize = Contracts, name = "CloseShort");
AddOrder(type = OrderType.BUY_TO_CLOSE,Close_EOD, price = open[-1], tradeSize = Contracts, name = "EODShort");
