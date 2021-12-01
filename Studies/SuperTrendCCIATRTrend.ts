# SuperTrend CCI ATR Trend
# tomsk
# 1.17.2020
# https://usethinkscript.com/threads/supertrend-cci-atr-trend-for-thinkorswim.1090/

# V1.0 - 08.10.2019 - dtek  - Initial release of SuperTrend CCI ATR Trend
# V2.0 - 11.18.2019 - tomsk - Modified the logic, cleaned up code for consistency
# V2.1 - 01.17.2020 - tomsk - Enhanced state transition engine to only display latest trend

# SUPERTREND BY MOBIUS AND CCI ATR TREND COMBINED INTO ONE CHART INDICATOR, 
# BOTH IN AGREEMENT IS A VERY POWERFUL SIGNAL IF TRENDING. VERY GOOD AT CATCHING 
# REVERSALS. WORKS WELL ON 1 AND 5 MIN CHARTS. PLOT IS THE COMBINATION LOWEST 
# FOR UPTREND AND HIGHEST OF THE DOWNTREND. DOTS COLORED IF BOTH IN AGREEMENT 
# OR GREY IF NOT -  08/10/2019 DTEK

# Supertrend, extracted from Mobius original code

input ST_Atr_Mult = 1.0;    # was .70
input ST_nATR = 4; 
input ST_AvgType = AverageType.HULL; 

def ATR = MovingAverage(ST_AvgType, TrueRange(high, close, low), ST_nATR); 
def UP = HL2 + (ST_Atr_Mult* ATR); 
def DN = HL2 + (-ST_Atr_Mult * ATR); 
def ST = if close < ST[1] then UP else DN; 

# CCI_ATR measures distance from the mean. Calculates a trend
# line based on that distance using ATR as the locator for the line.
# Credit goes to Mobius for the underlying logic

input lengthCCI = 50;      # Was 20
input lengthATR = 21;      # Was 4
input AtrFactor = 1.0;     # Was 0.7

def bar = barNumber();
def StateUp = 1;
def StateDn = 2;
def ATRCCI = Average(TrueRange(high, close, low), lengthATR) * AtrFactor;
def price = close + low + high;
def linDev = LinDev(price, lengthCCI);
def CCI = if linDev == 0 
          then 0 
          else (price - Average(price, lengthCCI)) / linDev / 0.015;
def MT1 = if CCI > 0
          then Max(MT1[1], HL2 - ATRCCI)
          else Min(MT1[1], HL2 + ATRCCI);

# Alignment of Supertrend and CCI ATR indicators
def State = if close > ST and close > MT1 then StateUp
            else if close < ST and close < MT1 then StateDn
            else State[1];
def newState = HighestAll(if State <> State[1] then bar else 0);

# Combined Signal Approach - Supertrend and ATR CCI

plot CSA = if bar >= newState then MT1 else Double.NaN;
CSA.AssignValueColor(if bar >= newState 
                     then if State == StateUp then Color.CYAN
                          else if State == StateDn then Color.YELLOW
                          else Color.CURRENT
                     else Color.CURRENT);
# Buy/Sell Arrows
plot BuySignalArrow = if bar >= newState and State == StateUp and State[1] <> StateUp then 0.995 * MT1 else Double.NaN;
BuySignalArrow.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
BuySignalArrow.SetDefaultColor(Color.CYAN);
BuySignalArrow.SetLineWeight(5);

plot SellSignalArrow = if bar >= newState and State == StateDn and State[1] <> StateDn then 1.005 * MT1 else Double.NaN;
SellSignalArrow.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
SellSignalArrow.SetDefaultColor(Color.YELLOW);
SellSignalArrow.SetLineWeight(5);

# Candle Colors
AssignPriceColor(if bar >= newState
                 then if State == StateUp then Color.GREEN 
                      else if State == StateDn then Color.RED 
                      else Color.YELLOW
                 else Color.CURRENT);

# End SuperTrend CCI ATR Trend