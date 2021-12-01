# This is a conversion of the NinjaTrader VPA indicator.  ToS does not support directional
# triangles and diamonds, so there are some differences.  The triangles are left as is, just
# not pointing a specific direction.  The diamonds have been replaced with circles.

# Red Square           - UpThrust bar.
# Blue Diamond         - Reversal possible, yesterday was high volume wide spread up bar, but 
#                        today we reached 10 days high with low close wide spread down bar.
# Red Triangle Down    - UpThrust confirmation.
# Lime Square          - Strength bar (either strength is showing in down trend or a supply 
#                        test in up trend).
# Yellow Triangle Up   - An Upbar closing near High after a Test confirms strength.
# Lime Diamond         - Stopping volume. Normally indicates end of bearishness is nearing 
#                        /OR/ No supply.
# Lime Triangle Up     - The previous bar saw strength coming back, This upbar confirms strength.
# Blue Square          - Psuedo UpThrust, A Sign of Weakness /OR/ A High Volume Up Bar closing
#                        down in a uptrend shows Distribution /OR/ No Demand.
# Blue Triangle Down   - A Down Bar closing down after a Pseudo Upthrust confirms weakness.
# Yellow Triangle Down - High volume Downbar after an upmove on high volume indicates weakness.
# Aqua Triangle Up     - High volume upbar closing on the high indicates strength (in short 
#                        term down trend).
# Deep Pink Square     - Test for supply.
# Turquoise Diamond    - Effort to Rise. Bullish sign.
# Yellow Diamond       - Effort to Fall. Bearish sign.

# The NT version used a LinRegSlopeSFX indicator for determining trends. Those have been
# replaced in this ToS version with a call to the built in LinearRegressionSlope indicator.

#######
# Arguments

input volumeEMALength = 30;
input narrowSpreadFactor = 0.7;
input wideSpreadFactor = 1.5;
input aboveAvgVolfactor = 1.5;
input ultraHighVolfactor = 2;
input highCloseFactor = 0.70;
input lowCloseFactor = 0.25;
input colorBars = {default false, true};
input trendText = {false, default true};
input volumeDefinitions = { false, default true };
input alerts = { default false, true };

#######
# Calculations

rec spread = high - low;
def median = (high + low ) / 2;
rec avgVolume = CompoundValue(volumeEMALength, ExpAverage(volume, volumeEMALength), Double.NaN);

# Calculate Volume moving average and it's standard deviation
rec sAvgVolume =  CompoundValue(volumeEMALength, Average(volume, volumeEMALength), Double.NaN);
def sAvgVolumeSTD = StDev(sAvgVolume, volumeEMALength);

# check if the vloume has been decreasing in the past two days.
def isTwoDaysLowVol = (volume < volume[1] && volume[0] < volume[2]);

# Calculate Range information
def avgSpread = WildersAverage(spread, volumeEMALength)[0];
rec isWideSpreadBar = (spread > (wideSpreadFactor * avgSpread));
rec isNarrowSpreadBar = (spread < (narrowSpreadFactor * avgSpread));

# Price information
rec isUpBar = close > close[1];
rec isDownBar = close < close[1];

# Check if the close is in the Highs/Lows/Middle of the bar.
def x1 = if (close == low) then avgSpread else (spread / (close - low));

def isUpCloseBar = (x1 < 2);
def isDownCloseBar = (x1 > 2);
def isMidCloseBar = (x1 < 2.2 && x1 > 1.8);
def isVeryHighCloseBar = (x1 < 1.35);

# Trend Definitions
rec fiveDaysSma = CompoundValue(5, Average(close, 5)[0], Double.NaN);
def LongTermTrendSlope = LinearRegressionSlope(price = fiveDaysSma, length = 40)[0];
def MiddleTermTrendSlope = LinearRegressionSlope(price = fiveDaysSma, length = 15)[0];
def ShortTermTrendSlope = LinearRegressionSlope(price = fiveDaysSma, length = 5)[0];

######################################################################
#  VSA Definitions
            
# utbar
rec isUpThrustBar = isWideSpreadBar && isDownCloseBar && ShortTermTrendSlope > 0;
# utcond1
def upThrustConditionOne = (isUpThrustBar[1] && isDownBar);
# utcond2
def upThrustConditionTwo = (isUpThrustBar[1] && isDownBar[0] && volume > volume[1]);
# utcond3
def upThrustConditionThree = (isUpThrustBar[0] && volume > 2 * sAvgVolume[0]);
# scond1
rec isConfirmedUpThrustBar = (upThrustConditionOne or upThrustConditionTwo or upThrustConditionThree);
# scond
rec isNewConfirmedUpThrustBar = (isConfirmedUpThrustBar[0] && !isConfirmedUpThrustBar[1]);

#  trbar
def reversalLikelyBar = (volume[1] > sAvgVolume[0] && isUpBar[1] && isWideSpreadBar[1] && isDownBar[0] && isDownCloseBar && isWideSpreadBar[0] && LongTermTrendSlope > 0 && high == Highest(high, 10)[0]);
            
# hutbar
rec isPseudoUpThrustBar = (isUpBar[1] && (volume[1] > aboveAvgVolfactor * sAvgVolume[0]) && isDownBar[0] && isDownCloseBar && !isWideSpreadBar[0] && !isUpThrustBar[0]);
# hutcond
def pseudoUpThrustConfirmation = (isPseudoUpThrustBar[1] && isDownBar[0] && isDownCloseBar && !isUpThrustBar[0]);

# tcbar
def weaknessBar = (isUpBar[1] && high[0] == Highest(high, 5)[0] && isDownBar[0] && (isDownCloseBar or isMidCloseBar) && volume[0] > sAvgVolume[0] && !isWideSpreadBar[0] && !isPseudoUpThrustBar[0]);

# stdn, stdn0, stdn1, stdn2
def strengthInDownTrend =  (volume[0] > volume[1] && isDownBar[1] && isUpBar[0] && (isUpCloseBar or isMidCloseBar) && ShortTermTrendSlope < 0 && MiddleTermTrendSlope < 0);
def strengthInDownTrend0 = (volume[0] > volume[1] && isDownBar[1] && isUpBar[0] && (isUpCloseBar or isMidCloseBar) && ShortTermTrendSlope < 0 && MiddleTermTrendSlope < 0 && LongTermTrendSlope < 0);
def strengthInDownTrend1 = (volume[0] > (sAvgVolume[0] * aboveAvgVolfactor) && isDownBar[1] && isUpBar[0] && (isUpCloseBar or isMidCloseBar) && ShortTermTrendSlope < 0 && MiddleTermTrendSlope < 0 && LongTermTrendSlope < 0);
def strengthInDownTrend2 = (volume[1] < sAvgVolume[0] && isUpBar[0] && isVeryHighCloseBar && volume[0] > sAvgVolume[0] && ShortTermTrendSlope < 0);

rec bycond1 = (strengthInDownTrend or strengthInDownTrend1);

# bycond
def isStrengthConfirmationBar = (isUpBar[0] && bycond1[1]);

# stvol
def stopVolBar = low[0] == Lowest(low, 5)[0] && (isUpCloseBar or isMidCloseBar) && volume[0] > aboveAvgVolfactor * sAvgVolume[0] && LongTermTrendSlope < 0;

# ndbar, nsbar
def noDemandBar = (isUpBar[0] && isNarrowSpreadBar[0] && isTwoDaysLowVol && isDownCloseBar);
def noSupplyBar = (isDownBar[0] && isNarrowSpreadBar[0] && isTwoDaysLowVol && isDownCloseBar);

# lvtbar, lvtbar1, lvtbar2
rec supplyTestBar = (isTwoDaysLowVol && low[0] < low[1] && isUpCloseBar);
def supplyTestInUpTrendBar = (volume[0] < sAvgVolume[0] && low[0] < low[1] && isUpCloseBar && LongTermTrendSlope > 0 && MiddleTermTrendSlope > 0 && isWideSpreadBar[0]);
def successfulSupplyTestBar = (supplyTestBar[1] && isUpBar[0] && isUpCloseBar);
            
# dbar
def distributionBar = (volume[0] > ultraHighVolfactor * sAvgVolume[0] && isDownCloseBar && isUpBar[0] && ShortTermTrendSlope > 0 && MiddleTermTrendSlope > 0 && !isConfirmedUpThrustBar[0] && !isUpThrustBar[0]);

# eftup, eftupfl, eftdn
def effortToMoveUpBar = (high[0] > high[1] && low[0] > low[1] && close[0] > close[1] && close[0] >= ((high[0] - low[0]) * highCloseFactor + low[0]) && spread[0] > avgSpread && volume[0] > volume[1]);
def failedEffortUpMove = (effortToMoveUpBar[1] && (isUpThrustBar[0] or upThrustConditionOne or upThrustConditionTwo or upThrustConditionThree));

def effortToMoveDownBar = (high[0] < high[1] && low[0] < low[1] && close[0] < close[1] && close[0] <= ((high[0] - low[0]) * lowCloseFactor + low[0]) && spread[0] > avgSpread && volume[0] > volume[1]);

######################################################################
# set the shapes on the graph

# upthurst and NOT confirmed - red square on top
plot upThrustBarPlot = if isUpThrustBar[0] and !isNewConfirmedUpThrustBar[0] then (high + 2 * TickSize()) else Double.NaN;
upThrustBarPlot.SetPaintingStrategy(PaintingStrategy.LINE_VS_SQUARES);
upThrustBarPlot.SetStyle(Curve.POINTS);
upThrustBarPlot.SetDefaultColor(Color.RED);
upThrustBarPlot.HideBubble();
upThrustBarPlot.HideTitle();

# reversal likely - blue diamond on top
plot reversalLikelyBarPlot = if reversalLikelyBar then (high + 2 * TickSize()) else Double.NaN;
reversalLikelyBarPlot.SetPaintingStrategy(PaintingStrategy.POINTS);
reversalLikelyBarPlot.SetDefaultColor(Color.BLUE);
reversalLikelyBarPlot.HideBubble();
reversalLikelyBarPlot.HideTitle();

# new confirmed upthrust bar - red triangle (down) on top
plot isNewConfirmedUpThrustBarPlot = if isNewConfirmedUpThrustBar then (high + 2 * TickSize()) else Double.NaN;
isNewConfirmedUpThrustBarPlot.SetPaintingStrategy(PaintingStrategy.LINE_VS_TRIANGLES);
isNewConfirmedUpThrustBarPlot.SetDefaultColor(Color.RED);
isNewConfirmedUpThrustBarPlot.HideBubble();
isNewConfirmedUpThrustBarPlot.HideTitle();

# strength in down trend - lime square on bottom
plot strengthInDownTrendPlot = if strengthInDownTrend then (low - 4 * TickSize()) else Double.NaN;
strengthInDownTrendPlot.SetPaintingStrategy(PaintingStrategy.LINE_VS_SQUARES);
strengthInDownTrendPlot.SetDefaultColor(Color.GREEN);
strengthInDownTrendPlot.HideBubble();
strengthInDownTrendPlot.HideTitle();

# strength in down trend - lime square on bottom
plot strengthInDownTrend1Plot = if strengthInDownTrend1 then (low - 4 * TickSize()) else Double.NaN;
strengthInDownTrend1Plot.SetPaintingStrategy(PaintingStrategy.LINE_VS_SQUARES);
strengthInDownTrend1Plot.SetDefaultColor(Color.GREEN);
strengthInDownTrend1Plot.HideBubble();
strengthInDownTrend1Plot.HideTitle();

# supply test in up trend - lime square on bottom of the bar
plot supplyTestInUpTrendBarPlot = if supplyTestInUpTrendBar then (low - 4 * TickSize()) else Double.NaN;
supplyTestInUpTrendBarPlot.SetPaintingStrategy(PaintingStrategy.LINE_VS_SQUARES);
supplyTestInUpTrendBarPlot.SetDefaultColor(Color.GREEN);
supplyTestInUpTrendBarPlot.HideBubble();
supplyTestInUpTrendBarPlot.HideTitle();

# successful test for supply - yellow triangle up on bottom of the bar
plot successfulSupplyTestBarPlot = if successfulSupplyTestBar then (low - 2 * TickSize()) else Double.NaN;
successfulSupplyTestBarPlot.SetPaintingStrategy(PaintingStrategy.LINE_VS_TRIANGLES);
successfulSupplyTestBarPlot.SetDefaultColor(Color.YELLOW);
successfulSupplyTestBarPlot.HideBubble();
successfulSupplyTestBarPlot.HideTitle();

# stopping volume green (diamond) circle at bottom of bar
plot stopVolBarPlot = if stopVolBar then (low - 2 * TickSize()) else Double.NaN;
stopVolBarPlot.SetPaintingStrategy(PaintingStrategy.LINE_VS_POINTS);
stopVolBarPlot.SetDefaultColor(Color.GREEN);
stopVolBarPlot.HideBubble();
stopVolBarPlot.HideTitle();

# green triangle up at bottom of the bar
plot isStrengthConfirmationBarPlot = if isStrengthConfirmationBar then (low - 7 * TickSize()) else Double.NaN;
isStrengthConfirmationBarPlot.SetPaintingStrategy(PaintingStrategy.LINE_VS_TRIANGLES);
isStrengthConfirmationBarPlot.SetDefaultColor(Color.GREEN);
isStrengthConfirmationBarPlot.HideBubble();
isStrengthConfirmationBarPlot.HideTitle();

# blue square at top of bar
plot isPseudoUpThrustBarPlot = if isPseudoUpThrustBar then (high + 2 * TickSize()) else Double.NaN;
isPseudoUpThrustBarPlot.SetPaintingStrategy(PaintingStrategy.LINE_VS_SQUARES);
isPseudoUpThrustBarPlot.SetDefaultColor(Color.BLUE);
isPseudoUpThrustBarPlot.HideBubble();
isPseudoUpThrustBarPlot.HideTitle();

# blue triangle (down) at top of bar
plot pseudoUpThrustConfirmationPlot = if pseudoUpThrustConfirmation then (high + 2 * TickSize()) else Double.NaN;
pseudoUpThrustConfirmationPlot.SetPaintingStrategy(PaintingStrategy.LINE_VS_TRIANGLES);
pseudoUpThrustConfirmationPlot.SetDefaultColor(Color.BLUE);
pseudoUpThrustConfirmationPlot.HideBubble();
pseudoUpThrustConfirmationPlot.HideTitle();

# yellow triangle (down) at top of bar
plot weaknessBarPlot = if weaknessBar then (high + 2 * TickSize()) else Double.NaN;
weaknessBarPlot.SetPaintingStrategy(PaintingStrategy.LINE_VS_TRIANGLES);
weaknessBarPlot.SetDefaultColor(Color.YELLOW);
weaknessBarPlot.HideBubble();
weaknessBarPlot.HideTitle();

# aqua triangle up at bottom of bar
plot strengthInDownTrend2Plot = if strengthInDownTrend2 then (low - 2 * TickSize()) else Double.NaN;
strengthInDownTrend2Plot.SetPaintingStrategy(PaintingStrategy.LINE_VS_TRIANGLES);
strengthInDownTrend2Plot.SetDefaultColor(Color.CYAN); # ????
strengthInDownTrend2Plot.HideBubble();
strengthInDownTrend2Plot.HideTitle();

# distribution at end of uptrend - blue square on top
plot distributionBarPlot = if distributionBar then (high + 2 * TickSize()) else Double.NaN;
distributionBarPlot.SetPaintingStrategy(PaintingStrategy.LINE_VS_SQUARES);
distributionBarPlot.SetDefaultColor(Color.BLUE);
distributionBarPlot.HideBubble();
distributionBarPlot.HideTitle();

# supply test bar - pink square on bottom
plot supplyTestBarPlot = if supplyTestBar then (low - 2 * TickSize()) else Double.NaN;
supplyTestBarPlot.SetPaintingStrategy(PaintingStrategy.LINE_VS_SQUARES);
supplyTestBarPlot.SetDefaultColor(Color.MAGENTA);
supplyTestBarPlot.HideBubble();
supplyTestBarPlot.HideTitle();

# no demand bar - blue squre on top
plot noDemandBarPlot = if noDemandBar then (high + 2 * TickSize()) else Double.NaN;
noDemandBarPlot.SetPaintingStrategy(PaintingStrategy.LINE_VS_SQUARES);
noDemandBarPlot.SetDefaultColor(Color.BLUE);
noDemandBarPlot.HideBubble();
noDemandBarPlot.HideTitle();

# no supply bar - lime diamond on bottom
plot noSupplyBarPlot = if noSupplyBar then (low - 2 * TickSize()) else Double.NaN;
noSupplyBarPlot.SetPaintingStrategy(PaintingStrategy.LINE_VS_POINTS);
noSupplyBarPlot.SetDefaultColor(Color.GREEN);
noSupplyBarPlot.HideBubble();
noSupplyBarPlot.HideTitle();

# effort to move up - turquoise diamond in the median of the bar
plot effortToMoveUpBarPlot = if effortToMoveUpBar then (median) else Double.NaN;
effortToMoveUpBarPlot.SetPaintingStrategy(PaintingStrategy.LINE_VS_POINTS);
effortToMoveUpBarPlot.SetDefaultColor(CreateColor(64, 224, 208));
effortToMoveUpBarPlot.HideBubble();
effortToMoveUpBarPlot.HideTitle();

# effort to move down - yellow diamond in the median of the bar
plot effortToMoveDownBarPlot = if effortToMoveDownBar then (median) else Double.NaN;
effortToMoveDownBarPlot.SetPaintingStrategy(PaintingStrategy.LINE_VS_POINTS);
effortToMoveDownBarPlot.SetDefaultColor(Color.YELLOW);
effortToMoveDownBarPlot.HideBubble();
effortToMoveDownBarPlot.HideTitle();




#######
# Trend Text Definitions

AddLabel(trendText, Concat("Vol: ", if volume > sAvgVolume[0] + 2.0 * sAvgVolumeSTD then "Very High"
    else if volume[0] > (sAvgVolume[0] + 1.0 * sAvgVolumeSTD) then "High"
    else if (volume[0] > sAvgVolume[0]) then "Above Average"
    else if (volume[0] < sAvgVolume[0] && volume[0] > (sAvgVolume[0] - 1.0 * sAvgVolumeSTD)) then "Less Than Average"
    else if (volume[0] < (sAvgVolume[0] - 1.0 * sAvgVolumeSTD)) then "Low"
    else ""), Color.WHITE);
AddLabel(trendText, Concat("Spread: ", if (spread > (avgSpread * 2.0)) then "Wide"
    else if (spread > avgSpread) then "Above Average"
    else "Narrow"), Color.WHITE);

AddLabel(trendText, Concat("Close: ", if (isVeryHighCloseBar) then "Very High"
    else if (isUpCloseBar) then "High"
    else if (isMidCloseBar) then "Mid"
    else if (isDownCloseBar) then "Down"
    else "Very Low"), Color.WHITE);

AddLabel(trendText, Concat("Trend: ", Concat("Short Term ", if (ShortTermTrendSlope > 0) then "Up"
    else "Down")), Color.WHITE);

AddLabel(trendText, Concat("Mid Term ", if (MiddleTermTrendSlope > 0) then "Up" else "Down"), Color.WHITE);

AddLabel(trendText, Concat("Long Term ", if (LongTermTrendSlope > 0) then "Up" else "Down"), Color.WHITE);


######
# Volume Bar Definitions

AddLabel(volumeDefinitions, if isUpThrustBar[0] then "An Upthrust Bar. A sign of weakness."
    else if upThrustConditionOne then "A downbar after an Upthrust. Confirm weakness."
    else if upThrustConditionTwo && !upThrustConditionOne then "A High Volume downbar after an Upthrust. Confirm weakness."
    else if upThrustConditionThree then "This upthrust at very High Volume, Confirms weakness"
    else if strengthInDownTrend1 then "Strength seen returning after a down trend. High volume adds to strength. "
    else if strengthInDownTrend0 && !strengthInDownTrend then "Strength seen returning after a down trend."
    else if strengthInDownTrend && !strengthInDownTrend1 then "Strength seen returning after a long down trend."
    else if supplyTestBar[0] then "Test for supply."
    else if successfulSupplyTestBar[0] then "An Upbar closing near High after a Test confirms strength."
    else if isStrengthConfirmationBar then "An Upbar closing near High. Confirms return of Strength."
    else if distributionBar then "A High Volume Up Bar closing down in a uptrend shows Distribution."
    else if isPseudoUpThrustBar[0] then "Psuedo UpThrust.  A Sign of Weakness."
    else if pseudoUpThrustConfirmation then "A Down Bar closing down after a Pseudo Upthrust confirms weakness."
    else if supplyTestInUpTrendBar then "Test for supply in a uptrend. Sign of Strength."
    else if strengthInDownTrend2 then "High volume upbar closing on the high indicates strength."
    else if weaknessBar then "High volume Downbar after an upmove on high volume indicates weakness."
    else if noDemandBar then "No Demand. A sign of Weakness."
    else if noSupplyBar then "No Supply. A sign of Strength."
    else if effortToMoveUpBar[0] then "Effort to Rise. Bullish sign."
    else if effortToMoveDownBar then "Effort to Fall. Bearish sign."
    else if failedEffortUpMove then "Effort to Move up has failed. Bearish sign."
    else if stopVolBar then "Stopping volume. Normally indicates end of bearishness is nearing."
    else "",
  if isUpThrustBar[0] then Color.RED 
    else if upThrustConditionOne then Color.GREEN
    else if upThrustConditionTwo && !upThrustConditionOne then Color.GREEN
    else if upThrustConditionThree then Color.BLUE
    else if strengthInDownTrend1 then Color.YELLOW
    else if strengthInDownTrend0 && !strengthInDownTrend then Color.GREEN
    else if strengthInDownTrend && !strengthInDownTrend1 then Color.GREEN
    else if supplyTestBar[0] then Color.CYAN
    else if successfulSupplyTestBar[0] then Color.CYAN
    else if isStrengthConfirmationBar then Color.GREEN
    else if distributionBar then Color.YELLOW
    else if isPseudoUpThrustBar[0] then Color.GREEN
    else if pseudoUpThrustConfirmation then Color.BLUE
    else if supplyTestInUpTrendBar then Color.BLUE
    else if strengthInDownTrend2 then Color.YELLOW
    else if weaknessBar then Color.BLUE
    else if noDemandBar then Color.YELLOW
    else if noSupplyBar then Color.GREEN
    else if effortToMoveUpBar[0] then CreateColor(127, 255, 212)
    else if effortToMoveDownBar then Color.BLUE
    else if failedEffortUpMove then Color.BLUE
    else if stopVolBar then Color.CYAN
    else Color.BLACK);

########
# Alerts

Alert(if alerts and (isUpThrustBar[0] 
     or upThrustConditionOne 
     or (upThrustConditionTwo && !upThrustConditionOne) 
     or upThrustConditionThree 
     or strengthInDownTrend1 
     or (strengthInDownTrend0 && !strengthInDownTrend)
     or (strengthInDownTrend && !strengthInDownTrend1)
     or supplyTestBar[0] 
     or successfulSupplyTestBar[0] 
     or isStrengthConfirmationBar 
     or distributionBar 
     or isPseudoUpThrustBar[0] 
     or pseudoUpThrustConfirmation 
     or supplyTestInUpTrendBar 
     or strengthInDownTrend2 
     or weaknessBar 
     or noDemandBar 
     or noSupplyBar 
     or effortToMoveUpBar[0] 
     or effortToMoveDownBar 
     or failedEffortUpMove 
     or stopVolBar) then 1 else 0, if isUpThrustBar[0] then "An Upthrust Bar. A sign of weakness."
    else if upThrustConditionOne then "A downbar after an Upthrust. Confirm weakness."
    else if upThrustConditionTwo && !upThrustConditionOne then "A High Volume downbar after an Upthrust. Confirm weakness."
    else if upThrustConditionThree then "This upthrust at very High Volume, Confirms weakness."
    else if strengthInDownTrend1 then "Strength seen returning after a down trend. High volume adds to strength. "
    else if strengthInDownTrend0 && !strengthInDownTrend then "Strength seen returning after a down trend."
    else if strengthInDownTrend && !strengthInDownTrend1 then "Strength seen returning after a long down trend."
    else if supplyTestBar[0] then "Test for supply."
    else if successfulSupplyTestBar[0] then "An Upbar closing near High after a Test confirms strength."
    else if isStrengthConfirmationBar then "An Upbar closing near High. Confirms return of Strength."
    else if distributionBar then "A High Volume Up Bar closing down in a uptrend shows Distribution."
    else if isPseudoUpThrustBar[0] then "Psuedo UpThrust.  A Sign of Weakness."
    else if pseudoUpThrustConfirmation then "A Down Bar closing down after a Pseudo Upthrust confirms weakness."
    else if supplyTestInUpTrendBar then "Test for supply in a uptrend. Sign of Strength."
    else if strengthInDownTrend2 then "High volume upbar closing on the high indicates strength."
    else if weaknessBar then "High volume Downbar after an upmove on high volume indicates weakness."
    else if noDemandBar then "No Demand. A sign of Weakness."
    else if noSupplyBar then "No Supply. A sign of Strength."
    else if effortToMoveUpBar[0] then "Effort to Rise. Bullish sign."
    else if effortToMoveDownBar then "Effort to Fall. Bearish sign."
    else if failedEffortUpMove then "Effort to Move up has failed. Bearish sign."
    else if stopVolBar then "Stopping volume. Normally indicates end of bearishness is nearing."
    else "", Alert.BAR, Sound.Ding);
