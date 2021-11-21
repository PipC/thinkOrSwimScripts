def E = if IsNaN(GetActualEarnings()) then 0 else GetActualEarnings();
#def E = if IsNaN(GetEstimatedEarnings()) then 0 else GetEstimatedEarnings();
def EPS_TTM = Sum(E, 252);
def pe = close / EPS_TTM;
def SMA = Average(pe, 252);
plot pePrice = round(SMA*EPS_TTM,2);
AssignBackgroundColor(if pePrice < 0 then Color.RED else if close > pePrice then Color.DARK_RED else if close < pePrice then Color.DARK_GREEN else Color.Dark_ORANGE);