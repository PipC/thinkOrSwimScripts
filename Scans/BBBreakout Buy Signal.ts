#
# Balanced BB Breakout Indicator
# Free for use. Header credits must be included when any form of the code included in this package is used.
# User assumes all risk. Author not responsible for errors or use of tool.
# v1.2 - Assembled by Chuck Edwards
# v2.0 - Barbaros - cleanup
# v2.1 - Barbaros - added RSI IFT, NumberOfShares, BB crossing options
# v2.2 - Barbaros - fixed PnL issues and removed intraDay filter
# v2.3 - Barbaros - changed input and variable names, RSM is re-done
# v2.4 - Barbaros - removed PnL, added strategy signal arrows and alerts,
#                   added Fibonacci SuperTrend, added unified bar color selection
# v2.5 - Chuck    - added divergence and squeeze label, added squeeze alert
#        Barbaros - cleanup, changed divergance to text, show stoch labels all the time
#        Barbaros - added trend squeeze label for BB, added alerts for Stoch Scalper
#        Barbaros - added options to hide clouds and labels
#        Barbaros - changed trend and divergence colors and text to match
#        Barbaros - removed volume and keltner channel studies, unified squeeze


input ShowMarketForecastLabel = yes;
input ShowMACDBBLabel = yes;
input ShowMACDBBCloud = yes;
input ShowRSMCloud = yes;
input ShowHMALabel = yes;
input ShowSTOCHSCALPERSqueezeLabel = yes;
input ShowSTOCHSCALPERSqueezeCloud = yes;
input ShowBullBearVerticalLines = yes;

### Market Forecast

def pIntermediate = MarketForecast().Intermediate;


### MACDBB

input MACDBB_FastLength = 12;
input MACDBB_SlowLength = 26;
input MACDBB_Length = 25;
input MACDBB_BandLength = 15;
input MACDBB_NumDev = 1.0;

def MACDBB_Data = MACD(fastLength = MACDBB_FastLength, slowLength = MACDBB_SlowLength, MACDLength = MACDBB_Length);

def MACDBB_Upper = reference BollingerBands(price = MACDBB_Data, length = MACDBB_BandLength,
                                             Num_Dev_Dn = -MACDBB_NumDev, Num_Dev_Up = MACDBB_NumDev).UpperBand;

def MACDBB_Lower = reference BollingerBands(price = MACDBB_Data, length = MACDBB_BandLength,
                                             Num_Dev_Dn = -MACDBB_NumDev, Num_Dev_Up = MACDBB_NumDev).Lowerband;

def MACDBB_Midline = reference BollingerBands(price = MACDBB_Data, length = MACDBB_BandLength,
                                               Num_Dev_Dn = -MACDBB_NumDev, Num_Dev_Up = MACDBB_NumDev).MidLine;

def MACDBB_Line = MACDBB_Data;
def MACDBB_Dots = MACDBB_Data;
input MACDBB_CrossFromAboveAlert = {default "Zero", "Lower", "Middle", "Upper"};
input MACDBB_CrossFromBelowAlert = {default "Zero", "Lower", "Middle", "Upper"};

def MACDBB_CrossFromAboveVal = if MACDBB_CrossFromAboveAlert == MACDBB_CrossFromAboveAlert.Lower then MACDBB_Lower
                               else if MACDBB_CrossFromAboveAlert == MACDBB_CrossFromAboveAlert.Upper then MACDBB_Upper
                              else 0;
def MACDBB_CrossFromBelowVal = if MACDBB_CrossFromBelowAlert == MACDBB_CrossFromBelowAlert.Lower then MACDBB_Lower
                               else if MACDBB_CrossFromBelowAlert == MACDBB_CrossFromBelowAlert.Upper then MACDBB_Upper
                               else 0;

def MACDBB_Buy = MACDBB_Data > MACDBB_Upper;
def MACDBB_Sell = MACDBB_Data <= MACDBB_Lower;

### Bollinger Bands

input BB_Length = 20;
input BB_NumDevDn = -2.0;
input BB_NumDevUp = 2.0;
input BB_AverageType = AverageType.SIMPLE;

def BB_SDev = StDev(data = close, length = BB_Length);
def BB_MidLine = MovingAverage(BB_AverageType, data = close, length = BB_Length);
def BB_LowerBand = BB_MidLine + BB_NumDevDn * BB_SDev;
def BB_UpperBand = BB_MidLine + BB_NumDevUp * BB_SDev;

# BB Cloud

AddCloud(if ShowMACDBBCloud then MACDBB_Upper else MACDBB_Lower, MACDBB_Lower, Color.LIGHT_RED);

### RSI/STOCASTIC/MACD CONFLUENCE COMBO

def RSM_MACD_Diff = reference MACD("fast length" = 12, "slow length" = 26, "macd length" = 9).Diff;

def RSM_MACD_ZeroLine = 0;

def RSM_RSI = reference RSI(length = 7).RSI;

def RSM_Stoch_Val = 100 * (close - lowest(low, 14)) / (highest(high, 14) - lowest(low, 14));
def RSM_StochSlowK = SimpleMovingAvg(SimpleMovingAvg(RSM_Stoch_Val,3),3);

def RSM_rsiGreen = RSM_RSI >= 50;
def RSM_rsiRed = RSM_RSI < 50;
def RSM_stochGreen = RSM_StochSlowK >= 50;
def RSM_stochRed = RSM_StochSlowK < 50;
def RSM_macdGreen = RSM_MACD_Diff >= 0;
def RSM_macdRed = RSM_MACD_Diff < 0;
def RSM_Buy = RSM_rsiGreen and RSM_stochGreen and RSM_macdGreen;
def RSM_Sell = RSM_rsiRed and RSM_stochRed and RSM_macdRed;

### Divergance
input HMA_Length = 55;
input HMA_Lookback = 2;

def HMA = HullMovingAvg(price = HL2, length = HMA_Length);
def HMA_delta = HMA[1] - HMA[HMA_Lookback + 1];
def HMA_delta_per_bar = HMA_delta / HMA_Lookback;
def HMA_next_bar = HMA[1] + HMA_delta_per_bar;
def HMA_concavity = if HMA > HMA_next_bar then 1 else -1;
def HMA_MA_Max = if HMA[-1] < HMA and HMA > HMA[1] then HMA else Double.NaN;
def HMA_MA_Min = if HMA[-1] > HMA and HMA < HMA[1] then HMA else Double.NaN;
def HMA_divergence = HMA - HMA_next_bar;

#AddLabel(ShowHMALabel,
#        "Divergence " +
#        if HMA_concavity < 0 then
#            if HMA_divergence[1] > HMA_divergence then "Bearish (increasing)"
#            else "Bearish"
#        else
#            if HMA_divergence[1] < HMA_divergence then "Bullish (decreasing)"
#            else "Bullish",
#        if HMA_concavity < 0 then
#            if HMA_divergence[1] > HMA_divergence then Color.DARK_RED
#            else Color.RED
#        else
#            if HMA_divergence[1] < HMA_divergence then Color.DARK_GREEN
#            else Color.GREEN
#);

### Stocastic Scalper

input STOCHSCALPER_Period = 21;
input STOCHSCALPER_PeriodEMA = 13;
input STOCHSCALPER_VolumePeriod = 60;

def STOCHSCALPER_oSS = (open[1] + close[1]) / 2;
def STOCHSCALPER_hSS = Max(high, close[1]);
def STOCHSCALPER_lSS = Min(low, close[1]);
def STOCHSCALPER_cSS = (STOCHSCALPER_oSS + STOCHSCALPER_hSS + STOCHSCALPER_lSS + close) / 4;

def STOCHSCALPER_r  = Highest(STOCHSCALPER_hSS, STOCHSCALPER_Period) - Lowest(STOCHSCALPER_lSS, STOCHSCALPER_Period);
def STOCHSCALPER_p1 = (STOCHSCALPER_cSS - Lowest(STOCHSCALPER_lSS, STOCHSCALPER_Period)) / STOCHSCALPER_r;
def STOCHSCALPER_K  = ExpAverage(STOCHSCALPER_p1, STOCHSCALPER_PeriodEMA);
def STOCHSCALPER_sSS  = Highest(STOCHSCALPER_K, STOCHSCALPER_Period) - Lowest(STOCHSCALPER_K, STOCHSCALPER_Period);
def STOCHSCALPER_p3 = (STOCHSCALPER_K - Lowest(STOCHSCALPER_K, STOCHSCALPER_Period)) / STOCHSCALPER_sSS;
def STOCHSCALPER_D  = ExpAverage(STOCHSCALPER_p3, STOCHSCALPER_PeriodEMA);
def STOCHSCALPER_Min = LowestAll(STOCHSCALPER_K);
def STOCHSCALPER_Max = HighestAll(STOCHSCALPER_K);

def STOCHSCALPER_mean = Average(STOCHSCALPER_cSS, 20);
def STOCHSCALPER_sd = StDev(STOCHSCALPER_cSS, 20);
def STOCHSCALPER_atr = Average(TrueRange(STOCHSCALPER_cSS, STOCHSCALPER_hSS, STOCHSCALPER_lSS), 20);
def STOCHSCALPER_squeeze = if (STOCHSCALPER_mean + (2 * STOCHSCALPER_sd)) < (STOCHSCALPER_mean + (1.5 * STOCHSCALPER_atr)) then yes else no;
def STOCHSCALPER_squeeze_signal = !STOCHSCALPER_squeeze[1] and STOCHSCALPER_squeeze;

### Balance of Power

input BOP_EMA_Length = 20;
input BOP_TEMA_Length = 20;

def BOP_THL = If(high != low, high - low, 0.01);
def BOP_BullOpen = (high - open) / BOP_THL;
def BOP_BearOpen = (open - low) / BOP_THL;
def BOP_BullClose = (close - low) / BOP_THL;
def BOP_BearClose = (high - close) / BOP_THL;
def BOP_BullOC = If(close > open, (close - open) / BOP_THL, 0);
def BOP_BearOC = If(open > close, (open - close) / BOP_THL, 0);
def BOP_BullReward = (BOP_BullOpen + BOP_BullClose + BOP_BullOC) / 1;
def BOP_BearReward = (BOP_BearOpen + BOP_BearClose + BOP_BearOC) / 1;

def BOP_BOP = BOP_BullReward - BOP_BearReward;
def BOP_SmoothBOP = ExpAverage(BOP_BOP, BOP_EMA_Length);
def BOP_xPrice = BOP_SmoothBOP;
def BOP_xEMA1 = ExpAverage(BOP_SmoothBOP, BOP_TEMA_Length);
def BOP_xEMA2 = ExpAverage(BOP_xEMA1, BOP_TEMA_Length);
def BOP_xEMA3 = ExpAverage(BOP_xEMA2, BOP_TEMA_Length);
def BOP_nRes = 3 * BOP_xEMA1 - 3 * BOP_xEMA2 + BOP_xEMA3;

def BOP_SmootherBOP = BOP_nRes;
def BOP_s1 = BOP_SmoothBOP;
def BOP_s2 = BOP_SmootherBOP;
def BOP_s3 = BOP_SmootherBOP[2];
def BOP_Direction = if BarNumber() == 1 then 0
                    else if BOP_s2 < BOP_s3 and BOP_s2[1] > BOP_s3[1] then -1
                    else if BOP_s2 > BOP_s3 and BOP_s2[1] < BOP_s3[1] then 1
                    else BOP_Direction[1];

### RSI IFT

def RSI_IFT_R = reference RSI(5, close) - 50;
def RSI_IFT_AvgRSI = MovingAverage(AverageType.Exponential,RSI_IFT_R,9);
def RSI_IFT_InverseRSI = (Power(Double.E, 2 * RSI_IFT_AvgRSI) - 1) / (Power(Double.E, 2 * RSI_IFT_AvgRSI) + 1);
def RSI_IFT_Direction = if BarNumber() == 0 then 0
                        else if (RSI_IFT_InverseRSI[1] > 0) and (RSI_IFT_InverseRSI < 0) then -1
                        else if (RSI_IFT_InverseRSI > 0) and (RSI_IFT_InverseRSI[1] < 0) then 1
                        else RSI_IFT_Direction[1];

### Fibonacci SuperTrend

input FST_Length = 11;
input FST_Retrace = 23.6;
input FST_UseHighLow = yes;

def FST_h = if FST_UseHighLow then high else close;
def FST_l = if FST_UseHighLow then low else close;
def FST_minL = Lowest(FST_l, FST_Length);
def FST_maxH = Highest(FST_h, FST_Length);

def FST_hh = if FST_h > FST_maxH[1] then FST_h else FST_hh[1];
def FST_ll = if FST_l < FST_minL[1] then FST_l else FST_ll[1];
def FST_trend = if FST_h > FST_maxH[1] then 1 else if FST_l < FST_minL[1] then -1 else FST_trend[1];
def FST_Direction = if BarNumber() == 0 then 0
                    else if FST_trend != 1 then -1
                    else if FST_trend == 1 then 1
                    else FST_Direction[1];

### Bar Color

### Strategy

input BullBear = { "BalanceOfPower", "FibonacciSuperTrend", default "RSI_IFT" };

def BullBear_Buy = if BullBear == BullBear.BalanceOfPower then BOP_Direction == 1
                   else if BullBear == BullBear.FibonacciSuperTrend then FST_Direction == 1
                   else if BullBear == BullBear.RSI_IFT then RSI_IFT_Direction == 1
                   else no;
#def BullBear_Sell = if BullBear == BullBear.BalanceOfPower then BOP_Direction == -1
#                    else if BullBear == BullBear.FibonacciSuperTrend then FST_Direction == -1
#                    else if BullBear == BullBear.RSI_IFT then RSI_IFT_Direction == -1
#                    else no;

#AddVerticalLine(ShowBullBearVerticalLines and BullBear_Buy and !BullBear_Buy[1], close, Color.GREEN, Curve.SHORT_DASH);
#AddVerticalLine(ShowBullBearVerticalLines and BullBear_Sell and !BullBear_Sell[1], close, Color.RED, Curve.SHORT_DASH);

def Strategy_Buy = BullBear_Buy and MACDBB_Buy and RSM_Buy;
#def Strategy_Sell = BullBear_Sell and MACDBB_Sell and RSM_Sell;
def Strategy_BuySignal = Strategy_Buy and !Strategy_Buy[1];
#def Strategy_SellSignal = Strategy_Sell and !Strategy_Sell[1];

plot scan = if BullBear_Buy and !BullBear_Buy[1] then 1 else Double.NaN;

### Alerts

#Alert(Strategy_BuySignal, "Long Entry", Alert.BAR, Sound.DING);
#Alert(MACDBB_Line crosses above MACDBB_CrossFromAboveVal, "MACDBB Crossed Up", Alert.BAR, Sound.DING);
#Alert(MACDBB_Line crosses below MACDBB_CrossFromBelowVal, "MACDBB Crossed Down", Alert.BAR, Sound.DING);
#Alert(STOCHSCALPER_squeeze_signal, "Scalper Squeeze", Alert.BAR, Sound.DING);