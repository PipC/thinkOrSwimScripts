#Follow @KRose_TDA on twitter for free updates posted for this and other scripts
#Earnings trend study is used as part of the generating income with dividend stocks webcast presented Monday nights @ 7PM ET   https://events.thinkorswim.com/#/webcast
# I build custom studies like earnings trend as part of my Thursday night thinkscript webinar @ 5:30PM ET
#     https://events.thinkorswim.com/#/webcast
#This study creates a line chart tracking the trend of a stock's quarterly EPS values(it doesn't work for ETFs).A red square appears when Earnings Per Share(EPS)is lower than the prior quarter's EPS, and a dark green square appears when EPS is higher than the previous quarter's EPS. The arrows represent a comparison of an analyst's estimated EPS for that quarter versus the actual EPS. If the arrow is colored Green, the company's actual EPS was greater than the analyst estimates. If the actual EPS was less than the analyst estimates, the arrow will be Red. The point of the arrow equals analyst estimate value.

declare lower;
declare Hide_on_intraday;

def EPS = if !isNaN(GetActualEarnings()) then GetActualEarnings() else EPS[1];

plot EPS_line_chart = GetActualEarnings();
EPS_line_chart.EnableApproximation();
EPS_line_chart.SetDefaultColor(color.black);

plot earnings_date = GetActualEarnings();
earnings_date.SetPaintingStrategy(PaintingStrategy.squares);

earnings_date.AssignValueColor(if EPS > EPS[1] then color.dark_green else color.red);
earnings_date.SetLineWeight(5);

plot EstEarning = GetEstimatedEarnings();
EstEarning.SetPaintingStrategy(PaintingStrategy.arrow_up );

EstEarning.AssignValueColor (if EstEarning < EPS then color.DARK_GREEN else color.DARK_RED);
EstEarning.SetLineWeight(5);

# end code