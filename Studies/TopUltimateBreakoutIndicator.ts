# Top Ultimate Breakout Indicator
# tomsk
# 1.2.2020

# V1.0 - 12.08.2019 - hoojsn - Initial release of Top Ultimate Breakout Indicator (syntax errors)
# V1.1 - 12.08.2019 - tomsk  - Cleared all syntax errors from initial hoojsn release
# V1.2 - 12.31.2019 - tomsk  - Removed all extraneous logic and variables not used by the study
# V1.3 - 01.02.2020 - tomsk  - Added ShowTodayOnly input selector to display current intraday levels

# http://www.coinerpals.com/download-top-trade-tools-top-ultimate-breakout/
# https://bestforexfeatured.com/product/toptradetools-ultimate-breakout/
# https://usethinkscript.com/threads/top-ultimate-breakout-indicator-for-thinkorswim.1243/page-2

input BuyorSell = {default Buy, Sell};
input ShowTodayOnly = yes;
input BuyEntry = 3;
input SellEntry = 3;
input BuyExit = 20;
input SellExit = 20;

input ATRLength = 50;
input TargetATRMult = 1;
input DisplayLines = yes;
input PriceDigit = 2;

def today = !showTodayOnly or getDay() == getLastDay() and SecondsFromTime(0930) >= 0;

# High

def H1  = Highest(high, SellExit);
def H2  = fold i = 1 to SellExit 
          with ip = 0.0 
          do if GetValue(high, i) == H1 or GetValue(high, i) < ip 
             then ip 
             else GetValue(high, i);
def H3  = fold i1 = 1 to SellExit 
          with ip1 = 0.0 
          do if GetValue(high, i1) == H1 or GetValue(high, i1) == H2 or GetValue(high, i1) < ip1 
             then ip1 
             else GetValue(high, i1);
def HH  = (H2 + H3) / 2.0;

# Low

def L1  = Lowest(low, BuyExit);
def L2  = fold i2 = 1 to BuyExit 
          with ip2 = 10000000.0 
          do if GetValue(low, i2) == L1 or GetValue(low, i2) > ip2 
             then ip2 
             else GetValue(low, i2);
def L3  = Lowest(if low == L1 or low == L2 then 1000000 else low, BuyExit);
def LL  = (L2 + L2) / 2.0;

def QB = Highest(high, BuyEntry);
def QS = Lowest(low, SellEntry);

def ATRVal = ATR(length = ATRLength, averageType= AverageType.SIMPLE);
def mATR = Highest(ATRVal, ATRLength);

plot entry;
plot exit;

def EntryPr;
def pos;
def co = BarNumber() > Max(SellExit, BuyExit);

switch (BuyorSell) {

case Buy:
    entry = QB[1];
    exit = LL[1];
    pos = if co and high > QB[1] then 1 else if low < LL[1] then 0 else pos[1];
    EntryPr = if high > QB[1] and pos == 1 and pos[1] < 1 
              then QB[1] 
              else if pos == 0 
                  then Double.NaN 
              else EntryPr[1];
case Sell:
    entry = QS[1];
    exit = HH[1];
    pos = if co and low < QS[1] then -1 else if high[1] > HH[2] then 0 else pos[1];
    EntryPr = if low < QS[1] and pos == -1 and pos[1] > -1 
              then QS[1] 
              else if pos == 0 
                  then Double.NaN 
              else EntryPr[1];
}
entry.AssignValueColor(if BuyorSell == BuyorSell.Buy then Color.GREEN 
                       else if BuyorSell == BuyorSell.Sell then Color.RED 
                       else Color.CURRENT);
entry.SetLineWeight(2);
exit.SetDefaultColor(Color.CYAN);
exit.SetLineWeight(2);

def BTarget;
def BTarget2;
def EntryLine;
def TradeRisk;

switch (BuyorSell) {

case Buy:
    BTarget  = if pos == 1 and pos[1] < 1 
                   then (EntryPr + (TargetATRMult * 2 * mATR)) 
               else if pos == 1 
                   then BTarget[1] 
               else Double.NaN;
    BTarget2 = if pos == 1 and pos[1] < 1 
                   then (EntryPr + 2 * (TargetATRMult * 2 * mATR)) 
               else if pos == 1 
                   then BTarget2[1] 
               else Double.NaN;
    EntryLine = if LL < EntryPr then EntryPr else Double.NaN;
    TradeRisk = (EntryPr - LL) / mATR;

case Sell:
    BTarget  = if pos == -1 and pos[1] > -1 
                   then (EntryPr - (TargetATRMult * 2 * mATR)) 
               else if pos == -1 
                   then BTarget[1] 
               else Double.NaN;
    BTarget2 = if pos == -1 and pos[1] > -1 
                   then (EntryPr - 2 * (TargetATRMult * 2 * mATR)) 
               else if pos == -1 
                   then BTarget2[1] 
               else Double.NaN;
    EntryLine = if HH > EntryPr then EntryPr else Double.NaN;
    TradeRisk = (HH - EntryPr ) / mATR;
}

plot pBTarget = if today and DisplayLines and co then BTarget else Double.NaN;
pBTarget.SetDefaultColor(Color.YELLOW);

plot pBTarget2 = if today and DisplayLines and co then BTarget2 else Double.NaN;
pBTarget2.SetDefaultColor(Color.MAGENTA);

plot pEntryLine = if today and DisplayLines and co then EntryLine else Double.NaN;
pEntryLine.SetDefaultColor(Color.WHITE);

def valco = DisplayLines and co and (pos == 1 or pos == -1) and pos[1] == 0;
def rBTarget = Round(BTarget, PriceDigit);
def rBTarget2 = Round(BTarget2, PriceDigit);
def rEntryPr = Round(EntryPr, PriceDigit);

AddChartBubble(today and valco, BTarget, rBTarget, Color.YELLOW);
AddChartBubble(today and valco, BTarget2, rBTarget2, Color.MAGENTA);
AddChartBubble(today and valco, EntryPr, rEntryPr, Color.WHITE);

def exv=if BuyorSell == BuyorSell.Buy then LL else HH;
def rexv = Round(exv, PriceDigit);
def rTradeRisk = Round(TradeRisk, PriceDigit);

AddChartBubble(today and valco, exv, rexv + "(" + rTradeRisk + "ATR)", Color.CYAN);
# End Top Ultimate Breakout Indicator