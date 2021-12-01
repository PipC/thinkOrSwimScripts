#Created by Buy Low and given permission to share
#https://usethinkscript.com/threads/buylow_mp_smi_triggersystem-for-thinkorswim.1211/
#Renamed SMI Trigger System by Hguru
#IronRod Lower (may2015)- hull smoothed SMI with AwsomeOscillator histogram
#  ribbonStudy added- based on distance between midprice and ema(20)
# This is the smi-based lower Ive been using for quite a while:  I look for red on red and green on green for trading, where for example both the cloud is red and the smi dashed line is red.  Most reliable and easy to read signals Ive found.

#Look for the Dashed lines to turn color and Avg line to cross the Dash line for an entry but with more risk, next entry when avg line and dashed color line  crosses the 40 line. Next and probably the best risk is when the avg line and dashed line cross the zero line and Dashed line and cloud are the same color. I use this with a MACD crossover arrow setting at 5,13,4 or 5,13,6 or 3,13,6

#Not 100% on the ADX vertical line and histogram this might need to be adjusted to match a normal ADX line. The ADX vertical line can be turned off in the edit study. The hisotgram can be hidden as well.

#Use with the Upper matching MP_SMIandVerticalLineWarning System  here>>>  https://tos.mx/mDvxaX

#use setting gridsize .10 for/CL for tick charts and lower agg time frames and 1.0 for 1 hour and Daily.

declare lower;
#SMI engine
input gridsize = 1.0;
input aoscale = 1;
input smiscale = 100;
input audio = yes;
input label = yes;
input smilimit = 40.0;
input adxvline = yes;
input showBreakoutSignals = yes;
def aofast = 5;
def aoslow = 34;

def percentDLength = 3;
def percentKLength = 5;
def smihull = 3;
def anglescalingfactor = 1 / gridsize;

def min_low = Lowest(low, percentKLength);
def max_high = Highest(high, percentKLength);
def rel_diff = close - (max_high + min_low) / 2;
def diffx = max_high - min_low;

def avgrel = ExpAverage(ExpAverage(rel_diff, percentDLength), percentDLength);
def avgdiff = ExpAverage(ExpAverage(diffx, percentDLength), percentDLength);
#plot SMI =  if avgdiff != 0 then avgrel / (avgdiff / 2) * smiscale else 0;
plot SMI = ExpAverage( if avgdiff != 0 then avgrel / (avgdiff / 2) * smiscale else 0, 3);
#smi.setDefaultColor(getColor(1));
SMI.DefineColor("Up", Color.DARK_GREEN);
SMI.DefineColor("Down", Color.DOWNTICK);
SMI.DefineColor("flat", Color.GRAY);
SMI.AssignValueColor(if SMI >= SMI[1] then SMI.Color("up") else SMI.Color("down"));
SMI.SetLineWeight(4);
SMI.SetStyle(Curve.SHORT_DASH);

plot SMI1 = if avgdiff != 0 then avgrel / (avgdiff / 2) * smiscale else 0;
SMI1.SetDefaultColor(Color.GRAY);

plot upper = smilimit;
upper.SetDefaultColor(Color.BLUE);

plot lower = -smilimit;
lower.SetDefaultColor(Color.BLUE);

# Awesome Oscillator

plot Zero = 0;
Zero.SetDefaultColor(Color.DARK_GRAY);

#AddCloud(SMI, smilimit, Color.GREEN, Color.LIGHT_GRAY);
#AddCloud(-smilimit, SMI, Color.RED, Color.LIGHT_GRAY);
AddCloud(SMI, 0, Color.LIGHT_GREEN, CreateColor(255, 50, 50));

Alert(audio and SMI crosses above 0, "SMI Buy Buy Buy",  Alert.BAR, Sound.Ring);
Alert(audio and SMI crosses below 0, "SMI Sell Sell Sell",  Alert.BAR, Sound.Ring);
Alert(audio and SMI crosses smilimit, "", Alert.BAR, Sound.Bell);

plot UpSignal = if  SMI crosses above 0 then 0 else Double.NaN;
UpSignal.SetHiding(!showBreakoutSignals);
UpSignal.SetDefaultColor(Color.CYAN);
UpSignal.SetLineWeight(5);
UpSignal.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
UpSignal.HideTitle();
plot DownSignal = if  SMI crosses below 0 then 0 else Double.NaN;
DownSignal.SetHiding(!showBreakoutSignals);
DownSignal.SetDefaultColor(Color.YELLOW);
DownSignal.SetLineWeight(5);
DownSignal.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
DownSignal.HideTitle();

upper.SetDefaultColor(Color.RED);
upper.SetStyle(Curve.SHORT_DASH);
lower.SetDefaultColor(Color.UPTICK);
lower.SetStyle(Curve.SHORT_DASH);

#AddCloud(diff, SMI, Color.DOWNTICK, Color.UPTICK);
AddLabel(label and yes, "Dashed= SMI, cloud w/limit; Histogram = mAwesomeOscillator" , Color.BLUE);
 
#adx histogram
input length = 10;
input averageType = AverageType.WILDERS;

plot ADX = (DMI(length, averageType).ADX) - 18;
ADX.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
ADX.SetLineWeight(1);
ADX.DefineColor("Up", Color.BLUE);
ADX.DefineColor("Down", Color.DARK_ORANGE);
ADX.AssignValueColor(
      if ADX >= ADX[1] then ADX.Color("up")
 else ADX.Color("down"));
plot adxcaut = 20;
adxcaut.SetDefaultColor(Color.DARK_ORANGE);

AddVerticalLine (adxvline and ADX >= 1 and ADX < ADX[1] and ADX[1] > ADX[2], "mADX", Color.BLUE);
#alert(ADX1 >= 1 and ADX1 < ADX1[1] and ADX1[1] > ADX1[2], alert.bar, sound.bell);