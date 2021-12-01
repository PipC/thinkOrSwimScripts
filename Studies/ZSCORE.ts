declare lower;

input price = close;
input length = 20;
input ZavgLength = 20;

#Initialize values
def oneSD = stdev(price,length);
def avgClose = simpleMovingAvg(price,length);
def ofoneSD = oneSD*price[1];
def Zscorevalue = ((price-avgClose)/oneSD);
def avgZv = average(Zscorevalue,20);

#Compute and plot Z-Score

plot avgZscore = average(Zscorevalue,ZavgLength);
avgZscore.setPaintingStrategy(paintingStrategy.LINE);

plot Zscore = ((price-avgClose)/oneSD);
Zscore.setPaintingStrategy(paintingStrategy.HISTOGRAM);
Zscore.setLineWeight(2);
#Zscore.assignValueColor(if Zscore > 0 then color.green else color.red);

#Diff.SetDefaultColor(GetColor(5));
Zscore.DefineColor("Positive and Up", Color.DARK_GREEN);
Zscore.DefineColor("Positive and Down", Color.LIGHT_GREEN);
Zscore.DefineColor("Negative and Down", Color.DARK_RED);
Zscore.DefineColor("Negative and Up", Color.ORANGE);
Zscore.AssignValueColor(if Zscore >= 0 then if Zscore > Zscore[1] then Zscore.color("Positive and Up") else Zscore.color("Positive and Down") else if Zscore < Zscore[1] then Zscore.color("Negative and Down") else Zscore.color("Negative and Up"));



#This is an optional plot that will display the momentum of the Z-Score average
#plot momZAvg = (avgZv-avgZv[5]);

#Plot zero line and extreme bands
plot zero = 0;
plot two = 2;
plot one = 1;
plot negone = -1;
plot negtwo = -2;
def three = 3;
def negthree = -3;

zero.setDefaultColor(color.yellow);
two.setDefaultColor(color.red);
one.setDefaultColor(color.orange);
negone.setDefaultColor(color.light_green);
negtwo.setDefaultColor(color.green);

AddCloud(three, two, Color.dark_RED, Color.CURRENT);
AddCloud(negtwo, negthree, Color.dark_GREEN, Color.CURRENT);

