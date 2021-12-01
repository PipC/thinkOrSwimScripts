#TOS Indicators
#Home of the Volatility Box
#More info regarding this indicator here: tosindicators.com/indicators/market-pulse
#Code written in 2019 
#Full Youtube Tutorial here: https://youtu.be/Hku6dLR-m_A

input ChartBubblesOn = no;

input price = close;
input length = 10;

def tmp1 = if price > price[1] then price - price[1] else 0;
def tmp2 = if price[1] > price then price[1] - price else 0;
def d2 = sum(tmp1, length);
def d4 = sum(tmp2, length);
def cond = d2 + d4 == 0;
def ad3 = if cond then 0 else (d2 - d4) / (d2 + d4) * 100;
def coeff = 2 / (length + 1) * AbsValue(ad3) / 100;
def asd = compoundValue("visible data" = coeff * price + (if IsNaN(asd[1]) then 0 else asd[1]) * (1 - coeff), "historical data" = price
);
def VMA = asd;

def vwma8 = sum(volume * close, 8) / sum(volume, 8);
def vwma21 = sum(volume * close, 21) / sum(volume, 21);
def vwma34 = sum(volume * close, 34) / sum(volume, 34);

def bullish = if vwma8 > vwma21 and vwma21 > vwma34 then 1 else 0;
def bearish = if vwma8 < vwma21 and vwma21 < vwma34 then 1 else 0;
def distribution = if !bullish and !bearish then 1 else 0;

plot bullishAccumulationScan = if bullish then 1 else if bearish then 0 else if close>=VMA then 1 else 0;

# AddLabel(yes, if bullish then "Stage: Acceleration" else if bearish then "Stage: Deceleration" else if close>=VMA then "Stage: Accumulation" else "Stage: Distribution", if bullish then color.green else if bearish then color.red else if close >=VMA then color.yellow else color.orange);

# VMA.AssignValueColor(if bearish and close<= VMA then color.red 
# else if bullish and close >= VMA then color.green
# else color.gray);

#def accumulationToAcceleration = if (bullish and close>=VMA) then 1 else 0;
#AddChartBubble(ChartBubblesOn and accumulationToAcceleration and !accumulationToAcceleration[1], #close, "Entering Acceleration", color.green);

#def distributionToDeceleration = if (bearish and close <= VMA) then 1 else 0;
#AddChartBubble(ChartBubblesOn and distributionToDeceleration and !distributionToDeceleration[1], #close, "Entering Deceleration", color.red);
