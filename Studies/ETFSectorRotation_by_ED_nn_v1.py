# ETF_Rotate_Lower by ED_nn ThinkScriptLounge 4-2019
# from 4/4/2019 chat room:
# 06:37 Mobius: johnny - To find rotation quickly - Use primary ETF's in a watchlist with 2 columns first column is Correlation to SPX second is a stochastic of Beta, if Beta is 1 or close to 1 that ETF is moving at the fastest momentum in that range and if correlation is with SPX .85 or better it's moving with SPX cor# daily start with 13,34 as starting point.
# 4-19-19 Markos took out Beta 1 & 2. 
# 6-23-19 Markos put Beta back in 

declare lower;

input BetaLength = 21;
input StochLength =34;
input showBeta = No;
input showOverlay = Yes;

input Cyclicals      = "XLY";
input Technology     = "XLK";
input Industrials    = "XLI";
input Materials      = "XLB";
input Energy         = "XLE";
input Staples        = "XLP";
input HealthCare     = "XLV";
input Utilities      = "XLU";
input Financials     = "XLF";

#------------------------------
#----purple colors
defineglobalColor(“PlumMedium“, createColor(221, 160, 221));
defineglobalColor(“Orchid“, createColor(218, 130, 214));
defineglobalColor(“MediumOrchid“, createColor(186, 85, 211));
defineglobalColor(“MediumPurple“, createColor(147, 112, 219));
defineglobalColor(“DarkOrchid“, createColor(153, 50, 204));


plot Scriptlabel = Double.NaN;
Scriptlabel.SetDefaultColor(CreateColor (0, 0, 0));

def Agg = GetAggregationPeriod();

#--------------------date start
addLabel(1,  getMonth() + "/" +
             getDayOfMonth(getYyyyMmDd()) + "/" +
             AsPrice(getYear()), GlobalColor("PlumMedium"));
#--------------------date end

#addLabel(1, " Ticker: '" + GetSymbol() + "' ", GlobalColor("Orchid"));

addLabel(1, "Agg: " +
              ( if Agg == AggregationPeriod.MIN then "1 Min"
           else if Agg == AggregationPeriod.TWO_MIN then "2 Min"
           else if Agg == AggregationPeriod.THREE_MIN then "3 Min"
           else if Agg == AggregationPeriod.FOUR_MIN then "4 Min"
           else if Agg == AggregationPeriod.FIVE_MIN then "5 Min"
           else if Agg == AggregationPeriod.TEN_MIN then "10 Min"
           else if Agg == AggregationPeriod.FIFTEEN_MIN then "15 Min"
           else if Agg == AggregationPeriod.THREE_MIN then "30 Min"
           else if Agg == AggregationPeriod.HOUR then "1 Hour"
           else if Agg == AggregationPeriod.TWO_HOURS then "2 Hour"
           else if Agg == AggregationPeriod.FOUR_HOURS then "4 Hours"
           else if Agg == AggregationPeriod.DAY then "1 Day"
           else if Agg == AggregationPeriod.WEEK then "1 Week"
           else if Agg == AggregationPeriod.MONTH then "1 Month"
           else  (Agg / 1000 / 60) + "Minutes")  +
           " (" + (if Agg<=23400000
                   then 23400000/Agg
                   else 86400000/Agg)+ ")"
          , GlobalColor("MediumPurple"));
#addLabel(1, BarNumber() + " Bars", GlobalColor("DarkOrchid"));

#-----------------------------
#-----------------------------

addLabel(1,"Rotation Beta/Stochastic (" + betaLength + "," +stochLength + ") ", color.Light_Gray);


script calcBeta {
  input secondSymbol = "XLF";
  input refSymbol = "SPX";
  input betaLength = 21;
  input returnLength = 1;

  def refPrice = close(refSymbol);
  def primary = if refPrice[returnLength] == 0
                then 0
                else (refPrice - refPrice[returnLength]) /
                      refPrice[returnLength] * 100;
  def secondPrice = close(secondSymbol);
  def secondary = if secondPrice[returnLength] == 0
                  then 0
                  else (secondPrice - secondPrice[returnLength]) /
                        secondPrice[returnLength] * 100;
  plot Beta = covariance(secondary, primary, betaLength) /
                         Sqr(stdev(primary, betaLength));
}

script EhlersESSfilter {
    input price = close;
    input length = 8;
    def ESS_coeff_0 = Exp(-Double.Pi * Sqrt(2) / length);
    def ESS_coeff_2 = 2 * ESS_coeff_0 * Cos(Sqrt(2) * Double.Pi / length);
    def ESS_coeff_3 = - Sqr(ESS_coeff_0);
    def ESS_coeff_1 = 1 - ESS_coeff_2 - ESS_coeff_3;
    def ESS_filter = if IsNaN(price + price[1]) then
                      ESS_filter[1]
                 else ESS_coeff_1 * (price + price[1]) / 2 +
                      ESS_coeff_2 * ESS_filter[1] +
                      ESS_coeff_3 * ESS_filter[2];
    plot Smooth_Filter =
         if barnumber() <  length then
              price
         else if !IsNaN(price) then
              ESS_filter
         else Double.NaN;
}

script calcStoch {
  input data = close;
  input StochLength = 21;
  def stochasticValue = ((data - lowest(data, StochLength)) /
                         (highest(data, StochLength) - lowest(data, StochLength)));
  plot stoch = stochasticValue;
}

plot beta1 = if showBeta then calcBeta(Cyclicals) else Double.NaN;
plot beta2 = if showBeta then calcBeta(Technology) else Double.NaN;
####
plot stoch1 = calcStoch(
                        data = EhlersESSfilter(
                               calcBeta(secondSymbol = Cyclicals,
                               betaLength = BetaLength)),
                                     stochLength = StochLength);
stoch1.SetDefaultColor(Color.VIOLET);
stoch1.SetLineWeight(2);
stoch1.SetPaintingStrategy(PaintingStrategy.LINE_VS_SQUARES);
stoch1.HideBubble();
AddLabel(ShowOverlay, " Cyclicals ", Color.VIOLET);
AddChartBubble(ShowOverlay and IsNaN(close[-1]) and !IsNaN(close), if stoch1 < 0.15 then 0 else if stoch1 > 0.85 then 1 else stoch1, "Cyclicals", Color.VIOLET, stoch1 > 0.5);

plot stoch2 = calcStoch(
                        data = EhlersESSfilter(
                               calcBeta(secondSymbol = Technology,
                               betaLength = BetaLength)),
                                     stochLength = StochLength);
stoch2.SetDefaultColor(CreateColor(90, 160, 120));
stoch2.SetLineWeight(5);
stoch2.SetStyle(Curve.LONG_DASH);
stoch2.HideBubble();
AddLabel(ShowOverlay, " Techology ", CreateColor(90, 160, 120));
AddChartBubble(ShowOverlay and IsNaN(close[-1]) and !IsNaN(close), if stoch2 < 0.15 then 0 else if stoch2 > 0.85 then 1 else stoch2, "Technology", CreateColor(90, 160, 120), stoch2 > 0.5);

plot stoch3 = calcStoch(
                        data = EhlersESSfilter(
                               calcBeta(secondSymbol = Industrials,
                               betaLength = BetaLength)),
                                     stochLength = StochLength);
stoch3.SetDefaultColor(Color.MAGENTA);
stoch3.SetLineWeight(5);
stoch3.SetStyle(Curve.SHORT_DASH);
stoch3.HideBubble();
AddLabel(ShowOverlay, " Industrials ", Color.MAGENTA);
AddChartBubble(ShowOverlay and IsNaN(close[-1]) and !IsNaN(close), if stoch3 < 0.15 then 0 else if stoch3 > 0.85 then 1 else stoch3, "Industrials", Color.MAGENTA, stoch3 > 0.5);

plot stoch4 = calcStoch(
                        data = EhlersESSfilter(
                               calcBeta(secondSymbol = Materials,
                               betaLength = BetaLength)),
                                     stochLength = StochLength);
stoch4.SetDefaultColor(Color.CYAN);
stoch4.SetLineWeight(2);
stoch4.SetPaintingStrategy(PaintingStrategy.LINE);
stoch4.HideBubble();
AddLabel(ShowOverlay, " Materials ", Color.CYAN);
AddChartBubble(ShowOverlay and IsNaN(close[-1]) and !IsNaN(close), if stoch4 < 0.15 then 0 else if stoch4 > 0.85 then 1 else stoch4, "Materials", Color.CYAN, stoch4 > 0.5);

plot stoch5 = calcStoch(
                        data = EhlersESSfilter(
                               calcBeta(secondSymbol = Energy,
                               betaLength = BetaLength)),
                                     stochLength = StochLength);
stoch5.SetDefaultColor(Color.YELLOW);
stoch5.SetLineWeight(1);
stoch5.SetPaintingStrategy(PaintingStrategy.Line_vs_POINTS);
stoch5.HideBubble();
AddLabel(ShowOverlay, " Energy ", Color.YELLOW);
AddChartBubble(ShowOverlay and IsNaN(close[-1]) and !IsNaN(close), if stoch5 < 0.15 then 0 else if stoch5 > 0.85 then 1 else stoch5, "Energy", Color.YELLOW, stoch5 > 0.5);

plot stoch6 = calcStoch(
                        data = EhlersESSfilter(
                               calcBeta(secondSymbol = Staples,
                               betaLength = BetaLength)),
                                     stochLength = StochLength);
stoch6.SetDefaultColor(CreateColor(80, 180, 70));
stoch6.SetLineWeight(2);
stoch6.SetPaintingStrategy(PaintingStrategy.LINE_VS_TRIANGLES);
stoch6.HideBubble();
AddLabel(ShowOverlay, " Staples ", CreateColor(80, 180, 70));
AddChartBubble(ShowOverlay and IsNaN(close[-1]) and !IsNaN(close), if stoch6 < 0.15 then 0 else if stoch6 > 0.85 then 1 else stoch6, "Staples", CreateColor(80, 180, 70), stoch6 > close);

plot stoch7 = calcStoch(
                        data = EhlersESSfilter(
                               calcBeta(secondSymbol = HealthCare,
                               betaLength = BetaLength)),
                                     stochLength = StochLength);
stoch7.SetDefaultColor(CreateColor(180, 80, 180));
stoch7.SetLineWeight(4);
stoch7.SetPaintingStrategy(PaintingStrategy.LINE);
stoch7.HideBubble();
AddLabel(ShowOverlay, " HealthCare ", CreateColor(180, 80, 180));
AddChartBubble("time condition" = ShowOverlay and IsNaN(close[-1]) and !IsNaN(close), "price location" = if stoch7 < 0.15 then 0 else if stoch7 > 0.85 then 1 else stoch7, text = "HealthCare", color = CreateColor(180, 80, 180), stoch7 > 0.5);

plot stoch8 = calcStoch(
                        data = EhlersESSfilter(
                               calcBeta(secondSymbol = Utilities,
                               betaLength = BetaLength)),
                                     stochLength = StochLength);
stoch8.SetDefaultColor(Color.ORANGE);
stoch8.SetLineWeight(2);
stoch8.SetPaintingStrategy(PaintingStrategy.LINE);
stoch8.HideBubble();
AddLabel(ShowOverlay, " Utilities ", Color.ORANGE);
AddChartBubble(ShowOverlay and IsNaN(close[-1]) and !IsNaN(close[0]), if stoch8 < 0.15 then 0 else if stoch8 > 0.85 then 1 else stoch8, "Utilities", Color.ORANGE, stoch8 > 0.5);

plot stoch9 = calcStoch(
                        data = EhlersESSfilter(
                               calcBeta(secondSymbol = Financials,
                               betaLength = BetaLength)),
                                     stochLength = StochLength);
stoch9.SetDefaultColor(Color.PINK);
stoch9.SetLineWeight(2);
stoch9.SetPaintingStrategy(PaintingStrategy.LINE_VS_POINTS);
stoch9.HideBubble();
AddLabel(ShowOverlay, " Financials ", Color.PINK);
AddChartBubble(ShowOverlay and IsNaN(close[-1]) and !IsNaN(close), if stoch9 < 0.15 then 0 else if stoch9 > 0.85 then 1 else stoch9, "Financials", Color.PINK, stoch9 > 0.5);

#----------------------------------------------
def barNumber = BarNumber();
def endBar = if !IsNaN(close) and IsNaN(close[-1]) then barNumber else endBar[1];
def lastBar = HighestAll(endBar);
input flowLabelStep = 40;
addLabel(1,"Last Bar = " + lastBar, color.Light_Gray);
DefineGlobalColor("YellowGreen", CreateColor(90, 140, 5));
AddChartBubble(barNumber == (lastBar - flowLabelStep), 1.01,
"M O N E Y   F L O W S   I N", globalColor("YellowGreen"), 1);
AddChartBubble(barNumber == (lastBar - 2*flowLabelStep), 1.01,
"M O N E Y   F L O W S   I N", globalColor("YellowGreen"), 1);
#mAddChartBubble(barNumber == (lastBar - 3*flowLabelStep), 1.01,
#"M O N E Y   F L O W S   I N", globalColor("YellowGreen"), 1);

DefineGlobalColor("Cinamon", CreateColor(200, 10, 40));
AddChartBubble(barNumber == (lastBar - flowLabelStep), -0.01,
"M O N E Y   F L O W S   O U T", globalColor("Cinamon"), 0);
AddChartBubble(barNumber == (lastBar - 2*flowLabelStep), -0.01,
"M O N E Y   F L O W S   O U T", globalColor("Cinamon"), 0);
#mAddChartBubble(barNumber == (lastBar - 3*flowLabelStep), -0.01,
#m"M O N E Y   F L O W S   O U T", globalColor("Cinamon"), 0);

#plot zero = if isNaN(close) then double.nan else 0;
plot zero = if barNumber > (lastBar + 7) then double.nan else 0;
zero.SetDefaultColor(createColor(90, 20, 20));
zero.SetStyle(Curve.Long_Dash);
zero.SetLineWeight(5);
zero.HideBubble();
plot one = if barNumber > (lastBar + 7) then double.nan else 1;
one.SetDefaultColor(createColor(20, 70, 20));
one.SetStyle(Curve.Long_Dash);
one.SetLineWeight(5);
one.HideBubble();
#EOC