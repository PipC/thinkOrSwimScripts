# SuperTrend Yahoo Finance Replica - Modified from Modius SuperTrend
# Modified Modius ver. by RConner7
# Modified by Barbaros to replicate look from TradingView version
# v3.0

input AtrMult = 3.00;
input nATR = 6;
input AvgType = AverageType.HULL;
input PaintBars = no;
input ShowBubbles = no;

def ATR = ATR("length" = nATR, "average type" = AvgType);
def UP_Band_Basic = HL2 + (AtrMult * ATR);
def LW_Band_Basic = HL2 + (-AtrMult * ATR);
def UP_Band = if ((UP_Band_Basic < UP_Band[1]) or (close[1] > UP_Band[1])) then UP_Band_Basic else UP_Band[1];
def LW_Band = if ((LW_Band_Basic > LW_Band[1]) or (close[1] < LW_Band[1])) then LW_Band_Basic else LW_Band[1];

def ST = if ((ST[1] == UP_Band[1]) and (close < UP_Band)) then UP_Band
else if ((ST[1] == UP_Band[1]) and (close > Up_Band)) then LW_Band
else if ((ST[1] == LW_Band[1]) and (close > LW_Band)) then LW_Band
else if ((ST[1] == LW_Band) and (close < LW_Band)) then UP_Band
else LW_Band;

plot Long = if close > ST then ST else Double.NaN;
Long.AssignValueColor(Color.GREEN);
Long.SetLineWeight(1);

plot Short = if close < ST then ST else Double.NaN;
Short.AssignValueColor(Color.RED);
Short.SetLineWeight(1);

def LongTrigger = isNaN(Long[1]) and !isNaN(Long);
def ShortTrigger = isNaN(Short[1]) and !isNaN(Short);

plot LongDot = if LongTrigger then ST else Double.NaN;
LongDot.SetPaintingStrategy(PaintingStrategy.POINTS);
LongDot.AssignValueColor(Color.GREEN);
LongDot.SetLineWeight(1);

plot ShortDot = if ShortTrigger then ST else Double.NaN;
ShortDot.SetPaintingStrategy(PaintingStrategy.POINTS);
ShortDot.AssignValueColor(Color.RED);
ShortDot.SetLineWeight(1);

AddChartBubble(ShowBubbles and LongTrigger, ST, "BUY", Color.GREEN, no);
AddChartBubble(ShowBubbles and ShortTrigger, ST, "SELL", Color.RED, yes);

AssignPriceColor(if PaintBars and close < ST
               then Color.RED
               else if PaintBars and close > ST
                    then Color.GREEN
                    else Color.CURRENT);

Alert(LongTrigger, "Long", Alert.BAR, Sound.Ding);
Alert(ShortTrigger, "Short", Alert.BAR, Sound.Ding);

# End Code SuperTrend Yahoo Finance Replica

