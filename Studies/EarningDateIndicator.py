def isBefore = HasEarnings(EarningTime.BEFORE_MARKET);
def isAfter = HasEarnings(EarningTime.AFTER_MARKET);

#AddChartBubble( HasEarnings(), high,
# "Earning " + if isBefore then "before market" else if isAfter then "after market" else "during market"
# #+ GetEventOffset(Events.EARNINGS, -1) + " bars ago"
# , Color.WHITE
# );

AddVerticalLine(HasEarnings(), "Earning Report " + if isBefore then " Before Market" else if isAfter then " After Market" else "", Color.GRAY,  GetEventOffset(Events.Earnings, 0));
