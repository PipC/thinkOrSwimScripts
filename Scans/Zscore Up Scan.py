input price = close;
input length = 20;
input ZavgLength = 20;

#Initialize values
def oneSD = stdev(price,length);
def avgClose = simpleMovingAvg(price,length);
# def ofoneSD = oneSD*price[1];
def Zscorevalue = ((price-avgClose)/oneSD);
# def avgZv = average(Zscorevalue,20);

#Compute and plot Z-Score

DEF avgZscore = average(Zscorevalue,ZavgLength);
#avgZscore.setPaintingStrategy(paintingStrategy.LINE);

DEF Zscore = ((price-avgClose)/oneSD);


def condition1 = zscore crosses above avgZscore and avgzscore < -.75;
# def condition2 = zscore crosses below avgZscore and avgzscore > .75;

# Plot arrows
plot UArrow = if condition1 is true then 1 else 0;



