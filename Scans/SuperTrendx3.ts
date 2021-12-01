input ShowBubbles = no;
input PaintBars = no;

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

def Long_1 = if close > ST_1 then ST_1 else Double.NaN;
def Long_2 = if close > ST_2 then ST_2 else Double.NaN;
def Long_3 = if close > ST_3 then ST_3 else Double.NaN;


def Short_1 = if close < ST_1 then ST_1 else Double.NaN;
def Short_2 = if close < ST_2 then ST_2 else Double.NaN;
def Short_3 = if close < ST_3 then ST_3 else Double.NaN;

def LongTrigger_1 = isNaN(Long_1[1])   and !isNaN( Long_1);
def LongTrigger_2 = isNaN(Long_2[1])   and !isNaN( Long_2);
def LongTrigger_3 = isNaN(Long_3[1])   and !isNaN( Long_3);

def ShortTrigger_1 = isNaN(Short_1[1]) and !isNaN(Short_1);
def ShortTrigger_2 = isNaN(Short_2[1]) and !isNaN(Short_2);
def ShortTrigger_3 = isNaN(Short_3[1]) and !isNaN(Short_3);

def LongTrigger  = if Long_1  and  Long_2 and  Long_3 and ( LongTrigger_1 or  LongTrigger_2 or  LongTrigger_3) then yes else no;
def ShortTrigger = if Short_1 and Short_2 and Short_3 and (ShortTrigger_1 or ShortTrigger_2 or ShortTrigger_3) then yes else no;


#AddChartBubble(ShowBubbles and LongTrigger , ST_L, "BUY" , Color.GREEN, no);
#AddChartBubble(ShowBubbles and ShortTrigger, ST_S, "SELL", Color.RED, yes);


#Alert(LongTrigger ,  "Long", Alert.BAR, Sound.Ding);
#Alert(ShortTrigger, "Short", Alert.BAR, Sound.Ding);

plot scan = (LongTrigger or LongTrigger[1])
and (Short_1[2] or Short_2[2] or Short_3[2] or Short_1[3] or Short_2[3] or Short_3[3]);