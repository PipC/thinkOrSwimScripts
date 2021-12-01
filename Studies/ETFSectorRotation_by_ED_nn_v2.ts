# ETF_Rotate_Lower by ED_nn ThinkScriptLounge 4-2019
# from 4/4/2019 chat room:
# 06:37 Mobius: johnny - To find rotation quickly - Use primary ETF's in a watchlist with 2 columns first column is Correlation to SPX second is a stochastic of Beta, if Beta is 1 or close to 1 that ETF is moving at the fastest momentum in that range and if correlation is with SPX .85 or better it's moving with SPX cor# daily start with 13,34 as starting point.
# 4-19-19 Markos took out Beta 1 & 2.
# 6-23-19 Markos put Beta back in

declare lower;

input BetaLength = 21;
input StochLength = 34;
input showOverlay = yes;

input Cyclicals      = "XLY";
input Technology     = "XLK";
input Industrials    = "XLI";
input Materials      = "XLB";
input Energy         = "XLE";
input Staples        = "XLP";
input HealthCare     = "XLV";
input Utilities      = "XLU";
input Financials     = "XLF";
input Communications = "XTL";
input RealEstate     = "XLRE";

#-----------------------------

AddLabel(1, "R-Beta/Stoch (" + BetaLength + "," + StochLength + ") ", Color.LIGHT_GRAY);


script calcBeta {
    input secondSymbol = "XLF";
    input refSymbol = "SPX";
    input betaLength = 21;
    input returnLength = 1;

    def refPrice = close(refSymbol);
    def primary = if refPrice[returnLength] == 0
                then 0
                else (refPrice - refPrice[returnLength]) / refPrice[returnLength] * 100;
    def secondPrice = close(secondSymbol);
    def secondary = if secondPrice[returnLength] == 0
                  then 0
                  else (secondPrice - secondPrice[returnLength]) / secondPrice[returnLength] * 100;
    plot Beta = Covariance(secondary, primary, betaLength) / Sqr(StDev(primary, betaLength));
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
         if BarNumber() <  length then
              price
         else if !IsNaN(price) then
              ESS_filter
         else Double.NaN;
}

script calcStoch {
    input data = close;
    input StochLength = 21;
    def stochasticValue = ((data - Lowest(data, StochLength)) / (Highest(data, StochLength) - Lowest(data, StochLength)));
    plot stoch = stochasticValue;
}

####

def upStochLimit = 0.95;
def lowStockLimit = 0.05;

plot stoch1 = calcStoch( data = EhlersESSfilter( calcBeta(secondSymbol = Cyclicals, betaLength = betaLength) ), stochLength = StochLength);
stoch1.SetDefaultColor(Color.VIOLET);
stoch1.SetPaintingStrategy(PaintingStrategy.LINE);
stoch1.HideBubble();
AddLabel(showOverlay, " XLY Cyclicals ", Color.VIOLET);
AddChartBubble(showOverlay and stoch1 <= lowStockLimit and stoch1[1] > lowStockLimit, 0, "XLY", Color.VIOLET, no);
AddChartBubble(showOverlay and stoch1 >= upStochLimit and stoch1[1] < upStochLimit, 1, "XLY", Color.VIOLET, yes);
AddChartBubble(showOverlay and stoch1 > lowStockLimit and stoch1[1] < upStochLimit and IsNaN(close[-1]) and !IsNaN(close), stoch1, "XLY", Color.VIOLET, stoch1 >= 0.5);

plot stoch2 = calcStoch( data = EhlersESSfilter( calcBeta(secondSymbol = Technology, betaLength = betaLength) ), stochLength = StochLength);
stoch2.SetDefaultColor(Color.GREEN);
stoch2.SetPaintingStrategy(PaintingStrategy.LINE);
stoch2.HideBubble();
AddLabel(showOverlay, " XLK Techology ", Color.GREEN);
AddChartBubble(showOverlay and stoch2 <= lowStockLimit and stoch2[1] > lowStockLimit, 0, "XLK", Color.GREEN, no);
AddChartBubble(showOverlay and stoch2 >= upStochLimit and stoch2[1] < upStochLimit, 1, "XLK", Color.GREEN, yes);
AddChartBubble(showOverlay and stoch2 > lowStockLimit and stoch2[1] < upStochLimit and IsNaN(close[-1]) and !IsNaN(close), stoch2, "XLK", Color.GREEN, stoch2 >= 0.5);

plot stoch3 = calcStoch( data = EhlersESSfilter( calcBeta(secondSymbol = Industrials, betaLength = betaLength) ), stochLength = StochLength);
stoch3.SetDefaultColor(Color.MAGENTA);
stoch3.SetPaintingStrategy(PaintingStrategy.LINE);
stoch3.HideBubble();
AddLabel(showOverlay, " XLI Industrials ", Color.MAGENTA);
AddChartBubble(showOverlay and stoch3 <= lowStockLimit and stoch3[1] > lowStockLimit, 0, "XLI", Color.MAGENTA, no);
AddChartBubble(showOverlay and stoch3 >= upStochLimit and stoch3[1] < upStochLimit, 1, "XLI", Color.MAGENTA, yes);
AddChartBubble(showOverlay and stoch3 > lowStockLimit and stoch3[1] < upStochLimit and IsNaN(close[-1]) and !IsNaN(close), stoch3, "XLI", Color.MAGENTA, stoch3 >= 0.5);

plot stoch4 = calcStoch( data = EhlersESSfilter( calcBeta(secondSymbol = Materials, betaLength = betaLength) ), stochLength = StochLength);
stoch4.SetDefaultColor(Color.CYAN);
stoch4.SetPaintingStrategy(PaintingStrategy.LINE);
stoch4.HideBubble();
AddLabel(showOverlay, " XLB Materials ", Color.CYAN);
AddChartBubble(showOverlay and stoch4 <= lowStockLimit and stoch4[1] > lowStockLimit, 0, "XLB", Color.CYAN, no);
AddChartBubble(showOverlay and stoch4 >= upStochLimit and stoch4[1] < upStochLimit, 1, "XLB", Color.CYAN, yes);
AddChartBubble(showOverlay and stoch4 > lowStockLimit and stoch4[1] < upStochLimit and IsNaN(close[-1]) and !IsNaN(close), stoch4, "XLB", Color.CYAN, stoch4 >= 0.5);

plot stoch5 = calcStoch( data = EhlersESSfilter( calcBeta(secondSymbol = Energy, betaLength = betaLength) ), stochLength = StochLength);
stoch5.SetDefaultColor(Color.YELLOW);
stoch5.SetPaintingStrategy(PaintingStrategy.LINE);
stoch5.HideBubble();
AddLabel(showOverlay, " XLE Energy ", Color.YELLOW);
AddChartBubble(showOverlay and stoch5 <= lowStockLimit and stoch5[1] > lowStockLimit, 0, "XLE", Color.YELLOW, no);
AddChartBubble(showOverlay and stoch5 >= upStochLimit and stoch5[1] < upStochLimit, 1, "XLE", Color.YELLOW, yes);
AddChartBubble(showOverlay and stoch5 > lowStockLimit and stoch5[1] < upStochLimit and IsNaN(close[-1]) and !IsNaN(close), stoch5, "XLE", Color.YELLOW, stoch5 >= 0.5);

plot stoch6 = calcStoch( data = EhlersESSfilter( calcBeta(secondSymbol = Staples, betaLength = betaLength) ), stochLength = StochLength);
stoch6.SetDefaultColor(Color.DARK_GREEN);
stoch6.SetPaintingStrategy(PaintingStrategy.LINE);
stoch6.HideBubble();
AddLabel(showOverlay, " XLP Staples ", CreateColor(80, 180, 70));
AddChartBubble(showOverlay and stoch6 <= lowStockLimit and stoch6[1] > lowStockLimit, 0, "XLP", Color.DARK_GREEN, no);
AddChartBubble(showOverlay and stoch6 >= upStochLimit and stoch6[1] < upStochLimit, 1, "XLP", Color.DARK_GREEN, yes);
AddChartBubble(showOverlay and stoch6 > lowStockLimit and stoch6[1] < upStochLimit and IsNaN(close[-1]) and !IsNaN(close), stoch6, "XLP", Color.DARK_GREEN, stoch6 >= 0.5);

plot stoch7 = calcStoch( data = EhlersESSfilter( calcBeta(secondSymbol = HealthCare, betaLength = betaLength) ), stochLength = StochLength);
stoch7.SetDefaultColor(Color.GRAY);
stoch7.SetPaintingStrategy(PaintingStrategy.LINE);
stoch7.HideBubble();
AddLabel(showOverlay, " XLV HealthCare ", CreateColor(180, 80, 180));
AddChartBubble(showOverlay and stoch7 <= lowStockLimit and stoch7[1] > lowStockLimit, 0, "XLV", Color.GRAY, no);
AddChartBubble(showOverlay and stoch7 >= upStochLimit and stoch7[1] < upStochLimit, 1, "XLV", Color.GRAY, yes);
AddChartBubble(showOverlay and stoch7 > lowStockLimit and stoch7[1] < upStochLimit and IsNaN(close[-1]) and !IsNaN(close), stoch7, "XLV", Color.GRAY, stoch7 >= 0.5);

plot stoch8 = calcStoch( data = EhlersESSfilter( calcBeta(secondSymbol = Utilities, betaLength = betaLength) ), stochLength = StochLength);
stoch8.SetDefaultColor(Color.ORANGE);
stoch8.SetPaintingStrategy(PaintingStrategy.LINE);
stoch8.HideBubble();
AddLabel(showOverlay, " XLU Utilities ", Color.ORANGE);
AddChartBubble(showOverlay and stoch8 <= lowStockLimit and stoch8[1] > lowStockLimit, 0, "XLU", Color.ORANGE, no);
AddChartBubble(showOverlay and stoch8 >= upStochLimit and stoch8[1] < upStochLimit, 1, "XLU", Color.ORANGE, yes);
AddChartBubble(showOverlay and stoch8 > lowStockLimit and stoch8[1] < upStochLimit and IsNaN(close[-1]) and !IsNaN(close), stoch8, "XLU", Color.ORANGE, stoch8 >= 0.5);

plot stoch9 = calcStoch( data = EhlersESSfilter( calcBeta(secondSymbol = Financials, betaLength = betaLength) ), stochLength = StochLength);
stoch9.SetDefaultColor(Color.PINK);
stoch9.SetPaintingStrategy(PaintingStrategy.LINE);
stoch9.HideBubble();
AddLabel(showOverlay, " XLF Financials ", Color.PINK);
AddChartBubble(showOverlay and stoch9 <= lowStockLimit and stoch9[1] > lowStockLimit, 0, "XLF", Color.PINK, no);
AddChartBubble(showOverlay and stoch9 >= upStochLimit and stoch9[1] < upStochLimit, 1, "XLF", Color.PINK, yes);
AddChartBubble(showOverlay and stoch9 > lowStockLimit and stoch9[1] < upStochLimit and IsNaN(close[-1]) and !IsNaN(close), stoch9, "XLF", Color.PINK, stoch9 >= 0.5);


plot stoch10 = calcStoch( data = EhlersESSfilter( calcBeta(secondSymbol = Communications, betaLength = betaLength) ), stochLength = StochLength);
stoch10.SetDefaultColor(Color.WHITE);
stoch10.SetPaintingStrategy(PaintingStrategy.LINE);
stoch10.HideBubble();
AddLabel(showOverlay, " XTL Communications ", Color.WHITE);
AddChartBubble(showOverlay and stoch10 <= lowStockLimit and stoch10[1] > lowStockLimit, 0, "XTL", Color.WHITE, no);
AddChartBubble(showOverlay and stoch10 >= upStochLimit and stoch10[1] < upStochLimit, 1, "XTL", Color.WHITE, yes);
AddChartBubble(showOverlay and stoch10 > lowStockLimit and stoch10[1] < upStochLimit and IsNaN(close[-1]) and !IsNaN(close), stoch10, "XTL", Color.WHITE, stoch10 >= 0.5);


plot stoch11 = calcStoch( data = EhlersESSfilter( calcBeta(secondSymbol = RealEstate, betaLength = betaLength) ), stochLength = StochLength);
stoch11.SetDefaultColor(Color.LIGHT_GREEN);
stoch11.SetPaintingStrategy(PaintingStrategy.LINE);
stoch11.HideBubble();
AddLabel(showOverlay, " XLRE RealEstate ", Color.LIGHT_GREEN);
AddChartBubble(showOverlay and stoch11 <= lowStockLimit and stoch11[1] > lowStockLimit, 0, "XLRE", Color.LIGHT_GREEN, no);
AddChartBubble(showOverlay and stoch11 >= upStochLimit and stoch11[1] < upStochLimit, 1, "XLRE", Color.LIGHT_GREEN, yes);
AddChartBubble(showOverlay and stoch11 > lowStockLimit and stoch11[1] < upStochLimit and IsNaN(close[-1]) and !IsNaN(close), stoch11, "XLRE", Color.LIGHT_GREEN, stoch11 >= 0.5);

plot upperLine = 0.80;
upperLine.SetDefaultColor(Color.DARK_GREEN);
upperLine.SetPaintingStrategy(PaintingStrategy.DASHES);
plot lowerLine = 0.20;
lowerLine.SetDefaultColor(Color.DARK_RED);
lowerLine.SetPaintingStrategy(PaintingStrategy.DASHES);