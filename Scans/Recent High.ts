#52 Week high has happened within past XYZ Days (bars);
#Default setting is 52 Week high has happened within past 60 Days
# By XeoNoX via usethinkscript.com
#Set Scan Aggregation to Day
input YearsToMonitor = 1;
input YearTradingDays = 252;
def DaysWithin = YearTradingDays * YearsToMonitor;#252 per year; 
#252 days represent one trading year
#def LongTermHigh = Highest(high, 252);
def RecentHigh = Highest(high, DaysWithin);
plot scan = close >= RecentHigh; # and RecentHigh >= LongTermHigh;