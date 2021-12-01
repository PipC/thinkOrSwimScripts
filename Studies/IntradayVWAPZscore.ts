# Intraday VWAP Zscore
# Mobius
# 06.10.2019 Chat Room Request

declare lower;
def RTH = GetTime() >= RegularTradingStart(GetYYYYMMDD()) and
          GetTime() <= RegularTradingEnd(GetYYYYMMDD());
def n = if RTH and !RTH[1]
           then 1
           else if RTH
           then n[1] + 1
           else n[1];
def Avg = (fold i = 0 to n
           with s
           do s + getValue(close, i)) / n;
def VWAP_ = (fold ii = 0 to n
            with ss
            do ss + getValue(vwap, ii)) / n;
def StDev = Sqrt((fold iii = 0 to n
                  with sss = 0
                  do sss + Sqr(Avg - getValue(close, iii))) / n);
plot Zscore = (close - VWAP_) / StDev;
plot "0" = if isNaN(close) then double.nan else 0;
"0".SetDefaultColor(Color.white);
plot "1SD" = if isNaN(close) then double.nan else 1;
"1SD".SetDefaultColor(Color.Green);
plot "2SD" = if isNaN(close) then double.nan else 2;
"2SD".SetDefaultColor(Color.Green);
plot "-1SD" = if isNaN(close) then double.nan else -1;
"-1SD".SetDefaultColor(Color.Red);
plot "-2SD" = if isNaN(close) then double.nan else -2;
"-2SD".SetdefaultColor(Color.Red);
AddCloud(0, Zscore, color.red, color.green);
# End Code