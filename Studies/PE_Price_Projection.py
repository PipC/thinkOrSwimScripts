#https://usethinkscript.com/threads/p-e-price-predictor-for-thinkorswim.4358/
declare lower;
def AE = if IsNaN(GetActualEarnings()) then 0 else GetActualEarnings();
def EPS_TTM = Sum(AE, 252);

def low52wks = Lowest(low, 252);
def high52wks = Highest(high, 252);

plot pe = round((close / EPS_TTM),2);
pe.setDefaultColor(color.cyan);
pe.SetLineWeight(2);
plot SMA = Round(Average(pe, 252),2);
SMA.setDefaultColor(color.WHITE);

plot PE50dAvg = SimpleMovingAvg(pe,50);
PE50dAvg.SetDefaultColor(color.light_gray);

plot lowPEboundary = round((low52wks / EPS_TTM),2);
lowPEboundary.setDefaultColor(Color.DARK_GREEN);
plot highPEboundary = round((high52wks / EPS_TTM),2);
highPEboundary.SetDefaultColor(Color.DARK_RED);

AddLabel(yes, "EPS TTM " + EPS_TTM + " ", color.Gray);

AddLabel(yes, "P/E Ratio: " + pe+ "   ", 
   if pe > 0 then Color.GREEN else Color.RED);

AddLabel(yes, "Avg PE " + SMA+ " ", 
    if SMA > 0 then Color.DARK_GREEN else Color.DARK_RED);

def upDownSide = round(((SMA*EPS_TTM-close)/close*100),0);

AddLabel(yes, "PE Price " + round(SMA*EPS_TTM,2)+ "   ",
    if upDownSide > 0 then Color.GREEN else Color.RED);
AddLabel(yes, (if upDownSide > 0 then "+" else "-") + upDownSide + "%", 
    if upDownSide > 0 then Color.LIGHT_GREEN else Color.LIGHT_RED);

def EE = if IsNaN(GetEstimatedEarnings()) then 0 else GetEstimatedEarnings();
plot EE_TTM = round((close / Sum(EE, 252)),2);
EE_TTM.setDefaultColor(color.ORANGE);
#plot EE_SMA = Round(Average(EE_TTM, 252),2);


