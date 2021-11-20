# B3 Consolidation Box   v1
#https://usethinkscript.com/threads/b3-consolidation-box-breakout-breakdown-indicator-for-thinkorswim.103/
# -- Automates a box and shows the breakouts via price color with targets based on the box's range.
# -- In a system the gray balance line would be your stop, or you may exit on any trip back within the old box range.
# -- The color of the candles does not tell you when to be long or short, it simply tells you the last signal given.
# -- You must manage your trade targets via your own profit protection tactics.
# Intended only for the use of the person(s) to who(m) this script was originally distributed.
# User of the script assumes all risk;
# The coder and the distributers are not responsible for any loss of capital incurred upon usage of this script.
#
input BarsUsedForRange = 5;
input BarsRequiredToRemainInRange = 5;
# Identify Consolidation
def HH = highest(high[1], BarsUsedForRange);
def LL = lowest(low[1], BarsUsedForRange);
def maxH = highest(hh, BarsRequiredToRemainInRange);
def maxL = lowest(ll, BarsRequiredToRemainInRange);
def HHn = if maxH == maxH[1] or maxL == maxL then maxH else HHn[1];
def LLn = if maxH == maxH[1] or maxL == maxL then maxL else LLn[1];
def Bh = if high <= HHn and HHn == HHn[1] then HHn else double.nan;
def Bl = if low >= LLn and LLn == LLn[1] then LLn else double.nan;
def CountH = if isnan(Bh) or isnan(Bl) then 2 else CountH[1] + 1;
def CountL = if isnan(Bh) or isnan(Bl) then 2 else CountL[1] + 1;
def ExpH = if barnumber() == 1 then double.nan else
            if CountH[-BarsRequiredToRemainInRange] >= BarsRequiredToRemainInRange then HHn[-BarsRequiredToRemainInRange] else 
            if High <= ExpH[1] then ExpH[1] else double.nan;
def ExpL = if barnumber() == 1 then double.nan else
            if Countl[-BarsRequiredToRemainInRange] >= BarsRequiredToRemainInRange then LLn[-BarsRequiredToRemainInRange] else 
            if Low >= ExpL[1] then ExpL[1] else double.nan;

plot scan = if !isnan(ExpL) and !isnan(ExpH) then 1 else 0;

