# SUPERTREND BY MOBIUS AND CCI ATR TREND COMBINED INTO ONE CHART INDICATOR, BOTH IN AGREEMENT IS A VERY POWERFUL SIGNAL IF TRENDING. VERY GOOD AT CATCHING REVERSALS. WORKS WELL ON 1 AND 5 MIN CHARTS. PLOT IS THE COMBINATION LOWEST FOR UPTREND AND HIGHEST OF THE DOWNTREND. DOTS COLORED IF BOTH IN AGREEMENT OR GREY IF NOT -  08/10/19 DTEK




def c = close;
def h = high;
def l = low;
def pricedata = hl2;


#SUPERTREND
input ST_Atr_Mult = 1.0;
input ST_Length = 4;
input ST_AvgType = AverageType.HULL;


def ATR = MovingAverage(ST_AvgType, TrueRange(high, close, low), ST_Length);
def UP = HL2 + (ST_Atr_Mult * ATR);
def DN = HL2 + (-ST_Atr_Mult * ATR);
def ST = if close < ST[1] then UP else DN;


def SuperTrend = ST;




#CCI_ATR
input lengthCCI = 50;
input lengthATR = 21;
input AtrFactor = 1.0;


def ATRcci = Average(TrueRange(h, c, l), lengthATR) * AtrFactor;
def price = c + l + h;
def linDev = LinDev(price, lengthCCI);
def CCI = if linDev == 0
          then 0
          else (price - Average(price, lengthCCI)) / linDev / 0.015;


def MT1 = if CCI > 0
          then Max(MT1[1], pricedata - ATRcci)
          else Min(MT1[1], pricedata + ATRcci);
def CCI_ATR_TREND = MT1;


plot ST_ATR_COMBO = if c > ST and c > CCI_ATR_TREND then Min(CCI_ATR_TREND, ST) else if c < ST and c < CCI_ATR_TREND then Max(CCI_ATR_TREND, ST) else CCI_ATR_TREND;


ST_ATR_COMBO.SetLineWeight(1);


ST_ATR_COMBO.AssignValueColor(if c < MT1 and c < ST then Color.MAGENTA else if c > MT1 and c > ST then Color.CYAN else Color.WHITE);
ST_ATR_COMBO.SetPaintingStrategy(PaintingStrategy.LINE_VS_POINTS);


def signal1 = c < MT1 and c < ST;




def signal2 = c > MT1 and c > ST;






AssignPriceColor(if signal1 then Color.MAGENTA else if Signal2 then Color.CYAN else Color.WHITE);