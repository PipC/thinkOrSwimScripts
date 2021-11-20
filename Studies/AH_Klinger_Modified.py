declare lower;

input MALength = 13;
input PaintBars = NO;

def DM = high - low;
def Trend = if hlc3 > hlc3[1] then 1 else -1;
def CM = DM + if Trend == Trend[1] then CM[1] else DM[1];
def VForce = if CM != 0 then Trend * 100 * volume * AbsValue(2 * DM / CM - 1) else VForce[1];
plot KVOsc = ExpAverage(VForce, 34) - ExpAverage(VForce, 55);
plot TriggerLine = Average(KVOsc, MALength);

plot ZeroLine = 0;

plot KVOH = KVOsc - Average(KVOsc, MALength);


KVOH.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
KVOH.SetLineWeight(3);
KVOH.DefineColor("Positive and Up", Color.LIGHT_GREEN);
KVOH.DefineColor("Positive and Down", Color.DARK_GREEN);
KVOH.DefineColor("Negative and Down", Color.LIGHT_RED);
KVOH.DefineColor("Negative and Up", Color.DARK_RED);
KVOH.AssignValueColor(if KVOH >= 0 then if KVOH > KVOH[1] then KVOH.Color("Positive and Up") else KVOH.Color("Positive and Down") else if KVOH < KVOH[1] then KVOH.Color("Negative and Down") else KVOH.Color("Negative and Up"));
KVOH.SetLineWeight(5);

KVOsc.SetLineWeight(2);
KVOsc.DefineColor("Positive and Up", Color.Blue);
KVOsc.DefineColor("Positive and Down", Color.WHITE);
KVOsc.DefineColor("Negative and Down", Color.RED);
KVOsc.DefineColor("Negative and Up", Color.WHITE);

KVOsc.AssignValueColor(if KVOsc >= TriggerLine then if KVOsc > KVOsc[1] then KVOsc.Color("Positive and Up") else KVOsc.Color("Positive and Down") else if KVOsc < KVOsc[1] then KVOsc.Color("Negative and Down") else KVOsc.Color("Negative and Up"));

KVOsc.SetDefaultColor(GetColor(8));

TriggerLine.SetDefaultColor(GetColor(1));
TriggerLine.SetLineWeight(2);

TriggerLine.DefineColor("Positive and Up", Color.YELLOW);
TriggerLine.DefineColor("Positive and Down", Color.Gray);
TriggerLine.DefineColor("Negative and Down", Color.Gray);
TriggerLine.DefineColor("Negative and Up", Color.Yellow);

TriggerLine.AssignValueColor(if TriggerLine >= 0 then if TriggerLine > TriggerLine[1] then TriggerLine.Color("Positive and Up") else TriggerLine.Color("Positive and Down") else if TriggerLine < TriggerLine[1] then TriggerLine.Color("Negative and Down") else TriggerLine.Color("Negative and Up"));
##########################################################

ZeroLine.SetDefaultColor(GetColor(5));

#AssignPriceColor(if KVOsc >= TriggerLine and PaintBars == yes then KVOH.color("Positive") else if KVOsc <= TriggerLine and PaintBars == yes then KVOH.color("Negative") else Color.CURRENT);


#plot highLine = HighestAll(if IsNaN(close[-1]) then high(period = "Day") else Double.NaN);

#plot lowLine = LowestAll(if IsNaN(close[-1]) then low(period = "Day") else Double.NaN);

##########################################################

plot Long = if KVOsc crosses above TriggerLine then TriggerLine else Double.NaN;
plot Short = if KVOsc crosses below TriggerLine then TriggerLine else Double.NaN;
Long.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
Short.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
Long.SetLineWeight(3);
Short.SetLineWeight(3);
Long.SetDefaultColor(Color.Yellow);
Short.SetDefaultColor(Color.Pink);

##########################################################
