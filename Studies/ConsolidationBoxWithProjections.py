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
declare upper;
input BarsUsedForRange = 5;
input BarsRequiredToRemainInRange = 9;
input TargetMultiple = 0.5;
input ColorPrice = yes;
input HideTargets = yes;
input HideBalance = no;
input HideBoxLines = no;
input HideCloud = no;
input HideLabels = no;
#
input fibRatio1 = 1;
input fibRatio2 = 2;
input fibRatio3 = 3;
input fibRatio4 = 4;
input fibRatio5 = 5;
input fibRatio6 = 6;
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
# Plot the High and Low of the Box; Paint Cloud
plot BoxHigh = if !isnan(expL) and !isnan(ExpH) then ExpH else double.nan;
plot BoxLow = if !isnan(expL) and !isnan(ExpH) then ExpL else double.nan;
boxhigh.setdefaultColor(color.dark_green);
BoxHigh.setpaintingStrategy(paintingStrategy.HORIZONTAL);
BoxLow.setpaintingStrategy(paintingStrategy.HORIZONTAL);
BoxLow.setdefaultColor(color.dark_red);
BoxHigh.SETHIDING(HideBoxLines);
BoxLow.SETHIDING(HideBoxLines);
addcloud(if !HideCloud then BoxHigh else double.nan, BoxLow, color.dark_gray, color.dark_gray);
# Things to the Right of a Finished Box
def eH = if barnumber() == 1 then double.nan else if !isnan(BoxHigh[1]) and isnan(BoxHigh) then BoxHigh[1] else eh[1];
def eL = if barnumber() == 1 then double.nan else if !isnan(BoxLow[1]) and isnan(BoxLow) then BoxLow[1] else el[1];
def diff = (eh - el) * TargetMultiple;
plot Balance = if isnan(boxhigh) and isnan(boxlow) then (eh+el)/2 else double.nan;
plot Htgt_1 = if isnan(Boxhigh) and high >= eh then eh + diff*fibRatio1 else double.nan;
plot Htgt_2 = if isnan(Boxhigh) and high >= eh then eh + diff*fibRatio2 else double.nan;
plot Htgt_3 = if isnan(Boxhigh) and high >= eh then eh + diff*fibRatio3 else double.nan;
plot Htgt_4 = if isnan(Boxhigh) and high >= eh then eh + diff*fibRatio4 else double.nan;
plot Htgt_5 = if isnan(Boxhigh) and high >= eh then eh + diff*fibRatio5 else double.nan;
plot Htgt_6 = if isnan(Boxhigh) and high >= eh then eh + diff*fibRatio6 else double.nan;
plot Ltgt_1 = if isnan(BoxLow)  and Low  <= eL then eL - diff*fibRatio1 else double.nan;
plot Ltgt_2 = if isnan(BoxLow)  and Low  <= eL then eL - diff*fibRatio2 else double.nan;
plot Ltgt_3 = if isnan(BoxLow)  and Low  <= eL then eL - diff*fibRatio3 else double.nan;
plot Ltgt_4 = if isnan(BoxLow)  and Low  <= eL then eL - diff*fibRatio4 else double.nan;
plot Ltgt_5 = if isnan(BoxLow)  and Low  <= eL then eL - diff*fibRatio5 else double.nan;
plot Ltgt_6 = if isnan(BoxLow)  and Low  <= eL then eL - diff*fibRatio6 else double.nan;
Balance.SETHIDING(HideBalance);
Balance.setdefaultColor(CREATECOLOR( 80, 80 , 80));
Balance.setpaintingStrategy(PAIntingStrategy.SQUARES);
Htgt_2.setlineWeight(1);
Htgt_4.setlineWeight(1);
Htgt_6.setlineWeight(1);
Htgt_1.setdefaultColor(CREATECOLOR( 0,  210 , 170));
Htgt_1.setpaintingStrategy(PAIntingStrategy.DASHES);
Htgt_2.setdefaultColor(CREATECOLOR( 50, 190 , 150));
Htgt_2.setpaintingStrategy(paintingStrategy.HORIZONTAL);
Htgt_3.setdefaultColor(CREATECOLOR( 100, 170 , 130));
Htgt_3.setpaintingStrategy(PAIntingStrategy.DASHES);
Htgt_4.setdefaultColor(CREATECOLOR( 150, 150 , 110));
Htgt_4.setpaintingStrategy(paintingStrategy.HORIZONTAL);
Htgt_5.setdefaultColor(CREATECOLOR( 200, 130 , 90));
Htgt_5.setpaintingStrategy(PAIntingStrategy.DASHES);
Htgt_6.setdefaultColor(CREATECOLOR( 250, 110 , 70));
Htgt_6.setpaintingStrategy(paintingStrategy.HORIZONTAL);
Ltgt_2.setlineWeight(1);
Ltgt_4.setlineWeight(1);
Ltgt_6.setlineWeight(1);
Ltgt_1.setdefaultColor(CREATECOLOR( 0,  210 , 170));
Ltgt_1.setpaintingStrategy(PAIntingStrategy.DASHES);
Ltgt_2.setdefaultColor(CREATECOLOR( 50, 190 , 150));
Ltgt_2.setpaintingStrategy(paintingStrategy.HORIZONTAL);
Ltgt_3.setdefaultColor(CREATECOLOR( 100, 170 , 130));
Ltgt_3.setpaintingStrategy(PAIntingStrategy.DASHES);
Ltgt_4.setdefaultColor(CREATECOLOR( 150, 150 , 110));
Ltgt_4.setpaintingStrategy(paintingStrategy.HORIZONTAL);
Ltgt_5.setdefaultColor(CREATECOLOR( 200, 130 , 90));
Ltgt_5.setpaintingStrategy(PAIntingStrategy.DASHES);
Ltgt_6.setdefaultColor(CREATECOLOR( 250, 110 , 70));
Ltgt_6.setpaintingStrategy(paintingStrategy.HORIZONTAL);
Htgt_1.SETHIDING(HIDETARGETS);
Htgt_2.SETHIDING(HIDETARGETS);
Htgt_3.SETHIDING(HIDETARGETS);
Htgt_4.SETHIDING(HIDETARGETS);
Htgt_5.SETHIDING(HIDETARGETS);
Htgt_6.SETHIDING(HIDETARGETS);
Ltgt_1.SETHIDING(HIDETARGETS);
Ltgt_2.SETHIDING(HIDETARGETS);
Ltgt_3.SETHIDING(HIDETARGETS);
Ltgt_4.SETHIDING(HIDETARGETS);
Ltgt_5.SETHIDING(HIDETARGETS);
Ltgt_6.SETHIDING(HIDETARGETS);
Htgt_1.HideTitle();
Htgt_2.HideTitle();
Htgt_3.HideTitle();
Htgt_4.HideTitle();
Htgt_5.HideTitle();
Htgt_6.HideTitle();
Ltgt_1.HideTitle();
Ltgt_2.HideTitle();
Ltgt_3.HideTitle();
Ltgt_4.HideTitle();
Ltgt_5.HideTitle();
Ltgt_6.HideTitle();
Htgt_1.HideBubble();
Htgt_2.HideBubble();
Htgt_3.HideBubble();
Htgt_4.HideBubble();
Htgt_5.HideBubble();
Htgt_6.HideBubble();
Ltgt_1.HideBubble();
Ltgt_2.HideBubble();
Ltgt_3.HideBubble();
Ltgt_4.HideBubble();
Ltgt_5.HideBubble();
Ltgt_6.HideBubble();
# Labels
addlabel(!HideLabels, "TgtLvls = " + diff + "pts each | Bal = " + balance, if high > eh  and low < el then color.yellow else if high > eh then color.green else if low < el then color.red else color.gray);
addlabel(!HideLabels && high > eh && low < el, "Outside BAR!!", color.yellow);
addlabel(!HideLabels && high > eh && low >= el, "Long", color.green);
addlabel(!HideLabels && high <= eh && low < el, "Short", color.red);
#Price Color
assignPriceColor(if !ColorPrice then color.current else if !isnan(BoxHigh) then color.gray else
                    if high > eh  and low < el then color.yellow else 
                    if high > eh then color.green else if low < el then color.red else color.gray);

