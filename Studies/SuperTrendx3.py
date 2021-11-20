input ShowBubbles = no;
input PaintBars = no;
input BuySellSpotSize = 2;

input AvgType = AverageType.HULL;

input AtrMult_1 = 1.00;
input nATR_1 = 10;
input AtrMult_2 = 2.00;
input nATR_2 = 11;
input AtrMult_3 = 3.00;
input nATR_3 = 12;


def ATR_1 = ATR("length" = nATR_1, "average type" = AvgType);
def ATR_2 = ATR("length" = nATR_2, "average type" = AvgType);
def ATR_3 = ATR("length" = nATR_3, "average type" = AvgType);

def UP_Band_Basic_1 = HL2 + (AtrMult_1 * ATR_1);
def UP_Band_Basic_2 = HL2 + (AtrMult_2 * ATR_2);
def UP_Band_Basic_3 = HL2 + (AtrMult_3 * ATR_3);

def LW_Band_Basic_1 = HL2 + (-AtrMult_1 * ATR_1);
def LW_Band_Basic_2 = HL2 + (-AtrMult_2 * ATR_2);
def LW_Band_Basic_3 = HL2 + (-AtrMult_3 * ATR_3);

def UP_Band_1 = if ((UP_Band_Basic_1 < UP_Band_1[1]) or (close[1] > UP_Band_1[1])) then UP_Band_Basic_1 else UP_Band_1[1];
def UP_Band_2 = if ((UP_Band_Basic_2 < UP_Band_2[1]) or (close[1] > UP_Band_2[1])) then UP_Band_Basic_2 else UP_Band_2[1];
def UP_Band_3 = if ((UP_Band_Basic_3 < UP_Band_3[1]) or (close[1] > UP_Band_3[1])) then UP_Band_Basic_3 else UP_Band_3[1];

def LW_Band_1 = if ((LW_Band_Basic_1 > LW_Band_1[1]) or (close[1] < LW_Band_1[1])) then LW_Band_Basic_1 else LW_Band_1[1];
def LW_Band_2 = if ((LW_Band_Basic_2 > LW_Band_2[1]) or (close[1] < LW_Band_2[1])) then LW_Band_Basic_2 else LW_Band_2[1];
def LW_Band_3 = if ((LW_Band_Basic_3 > LW_Band_3[1]) or (close[1] < LW_Band_3[1])) then LW_Band_Basic_3 else LW_Band_3[1];

def ST_1 = if ((ST_1[1] == UP_Band_1[1]) and (close < UP_Band_1)) then UP_Band_1
      else if ((ST_1[1] == UP_Band_1[1]) and (close > Up_Band_1)) then LW_Band_1
      else if ((ST_1[1] == LW_Band_1[1]) and (close > LW_Band_1)) then LW_Band_1
      else if ((ST_1[1] == LW_Band_1)    and (close < LW_Band_1)) then UP_Band_1
      else LW_Band_1;

def ST_2 = if ((ST_2[1] == UP_Band_2[1]) and (close < UP_Band_2)) then UP_Band_2
      else if ((ST_2[1] == UP_Band_2[1]) and (close > Up_Band_2)) then LW_Band_2
      else if ((ST_2[1] == LW_Band_2[1]) and (close > LW_Band_2)) then LW_Band_2
      else if ((ST_2[1] == LW_Band_2)    and (close < LW_Band_2)) then UP_Band_2
      else LW_Band_2;

def ST_3 = if ((ST_3[1] == UP_Band_3[1]) and (close < UP_Band_3)) then UP_Band_3
      else if ((ST_3[1] == UP_Band_3[1]) and (close > Up_Band_3)) then LW_Band_3
      else if ((ST_3[1] == LW_Band_3[1]) and (close > LW_Band_3)) then LW_Band_3
      else if ((ST_3[1] == LW_Band_3)    and (close < LW_Band_3)) then UP_Band_3
      else LW_Band_3;

plot Long_1 = if close > ST_1 then ST_1 else Double.NaN;
plot Long_2 = if close > ST_2 then ST_2 else Double.NaN;
plot Long_3 = if close > ST_3 then ST_3 else Double.NaN;

Long_1.setDefaultColor(CreateColor(0,50,0));
Long_2.setDefaultColor(CreateColor(0,100,0));
Long_3.setDefaultColor(CreateColor(0,150,0));

plot Short_1 = if close < ST_1 then ST_1 else Double.NaN;
plot Short_2 = if close < ST_2 then ST_2 else Double.NaN;
plot Short_3 = if close < ST_3 then ST_3 else Double.NaN;

Short_1.setDefaultColor(CreateColor(50,0,0));
Short_2.setDefaultColor(CreateColor(100,0,0));
Short_3.setDefaultColor(CreateColor(150,0,0));

def LongTrigger_1 = isNaN(Long_1[1])   and !isNaN( Long_1);
def LongTrigger_2 = isNaN(Long_2[1])   and !isNaN( Long_2);
def LongTrigger_3 = isNaN(Long_3[1])   and !isNaN( Long_3);

def ShortTrigger_1 = isNaN(Short_1[1]) and !isNaN(Short_1);
def ShortTrigger_2 = isNaN(Short_2[1]) and !isNaN(Short_2);
def ShortTrigger_3 = isNaN(Short_3[1]) and !isNaN(Short_3);

def LongTrigger  = if Long_1  and  Long_2 and  Long_3 and ( LongTrigger_1 or  LongTrigger_2 or  LongTrigger_3) then yes else no;
def ShortTrigger = if Short_1 and Short_2 and Short_3 and (ShortTrigger_1 or ShortTrigger_2 or ShortTrigger_3) then yes else no;

def ST_L = 
if LongTrigger_1  then ST_1 else 
if LongTrigger_2  then ST_2 else 
if LongTrigger_3  then ST_3 else Double.NaN;

def ST_S = 
if ShortTrigger_1 then ST_1 else 
if ShortTrigger_2 then ST_2 else 
if ShortTrigger_3 then ST_3 else Double.NaN;

plot LongDot_1 = if LongTrigger then ST_1 else Double.NaN;
LongDot_1.SetPaintingStrategy(PaintingStrategy.POINTS);
LongDot_1.AssignValueColor(Color.GREEN);
LongDot_1.SetLineWeight(BuySellSpotSize);

plot LongDot_2 = if LongTrigger then ST_2 else Double.NaN;
LongDot_2.SetPaintingStrategy(PaintingStrategy.POINTS);
LongDot_2.AssignValueColor(Color.GREEN);
LongDot_2.SetLineWeight(BuySellSpotSize);

plot LongDot_3 = if LongTrigger then ST_3 else Double.NaN;
LongDot_3.SetPaintingStrategy(PaintingStrategy.POINTS);
LongDot_3.AssignValueColor(Color.GREEN);
LongDot_3.SetLineWeight(BuySellSpotSize);

plot ShortDot_1 = if ShortTrigger then ST_1 else Double.NaN;
ShortDot_1.SetPaintingStrategy(PaintingStrategy.POINTS);
ShortDot_1.AssignValueColor(Color.RED);
ShortDot_1.SetLineWeight(BuySellSpotSize);

plot ShortDot_2 = if ShortTrigger then ST_2 else Double.NaN;
ShortDot_2.SetPaintingStrategy(PaintingStrategy.POINTS);
ShortDot_2.AssignValueColor(Color.RED);
ShortDot_2.SetLineWeight(BuySellSpotSize);

plot ShortDot_3 = if ShortTrigger then ST_3 else Double.NaN;
ShortDot_3.SetPaintingStrategy(PaintingStrategy.POINTS);
ShortDot_3.AssignValueColor(Color.RED);
ShortDot_3.SetLineWeight(BuySellSpotSize);


AddChartBubble(ShowBubbles and LongTrigger , ST_L, "BUY" , Color.GREEN, no);
AddChartBubble(ShowBubbles and ShortTrigger, ST_S, "SELL", Color.RED, yes);

AssignPriceColor(if PaintBars and close < ST_S
               then Color.RED
               else if PaintBars and close > ST_L
                    then Color.GREEN
                    else Color.CURRENT);

Alert(LongTrigger ,  "SuperTrendx3 Long", Alert.BAR, Sound.Ding);
Alert(ShortTrigger, "SuperTrendx3 Short", Alert.BAR, Sound.Ding);
