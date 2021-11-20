# Volatility-Based Trailing Stop
# By Prospectus @ http://readtheprospectus.wordpress.com
#
# Input Declarations:
#
input mult = 3.0; #Multiple of Average True Range to use
input length = 10; #Average True Range period
input alerttext="Volatity Trailing Stop Alert";
#
# Input to select Close or High/Low for switching:
#
input Style={default Close, HighLow};
def type;
switch(Style){
case Close:
type=1;
case HighLow:
type=0;
}
#
# Set parameters based on switch selection:
#
def uu=if type then close else high;
def ll=if type then close else low;
def na=double.nan;
#
# Calculate average range for volatility:
#
def atr = expaverage(high-low,length);
#
# Calculate initial short and long volatility stop values:
#
def svs =low+ceil(mult*atr/ticksize())*ticksize();
def lvs =high-ceil(mult*atr/ticksize())*ticksize();
#
# Set up the trailing stop logic:
#
rec shortvs=if isnan(shortvs[1]) then svs else if uu>shortvs[1] then svs else min(svs,shortvs[1]);
rec longvs=if isnan(longvs[1]) then lvs else if ll<longvs[1] then lvs else max(lvs,longvs[1]);
#
# Detect if we breached the trailing stop (close or high/low):
#
def longswitch=if uu>=shortvs[1] and uu[1]<shortvs[1] then 1 else 0;
def shortswitch=if ll<=longvs[1] and ll[1]>longvs[1] then 1 else 0;
#
# This logic remembers the direction and changes when needed:
#
rec direction= compoundvalue(1,if isnan(direction[1]) then 0 else
if direction[1]<=0 and longswitch then 1
else if direction[1]>=0 and shortswitch then -1
else direction[1],0);
#
# Set up the two plots. "na" makes the current value disappear
# if we?re trading in the opposite direction:
#
plot short=if direction>0 then na else shortvs;
plot long=if direction<0 then na else longvs;
#
# Formatting:
#
long.SetDefaultColor(color.dark_green);
long.SetStyle(curve.points);
long.SetLineWeight(3);
short.SetDefaultColor(color.dark_red);
short.SetStyle(curve.points);
short.SetLineWeight(3);
#
# Alerts:
#
#def alerttrigger= if direction[1]<=0 and longswitch then 1 else if direction[1]>=0 and shortswitch then 1 else 0;
def alertbuy= if direction[1]<=0 and longswitch then 1 else 0;
def alertsell= if direction[1]>=0 and shortswitch then 1 else 0;

# BLOCK CODE BELOW
input UseAlerts = {false, default true};
input AlertType = {default "BAR", "ONCE", "TICK"};
def at=AlertType;
input AlertSound = {"Bell", "Chimes", default "Ding", "NoSound", "Ring"};
#alert(alerttrigger AND UseAlerts, alerttext, if at==1 then Alert.ONCE else if at==2 then Alert.TICK else Alert.BAR, AlertSound);
alert(alertbuy AND UseAlerts, alerttext + " BUY STOCK", if at==1 then Alert.ONCE else if at==2 then Alert.TICK else Alert.BAR, AlertSound);
alert(alertsell AND UseAlerts, alerttext + " SELL STOCK", if at==1 then Alert.ONCE else if at==2 then Alert.TICK else Alert.BAR, AlertSound);

