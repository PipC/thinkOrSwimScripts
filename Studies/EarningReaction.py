# Script displays earnings and securities reaction to the announcement
#Developed and Coded By Eric Rasmussen
# ericrasmussentx@gmail.com

# Finding the Earnings Dates
def isBefore = HasEarnings(EarningTime.BEFORE_MARKET);
def isAfter = HasEarnings(EarningTime.AFTER_MARKET);

# Earnings Move Up or Down
def afterCalc = AbsValue(Round(close[-1] - close));
def beforeCalc = AbsValue(Round(close - close[1]));

def afterAbs = if isAfter then Round(AbsValue(((close[-1] - close) / close) * 100)) else 0;
def beforeAbs =  if isBefore then Round(AbsValue(((close - close[1]) / close) * 100)) else 0;

def earningsPrice = if isAfter then afterCalc else if isBefore then beforeCalc else 0;

# Price Percent Calculations
def afterPercent = if isAfter then Round(((close[-1] - close) / close) * 100) else 0;
def beforePercent = if isBefore then Round(((close - close[1]) / close) * 100) else 0;

def earningsPercent = if isAfter then afterPercent else if isBefore then beforePercent else 0;

def absPercent = if isAfter then afterAbs else if isBefore then beforeAbs else 0;

# Records Number of Earnings Periods
def aMove = if HasEarnings(EarningTime.AFTER_MARKET) then TotalSum(earningsPrice) else aMove[1];

def bMove = if HasEarnings(EarningTime.BEFORE_MARKET) then TotalSum(earningsPrice) else bMove[1];

def earningsPeriods = if HasEarnings() then 1 else 0;

# Average Earnings Move calculation
def periodSum = Sum(earningsPeriods, length = 252);
def Sum = Sum(earningsPrice, length = 252);
def averageMove = Sum / periodSum;
def percentSum = Sum(absPercent, length = 252);
def percentAvg = percentSum / periodSum;
def avgMove = if !IsNaN(averageMove) then averageMove else avgMove[1];
def percentAvgMove = if !IsNaN(averageMove) then percentAvg else percentAvgMove[1];

# Actual Earnings and Estimates Info
def AECont = if HasEarnings() then GetActualEarnings() else AECont[1];
def EECont = if HasEarnings() then GetEstimatedEarnings() else EECont[1];

def actualEarnings = if !IsNaN(AECont) then AECont else actualEarnings[1];
def estimatedEarnings = if !IsNaN(EECont) then EECont else estimatedEarnings[1];

def EarningsBeat =  !IsNaN(GetActualEarnings()) and HasEarnings() and actualEarnings > estimatedEarnings;
def EarningsMiss =  !IsNaN(GetActualEarnings()) and HasEarnings() and actualEarnings < estimatedEarnings;

# Earnings Move Calculations
def aCalc =  Round(close[-1] - close);
def bCalc = Round(close - close[1]);

def ePrice = if isAfter then aCalc else if isBefore then bCalc else ePrice[1];

def earningsNaN = if HasEarnings() and IsNaN(GetEstimatedEarnings()) then 1 else earningsNaN[1];
def earningsSum = TotalSum(HasEarnings()) - earningsNaN;
def earningsMove =  if HasEarnings() then ePrice else earningsMove[1];

def uM = HasEarnings() and earningsMove > 0;
def dM = HasEarnings() and earningsMove < 0;

def beatRatio =  Round((TotalSum(EarningsBeat) / earningsSum) * 100);

# Look And Feel
 
# Average Move Label (Percentage)
input percentLabel = yes;
AddLabel(percentLabel, Concat(Concat("Average Earnings Move: ", Round(percentAvgMove, 2)), "%"), if earningsPrice[1] > avgMove[1] then Color.MAGENTA else Color.LIME);

# Percentage of Earnings Beats Label
input beatRatioLabel = yes;
AddLabel(beatRatioLabel, Concat(Concat("Earnings Beats: ", beatRatio), "%"), color = if beatRatio >= 80 then Color.GREEN else Color.RED);

# Bubbles Showing Percent Moves After Earnings
input percentBubbles = yes;

AddChartBubble("price location" = high, text = Concat(earningsPercent, "%"), "time condition" =  if percentBubbles == yes then earningsPercent else 0, color = if isAfter and close[-1] > close then Color.MAGENTA else if isAfter and close[-1] < close then Color.LIME else if isBefore and close > close[1] then Color.MAGENTA else if isBefore and close < close[1] then Color.LIME else Color.BLACK);

# Date Line for Earnings

input text = no;

AddVerticalLine(HasEarnings() and EarningsBeat and uM, color = Color.CYAN, stroke = Curve.FIRM, text = if text == yes then concat(if isBefore then "(Before) " else "(After) ", concat("$", concat(EECont, concat(" Actual",concat("  $", concat(AECont, " Estimated")))))) else "");

AddVerticalLine(HasEarnings() and EarningsBeat and dM, color = Color.MAGENTA, stroke = Curve.FIRM, text = if text == yes then concat(if isBefore then "(Before) " else "(After) ", concat("$", concat(EECont, concat(" Actual",concat("  $", concat(AECont, " Estimated")))))) else "");

AddVerticalLine(HasEarnings() and EarningsMiss and uM, color = Color.LIME, stroke = Curve.FIRM, text = if text == yes then concat(if isBefore then "(Before) " else "(After) ", concat("$", concat(EECont, concat(" Actual",concat("  $", concat(AECont, " Estimated")))))) else "");

AddVerticalLine(HasEarnings() and EarningsMiss and dM, color = Color.RED, stroke = Curve.FIRM, text = if text == yes then concat(if isBefore then "(Before) " else "(After) ", concat("$", concat(EECont, concat(" Actual",concat("  $", concat(AECont, " Estimated")))))) else "");