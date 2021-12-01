# EZ Trend & Momentum
# Assembled by BenTen at useThinkScript.com
# Converted from https://www.tradingview.com/script/IzvxaVhB-ROMI2/



def s2 = MovAvgExponential(close, 13) - MovAvgExponential(close, 21);

def line = s2;
def ZeroLine = 0;

plot line2 = MovAvgExponential(close, 13) + line;
#line.AssignValueColor(if s2 <= 0 then Color.RED else Color.GREEN);
line2.AssignValueColor(if s2 <= 0 then Color.RED else Color.GREEN);
line2.setLineWeight(3);

plot ZeroLine2 = MovAvgExponential(close, 13);
ZeroLine2.setDefaultColor(Color.Gray);

AssignPriceColor(if s2 <= 0 then Color.RED else Color.GREEN);

Alert(s2 crosses above ZeroLine, "Cross above 0", Alert.BAR, Sound.Ring);
Alert(s2 crosses below ZeroLine, "Cross below 0", Alert.BAR, Sound.Bell);


AddOrder(OrderType.BUY_AUTO, s2 crosses above ZeroLine, tickcolor = GetColor(1), arrowcolor = GetColor(1), name = "LE");
AddOrder(OrderType.SELL_AUTO, s2 crosses below ZeroLine, tickcolor = GetColor(2), arrowcolor = GetColor(2), name = "SE");