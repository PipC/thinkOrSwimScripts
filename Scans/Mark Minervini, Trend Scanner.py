#wizard input: range
#wizard input: price
#wizard input: length
#wizard input: LookBack
#wizard input: percentAbv52Wk
#wizard input: percent
input range = 252; #Number of Trading days
input price = close; #Current closing price
input length = 200; #hint length: The length of the moving average
input LookBack = 60; #hint LookBack: The agg-bars back moving average being compared to
input percentAbv52Wk = 30;
input percentAtLeast52Wk = 80;

# Mark Minervini, Trend Template TOS Scanner 
# https://usethinkscript.com/threads/mark-minervini-trend-template-tos-scanner.563/
##########################################################################################################################
## 1. The current stock price is above both the 150-day (30-week) and the 200-day (40-week) moving average price lines.
## 2. The 150-day moving average is above the 200-day moving average.
## 3. The 200-day moving average line is trending up for at least 1 month (preferably 4?5 months minimum in most cases).
## 4. The 50-day (10-week) moving average is above both the 150-day and 200-day moving averages.
## 5. The current stock price is trading above the 50-day moving average.
## 6. The current stock price is at least 30 percent above its 52-week low. (Many of the best selections will be 100 percent, 300 percent,
## or greater above their 52-week low before they emerge from a solid consolidation period and mount a large scale advance.)
## 7. The current stock price is within at least 25 percent of its 52-week high (the closer to a new high the better).
## 8. The relative strength ranking (as reported in Investor?s Business Daily) is no less than 70, and preferably in the 80s or 90s,
## which will generally be the case with the better selections
## NOTE: Point 8, I have not implemented, because TOS doesn'thave IDB rating.
##
## Reference to conditions above
## 3) (Average(close, length) > Average(close, length)[LookBack])
## 2) and SimpleMovingAvg("length" = 150)."SMA" is greater than SimpleMovingAvg("length" = 200)."SMA"
## 4) and SimpleMovingAvg("length" = 50)."SMA" is greater than SimpleMovingAvg("length" = 150)."SMA"
## 4) and SimpleMovingAvg("length" = 50)."SMA" is greater than SimpleMovingAvg("length" = 200)."SMA"
## 1) and close is greater than SimpleMovingAvg("length" = 200)."SMA"
## 1) and close is greater than SimpleMovingAvg("length" = 150)."SMA"
## 5) and close is greater than SimpleMovingAvg("length" = 50)."SMA"
## 6) and price > x
## 7) and price > y
##########################################################################################################################

## Code Start

def lo = Lowest(low, range);
def hi = Highest(high, range);

#The current stock price is at least 30 percent above its 52-week low.
#def x = 1.3 * lo; #30% above its 52-week low
#def x = 2.0 * lo; #100% above its 52-week low
def x = (100 + percentAbv52Wk) / 100 * lo;

#The current stock price is within at least 25 percent of its 52-week high
#def y = 0.75 * hi; #25% of its 52-week high
#def y = 0.80 * hi; #20% of its 52-week high
#def y = 0.90 * hi; #10% of its 52-week high
def y = percentAtLeast52Wk / 100 * hi;

# The below reads as SimpleMovingAvg("length" = 200) is greater than SimpleMovingAvg("length" = 200) from 60 agg-bars ago.
#(Average(close, length) > Average(close, length)[LookBack])

def one =  SimpleMovingAvg("length" = 150)."SMA" is greater than SimpleMovingAvg("length" = 200)."SMA"
and SimpleMovingAvg("length" = 50)."SMA" is greater than SimpleMovingAvg("length" = 150)."SMA"
and SimpleMovingAvg("length" = 50)."SMA" is greater than SimpleMovingAvg("length" = 200)."SMA";
def two =  close is greater than SimpleMovingAvg("length" = 200)."SMA"
and close is greater than SimpleMovingAvg("length" = 150)."SMA"
and close is greater than SimpleMovingAvg("length" = 50)."SMA";
def three = average(close, 200)>average(close,200)[25];
def six = (close-lowest(low,252))/lowest(low,252)>=.30;
def seven = (highest(high,252)-close)/close<=.25;

plot scan = (Average(close, length) > Average(close, length)[LookBack])
and one 
and two 
and three
and six
and seven
and price >= x
and price >= y
;