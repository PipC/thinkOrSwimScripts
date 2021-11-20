## START CODE
# ref https://usethinkscript.com/threads/harmonic-patterns-indicator-for-thinkorswim-zigzag-bat-butterfly-abcd.69/
## ZigZagSign TOMO modification, v0.2 written by Linus @Thinkscripter Lounge adapted from
## Thinkorswim ZigZagSign Script
## Mods by Larry to add chart bubbles & horizontal lines
## Mod by Larry to add Chart Bubble  for HH/LL indication
## 7.1.13 Added Volume Wave (similar looking to other Wave Volume studies) as a lower study. To use this, just load 2 versions of this study and designate one for the upper panel and one for the lower panel. For the lower panel, select input showvolumewave == yes. For the upper panel input showvolumewave ==no and then select the other options as usual.
##7.27.13 Added 2nd Zigzag from new TOS ZigZagHighLow indicator (can see smaller zigzags if used)
##8.24.13 Mod by Lar to add Supply/Demand Levels (Red Zones are Supply, Green are Demand), ability to enter percentage, amount or atr for reversalAmount (using the greater of the three at any reversal)

def   price               = close;
def   priceH              = high;    # swing high
def   priceL              = low;     # swing low
input ATRreversalfactor   = 3.0;#Hint ATRreversalfactor: 3 is standard, adjust to whatever instrument/timeframe you are trading.
input ATRlength           = 5;#Hint ATRlength: 5 is standard, adjust to whatever instrument/timeframe you are trading
input useatr              = yes;#Hint useatr: set to no to use manual zigzagamount for reversalamount before a new zigzag is drawn. The ATR will still be used for auto fibs.
input zigzagpercent       = 0.20;
input zigzagamount        = .15;
def ATR                   = reference ATR(length = ATRlength);
#def reversalAmount        = if useatr == yes then ATRreversalfactor * ATR else zigzagamount;
def reversalAmount        = if (close * zigzagpercent / 100) > Max(zigzagamount < ATRreversalfactor * ATR, zigzagamount) then (close * zigzagpercent / 100) else if zigzagamount < ATRreversalfactor * ATR then ATRreversalfactor * ATR else zigzagamount;
#addlabel(yes,(zigzagpercent*close/100)+"   "+zigzagamount+"  "+(atrreversalfactor*ATR));
input showsupplydemand    = no;
input showhorizontal      = no;#Hint showhorizontal: set yes to display horizontal lines at low/high of each zigzag high/low reversal bar to use for possible entry point
input bubbleoffset        = .0005;
input pricecolor          = no;
input showVolumeWave      = no;#Hint showvolumewave: set all other bubbles to no if showvolumeWave is selected yes
input showcombinedbubble  = no;#Hint showcombinedbubble: set other bubbles contained in combined to no if combined selected yes
input showcombinedbubble2 = no;#Hint showcombinedbubble2: shorter version. set other bubbles contained in combined to no if combined selected yes
input showBubbleshhll     = no;
input showBubblesprice    = no;
input showBubbleschange   = no;
input showBubblesbarcount = no;
input showBubblesVolume   = no;
input showFibLines        = no;
input showFibExtLines     = yes;
input usemanualfibskip    = no;#Hint usemanualfibskip: Select no to use preprogrammed fibskip amounts. Select no, to use the amount entered at input fibskip.
input fibskip             = .50;#Hint fibskip: Set input usemanualfibskip == yes to use this amount versus preprogrammed amounts. Standard is 1.0. This is percentage difference between fib high and low before a new fib grid created.
input showBubblesfibratio = no;
input showFibLabel        = no;#Hint showfibLabel: Select yes to show label of current fib level as of last price
input fib1level           = .236;
input fib2level           = .382;
input fibMlevel           = .500;
input fib3level           = .618;
input fib4level           = .786;
input showArrows          = no;
input useAlerts           = no;
input showconfirmedLabel  = yes;#Hint showconfirmedLabel: Select yes to see current status of ZigZag, either unconfirmed or confirmed
input showBubblewaveC     = no;#Hint showbubblewave123: Not complete, work in progress

#Assert(reversalAmount > 0, "'reversal amount' should be positive: " + reversalAmount);

#Original TOS ZigZag code Modified by Linus
def barNumber = BarNumber();
def barCount = HighestAll(If(IsNaN(price), 0, barNumber));

rec state = {default init, undefined, uptrend, downtrend};
rec minMaxPrice;

if (GetValue(state, 1) == GetValue(state.init, 0)) {
    minMaxPrice = price;
    state = state.undefined;
} else if (GetValue(state, 1) == GetValue(state.undefined, 0)) {
    if (price <= GetValue(minMaxPrice, 1) - reversalAmount) {
        state = state.downtrend;
        minMaxPrice = priceL;
    } else if (price >= GetValue(minMaxPrice, 1) + reversalAmount) {
        state = state.uptrend;
        minMaxPrice = priceH;
    } else {
        state = state.undefined;
        minMaxPrice = GetValue(minMaxPrice, 1);
    }
} else if (GetValue(state, 1) == GetValue(state.uptrend, 0)) {
    if (price <= GetValue(minMaxPrice, 1) - reversalAmount) {
        state = state.downtrend;
        minMaxPrice = priceL;
    } else {
        state = state.uptrend;
        minMaxPrice = Max(priceH, GetValue(minMaxPrice, 1));
    }
} else {
    if (price >= GetValue(minMaxPrice, 1) + reversalAmount) {
        state = state.uptrend;
        minMaxPrice = priceH;
    } else {
        state = state.downtrend;
        minMaxPrice = Min(priceL, GetValue(minMaxPrice, 1));
    }
}

def isCalculated = GetValue(state, 0) != GetValue(state, 1) and barNumber >= 1;
def futureDepth =  barCount - barNumber;
def tmpLastPeriodBar;
if (isCalculated) {
    if (futureDepth >= 1 and GetValue(state, 0) == GetValue(state, -1)) {
        tmpLastPeriodBar = fold lastPeriodBarI = 2 to futureDepth + 1 with lastPeriodBarAcc = 1
            while lastPeriodBarAcc > 0
            do if (GetValue(state, 0) != GetValue(state, -lastPeriodBarI))
                then -lastPeriodBarAcc
                else lastPeriodBarAcc + 1;
    } else {
        tmpLastPeriodBar = 0;
    }
} else {
    tmpLastPeriodBar = Double.NaN;
}

def lastPeriodBar = if (!IsNaN(tmpLastPeriodBar)) then -AbsValue(tmpLastPeriodBar) else -futureDepth;

rec currentPriceLevel;
rec currentPoints;
if (state == state.uptrend and isCalculated) {
    currentPriceLevel =
        fold barWithMaxOnPeriodI = lastPeriodBar to 1 with barWithMaxOnPeriodAcc = minMaxPrice
            do Max(barWithMaxOnPeriodAcc, GetValue(minMaxPrice, barWithMaxOnPeriodI));
    currentPoints =
        fold maxPointOnPeriodI = lastPeriodBar to 1 with maxPointOnPeriodAcc = Double.NaN
            while IsNaN(maxPointOnPeriodAcc)
            do if (GetValue(priceH, maxPointOnPeriodI) == currentPriceLevel)
                then maxPointOnPeriodI
                else maxPointOnPeriodAcc;
} else if (state == state.downtrend and isCalculated) {
    currentPriceLevel =
        fold barWithMinOnPeriodI = lastPeriodBar to 1 with barWithMinOnPeriodAcc = minMaxPrice
            do Min(barWithMinOnPeriodAcc, GetValue(minMaxPrice, barWithMinOnPeriodI));
    currentPoints =
        fold minPointOnPeriodI = lastPeriodBar to 1 with minPointOnPeriodAcc = Double.NaN
            while IsNaN(minPointOnPeriodAcc)
            do if (GetValue(priceL, minPointOnPeriodI) == currentPriceLevel)
                then minPointOnPeriodI
                else minPointOnPeriodAcc;
} else if (!isCalculated and (state == state.uptrend or state == state.downtrend)) {
    currentPriceLevel = GetValue(currentPriceLevel, 1);
    currentPoints = GetValue(currentPoints, 1) + 1;
} else {
    currentPoints = 1;
    currentPriceLevel = GetValue(price, currentPoints);
}

plot "ZZ$" = if (barNumber == barCount or barNumber == 1) then if state == state.uptrend then priceH else priceL else if (currentPoints == 0) then currentPriceLevel else Double.NaN;

rec zzSave =  if !IsNaN("ZZ$") then if (barNumber == barCount or barNumber == 1) then if IsNaN(barNumber[-1]) and  state == state.uptrend then priceH else priceL else currentPriceLevel else GetValue(zzSave, 1);
def chg = (if barNumber == barCount and currentPoints < 0 then priceH else if barNumber == barCount and currentPoints > 0 then priceL else currentPriceLevel) - GetValue(zzSave, 1);

def isUp = chg >= 0;
rec isConf =  AbsValue(chg) >= reversalAmount or (IsNaN(GetValue("ZZ$", 1)) and GetValue(isConf, 1)) ;
rec isconfreal = if isConf[1] == 0 and isConf then close else Double.NaN;
"ZZ$".EnableApproximation();
"ZZ$".DefineColor("Up Trend", Color.GREEN);
"ZZ$".DefineColor("Down Trend", Color.RED);
"ZZ$".DefineColor("Undefined", Color.YELLOW);
"ZZ$".AssignValueColor(if !isConf then "ZZ$".Color("Undefined") else if isUp then "ZZ$".Color("Up Trend") else "ZZ$".Color("Down Trend"));
"ZZ$".SetLineWeight(2);
DefineGlobalColor("Unconfirmed", Color.YELLOW);
DefineGlobalColor("Up", Color.GREEN);
DefineGlobalColor("Down", Color.RED);

#Store Previous Data
def zzsave1 = if !IsNaN(zzSave) then zzSave else zzsave1[1];
def zzsave2 = zzsave1;
rec priorzz1 = if zzsave2  != zzsave2[1]  then zzsave2[1]  else priorzz1[1];
rec priorzz2 = if priorzz1 != priorzz1[1] then priorzz1[1] else priorzz2[1];
rec priorzz3 = if priorzz2 != priorzz2[1] then priorzz2[1] else priorzz3[1];
rec priorzz4 = if priorzz3 != priorzz3[1] then priorzz3[1] else priorzz4[1];
rec priorzz5 = if priorzz4 != priorzz4[1] then priorzz4[1] else priorzz5[1];
rec priorzz6 = if priorzz5 != priorzz5[1] then priorzz5[1] else priorzz6[1];

rec upmove = if currentPoints == 0 and upmove[1] == 0 then 1 else if upmove[1] == 1  and currentPoints != 0  then 1 else 0;
rec dnmove = if currentPoints == 0 and upmove[1] == 1 then 1 else if dnmove[1] == 1 and currentPoints != 0  then 1 else 0;

def extfib1 = if zzSave == priceH then high - AbsValue(priorzz2 - priorzz1) * 1 else extfib1[1];
plot extfib100 = if showFibExtLines and currentPoints != 0 and upmove and !IsNaN(extfib1) then extfib1[1] else Double.NaN;
extfib100.SetPaintingStrategy(PaintingStrategy.DASHES);
extfib100.SetDefaultColor(CreateColor(250,0,0));
extfib100.SetLineWeight(1);
def extfib2 = if zzSave == priceH then high - AbsValue(priorzz2 - priorzz1) * 0.618 else extfib2[1];
plot extfib618 = if showFibExtLines and currentPoints != 0 and upmove and !IsNaN(extfib2) then extfib2[1] else Double.NaN;
extfib618.SetPaintingStrategy(PaintingStrategy.DASHES);
extfib618.SetDefaultColor(CreateColor(200,0,0));
extfib618.SetLineWeight(1);
def extfib3 = if zzSave == priceH then high - AbsValue(priorzz2 - priorzz1) * 1.618 else extfib3[1];
plot extfib1618 = if showFibExtLines and currentPoints != 0 and upmove and !IsNaN(extfib3) then extfib3[1] else Double.NaN;
extfib1618.SetPaintingStrategy(PaintingStrategy.DASHES);
extfib1618.SetDefaultColor(CreateColor(150,0,0));
extfib1618.SetLineWeight(1);
def extfib4 = if zzSave == priceH then high - AbsValue(priorzz2 - priorzz1) * 2.618 else extfib4[1];
plot extfib2618 = if showFibExtLines and currentPoints != 0 and upmove and !IsNaN(extfib4) then extfib4[1] else Double.NaN;
extfib2618.SetPaintingStrategy(PaintingStrategy.DASHES);
extfib2618.SetDefaultColor(CreateColor(100,0,0));
extfib2618.SetLineWeight(1);
def extfib1_ = if zzSave == priceL then low + AbsValue(priorzz2 - priorzz1) * 1 else extfib1_[1];
plot extfib100_ = if showFibExtLines and currentPoints != 0 and dnmove and !IsNaN(extfib1_) then extfib1_[1] else Double.NaN;
extfib100_.SetPaintingStrategy(PaintingStrategy.DASHES);
extfib100_.SetDefaultColor(CreateColor(0,250,0));
extfib100_.SetLineWeight(1);
def extfib2_ = if zzSave == priceL then low + AbsValue(priorzz2 - priorzz1) * 0.618 else extfib2_[1];
plot extfib618_ = if showFibExtLines and currentPoints != 0 and dnmove and !IsNaN(extfib2_) then extfib2_[1] else Double.NaN;
extfib618_.SetPaintingStrategy(PaintingStrategy.DASHES);
extfib618_.SetDefaultColor(CreateColor(0,200,0));
extfib618_.SetLineWeight(1);
def extfib3_ = if zzSave == priceL then low + AbsValue(priorzz2 - priorzz1) * 1.618 else extfib3_[1];
plot extfib1618_ = if showFibExtLines and currentPoints != 0 and dnmove and !IsNaN(extfib3_) then extfib3_[1] else Double.NaN;
extfib1618_.SetPaintingStrategy(PaintingStrategy.DASHES);
extfib1618_.SetDefaultColor(CreateColor(0,150,0));
extfib1618_.SetLineWeight(1);
def extfib4_ = if zzSave == priceL then low + AbsValue(priorzz2 - priorzz1) * 2.618 else extfib4_[1];
plot extfib2618_ = if showFibExtLines and currentPoints != 0 and dnmove and !IsNaN(extfib4_) then extfib4_[1] else Double.NaN;
extfib2618_.SetPaintingStrategy(PaintingStrategy.DASHES);
extfib2618_.SetDefaultColor(CreateColor(0,100,0));
extfib2618_.SetLineWeight(1);

AddChartBubble(showFibExtLines and !IsNaN(extfib1[7]) and IsNaN(extfib1[6]), extfib1[8], "1.0", Color.RED, no);
AddChartBubble(showFibExtLines and !IsNaN(extfib2[7]) and IsNaN(extfib2[6]), extfib2[8], "0.6", Color.RED, no);
AddChartBubble(showFibExtLines and !IsNaN(extfib3[7]) and IsNaN(extfib3[6]), extfib3[8], "1.6", Color.RED, no);
AddChartBubble(showFibExtLines and !IsNaN(extfib4[7]) and IsNaN(extfib4[6]), extfib4[8], "2.6", Color.RED, no);
AddChartBubble(showFibExtLines and !IsNaN(extfib1_[7]) and IsNaN(extfib1_[6]), extfib1_[8], "1.0", Color.GREEN, yes);
AddChartBubble(showFibExtLines and !IsNaN(extfib2[7]) and IsNaN(extfib2_[6]), extfib2_[8], "0.6", Color.GREEN, yes);
AddChartBubble(showFibExtLines and !IsNaN(extfib3_[7]) and IsNaN(extfib3_[6]), extfib3_[8], "1.6", Color.GREEN, yes);
AddChartBubble(showFibExtLines and !IsNaN(extfib4_[7]) and IsNaN(extfib4_[6]), extfib4_[8], "2.6", Color.GREEN, yes);
#addlabel(yes,concat("Prior High: ", (if priorzz1>priorzz2 then priorzz1 else priorzz2))+concat(" Prior Low : ", (if priorzz1<priorzz2 then priorzz1 else priorzz2))+concat(" 2 Highs Ago: ", (if priorzz3>priorzz4 then priorzz3 else priorzz4))+concat(" 2 Lows Ago: ", (if priorzz3<priorzz4 then priorzz3 else priorzz4))+concat(" 3 Highs Ago: ", (if priorzz5>priorzz6 then priorzz5 else priorzz6))+concat(" 3 Lows Ago: ", (if priorzz5<priorzz6 then priorzz5 else priorzz6)));

#Horizontal Lines Added
def zzhigh = if zzSave == priceH then low else zzhigh[1];
plot zzupline = if showhorizontal == yes then zzhigh else Double.NaN;
zzupline.SetPaintingStrategy(PaintingStrategy.POINTS);
zzupline.SetDefaultColor(color = Color.RED);
zzupline.SetLineWeight(1);

def zzlow = if zzSave == priceL then high else zzlow[1];
plot zzlowline = if showhorizontal == yes then zzlow else Double.NaN;
zzlowline.SetPaintingStrategy(PaintingStrategy.POINTS);
zzlowline.SetDefaultColor(color = Color.GREEN);
zzlowline.SetLineWeight(1);

#Higher/Lower/Equal High, Higher/Lower/Equal Low
def xxhigh = if zzSave == priceH  then  high else xxhigh[1];
def chghigh = high - xxhigh[1];
def xxlow = if zzSave == priceL then low else xxlow[1];
def chglow = low - xxlow[1];

AddChartBubble(showBubbleshhll and !IsNaN("ZZ$") and barNumber != 1, if isUp then high * (1 + bubbleoffset)  else low * (1 - bubbleoffset)  , if isUp and chghigh > 0 then "HH" else if isUp and chghigh < 0 then "LH" else if isUp then "EH" else if !isUp and chglow > 0 then "HL" else if !isUp and chglow < 0 then "LL" else "EL", if isUp and chghigh > 0 then Color.GREEN else if isUp and chghigh < 0 then Color.RED else if isUp then Color.GREEN else if !isUp and chglow > 0 then Color.GREEN else if !isUp and chglow < 0 then Color.RED else Color.RED, isUp);

#Price at High/Low
AddChartBubble(showBubblesprice and !IsNaN("ZZ$") and barNumber != 1, if isUp then high * (1 + bubbleoffset)  else low * (1 - bubbleoffset)  , (if barNumber == barCount and currentPoints < 0 then "$" + priceH else if barNumber == barCount and currentPoints > 0 then "$" + priceL else "$" + currentPriceLevel)  , if isUp and chghigh > 0 then Color.GREEN else if isUp and chghigh < 0 then Color.RED else if isUp then Color.GREEN else if !isUp and chglow > 0 then Color.GREEN else if !isUp and chglow < 0 then Color.RED else Color.RED, isUp);

#Price Change between zigzags
AddChartBubble(showBubbleschange and !IsNaN("ZZ$") and barNumber != 1, if isUp then high * (1 + bubbleoffset)  else low * (1 - bubbleoffset)   , "$" + chg , if isUp and chghigh > 0 then Color.GREEN else if isUp and chghigh < 0 then Color.RED else if isUp then Color.GREEN else if !isUp and chglow > 0 then Color.GREEN else if !isUp and chglow < 0 then Color.RED else Color.RED, isUp);

#Bar Count between zigzags
#Bar Count
rec zzcount = if zzSave[1] != zzSave then 1 else if zzSave[1] == zzSave then zzcount[1] + 1 else 0;
def zzcounthilo   =  if zzcounthilo[1] == 0 and (zzSave == priceH or zzSave == priceL) then 1 else if zzSave == priceH or zzSave == priceL then zzcounthilo[1] + 1 else zzcounthilo[1];
def zzhilo = if zzSave == priceH or zzSave == priceL then zzcounthilo else zzcounthilo + 1;

def zzcounthigh = if zzSave == priceH then zzcount[1] else Double.NaN;
def zzcountlow =  if zzSave == priceL then zzcount[1] else Double.NaN;

AddChartBubble(showBubblesbarcount and !IsNaN("ZZ$") and barNumber != 1, if isUp then high * (1 + bubbleoffset)  else low * (1 - bubbleoffset)  , if zzSave == priceH then zzcounthigh else zzcountlow, if isUp and chghigh > 0 then Color.GREEN else if isUp and chghigh < 0 then Color.RED else if isUp then Color.GREEN else if !isUp and chglow > 0 then Color.GREEN else if !isUp and chglow < 0 then Color.RED else Color.RED, if isUp then yes else no );

#Supply Demand Areas
def cp = if currentPoints == 0 then 1 else if currentPoints != 0 then cp[1] + 1 else 0;
#def zzhigh = if zzSave == priceH  and (sum(close[-1]>close[-2],10)>=5 or cp[-30]>=30) then l else zzhigh[1];
def sdhigh = if zzSave == priceH then low else sdhigh[1];
plot sdupline = if showsupplydemand == no then Double.NaN else sdhigh[1];
sdupline.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
sdupline.SetDefaultColor(color = Color.RED);
sdupline.SetLineWeight(1);
#def zzhigh1 = if zzsave == priceH and (sum(close[-1]>close[-2],10)>=5 or cp[-30]>=30) then h else zzhigh1[1];
def sdhigh1 = if zzSave == priceH then high else sdhigh1[1];
plot sdupline1 = if showsupplydemand == no then Double.NaN else sdhigh1[1];
sdupline1.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
sdupline1.SetDefaultColor(color = Color.RED);
sdupline1.SetLineWeight(1);
AddCloud(if showsupplydemand then sdupline1 else Double.NaN, sdupline, Color.GRAY, Color.GRAY);

#def zzlow = if zzSave == priceL and (sum(close[-1]<close[-2],10)>=5 or or cp[-30]>=30) then h else zzlow[1];
def sdlow = if zzSave == priceL then high else sdlow[1];
plot sdlowline = if showsupplydemand == no then Double.NaN else sdlow[1];
sdlowline.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
sdlowline.SetDefaultColor(color = Color.GREEN);
sdlowline.SetLineWeight(1);
#def zzlow1 = if zzSave == priceL and (sum(close[-1]<close[-2],10)>=5 or or cp[-30]>=30) then l else zzlow1[1];
def sdlow1 = if zzSave == priceL then low else sdlow1[1];
plot sdlowline1 = if showsupplydemand == no then Double.NaN else sdlow1[1];
sdlowline1.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
sdlowline1.SetDefaultColor(color = Color.GREEN);
sdlowline1.SetLineWeight(1);
AddCloud(if showsupplydemand then sdlowline1 else Double.NaN, sdlowline, Color.GRAY, Color.GRAY);

#Fibs
def fibskipit = if usemanualfibskip == no then if close > 800 then .25 else .5 else fibskip;
def zzfibh    = if zzSave == priceH and AbsValue(zzSave - zzSave[1]) > close * fibskipit * .01 then high  else zzfibh[1];
def zzfibl    = if zzSave == priceL and AbsValue(zzSave - zzSave[1]) > close * fibskipit * .01 then low  else zzfibl[1];
def range = zzfibh - zzfibl;
plot fibH = if showFibLines == no then Double.NaN else zzfibh;
plot fibL = if showFibLines == no then Double.NaN else zzfibl;
plot fibM = if showFibLines == no then Double.NaN else zzfibl + range * fibMlevel;
plot fib1 = if showFibLines == no then Double.NaN else zzfibl + range * fib1level;
plot fib2 = if showFibLines == no then Double.NaN else zzfibl + range * fib2level;
plot fib3 = if showFibLines == no then Double.NaN else zzfibl + range * fib3level;
plot fib4 = if showFibLines == no then Double.NaN else zzfibl + range * fib4level;
fibH.SetPaintingStrategy(PaintingStrategy.DASHES);
fibL.SetPaintingStrategy(PaintingStrategy.DASHES);
fibH.SetLineWeight(2);
fibL.SetLineWeight(2);
fibM.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
fib1.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
fib2.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
fib3.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
fib4.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
fibH.SetDefaultColor(Color.GREEN);
fibL.SetDefaultColor(Color.RED);
fibM.SetDefaultColor(Color.WHITE);
fib1.SetDefaultColor(Color.CYAN);
fib2.SetDefaultColor(Color.YELLOW);
fib3.SetDefaultColor(Color.YELLOW);
fib4.SetDefaultColor(Color.CYAN);

AddLabel(showFibLabel, Concat( "Current Fib Level ", AsPercent((close - zzfibl) / (range))), if close > zzfibl then Color.GREEN else if zzfibh == close then Color.WHITE else Color.RED);

AddChartBubble(showBubblesfibratio and !IsNaN("ZZ$") and barNumber != 1, if isUp then high * (1 + bubbleoffset)  else low * (1 - bubbleoffset)   , if isUp then AsPercent((high - zzfibl) / (range)) else AsPercent((low - zzfibl) / range), if isUp and chghigh > 0 then Color.GREEN else if isUp and chghigh < 0 then Color.RED else if isUp then Color.GREEN else if !isUp and chglow > 0 then Color.GREEN else if !isUp and chglow < 0 then Color.RED else Color.RED, isUp);

#Wave C - This is still in development
def wave    = if chghigh < 0 and isUp or chglow > 0 and !isUp then 2 else 0;

AddChartBubble(showBubblewaveC and !IsNaN("ZZ$") and barNumber != 1 and wave == 2, if isUp then high * (1 + bubbleoffset)  else low * (1 - bubbleoffset)  , Concat("Wave C", ""), if isUp and chghigh > 0 then Color.GREEN else if isUp and chghigh < 0 then Color.RED else if isUp then Color.GREEN else if !isUp and chglow > 0 then Color.GREEN else if !isUp and chglow < 0 then Color.RED else Color.RED, isUp);

#Price Color
AssignPriceColor(if pricecolor then if !isConf then "ZZ$".Color("Undefined") else if isUp then "ZZ$".Color("Up Trend") else "ZZ$".Color("Down Trend") else Color.CURRENT);
plot Data = if pricecolor and !isConf then if open > close then low else high else Double.NaN;
Data.SetPaintingStrategy(PaintingStrategy.POINTS);
Data.AssignValueColor(if open > close then Color.RED else Color.GREEN);
Data.SetLineWeight(4);

#Volume at Reversals
def vol = if BarNumber() == 0 then 0 else volume + vol[1];
def vol1 = if BarNumber() == 1 then volume else vol1[1];
def xxvol = if zzSave == priceH or zzSave == priceL then TotalSum(volume) else xxvol[1];
def chgvol =  if xxvol - xxvol[1] + vol1 == vol then vol else xxvol - xxvol[1];
plot cvol = chgvol;
cvol.AssignValueColor(if barCount == barNumber  or !isConf then GlobalColor("Unconfirmed") else if isUp then GlobalColor("Up") else GlobalColor("Down"));
cvol.SetHiding(showVolumeWave == no);
rec zzvol = if zzhilo[1] != zzhilo then 0 else zzvol[1] + volume;
plot zzvolupdn = if showVolumeWave then zzvol else Double.NaN;
zzvolupdn.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
zzvolupdn.AssignValueColor( if barCount == barNumber  or !isConf then GlobalColor("Unconfirmed") else if isUp then GlobalColor("Up") else GlobalColor("Down"));
plot zzt = if showVolumeWave then if zzSave == priceH or zzSave == priceL then chgvol else Double.NaN else Double.NaN;
zzt.EnableApproximation();
zzt.AssignValueColor( if barCount == barNumber  or !isConf then GlobalColor("Unconfirmed") else if isUp then GlobalColor("Up") else GlobalColor("Down"));
zzt.SetLineWeight(2);

AddChartBubble(showVolumeWave and !IsNaN("ZZ$") and barNumber != 1, chgvol , chgvol, if isUp then Color.GREEN else Color.RED, yes);

AddChartBubble(showVolumeWave and !IsNaN("ZZ$") and barNumber != 1, chgvol  , if zzSave == priceH then zzcounthigh else zzcountlow, if isUp and chghigh > 0 then Color.GREEN else if isUp and chghigh < 0 then Color.RED else if isUp then Color.GREEN else if !isUp and chglow > 0 then Color.GREEN else if !isUp and chglow < 0 then Color.RED else Color.RED, yes );

AddChartBubble(showBubblesVolume and !IsNaN("ZZ$") and barNumber != 1, if isUp then priceH * (1 + bubbleoffset)  else priceL * (1 - bubbleoffset), chgvol, if isUp then Color.GREEN else Color.RED, if isUp then yes else no );

#Combined Bubbles
AddChartBubble(showcombinedbubble and !IsNaN("ZZ$") and barNumber != 1, if isUp then high * (1 + bubbleoffset)  else low * (1 - bubbleoffset)  , Concat("", if isUp and chghigh > 0 then "HH" else if isUp and chghigh < 0 then "LH" else if isUp then "EH" else if !isUp and chglow > 0 then "HL" else if !isUp and chglow < 0 then "LL" else "EL") + "\n" + Concat("", if barNumber == barCount and currentPoints < 0 then "$" + priceH else if barNumber == barCount and currentPoints > 0 then "$" + priceL else "$" + currentPriceLevel) + "\n$" + chg + "\n" + Concat("", if chgvol != 0 or IsNaN(chgvol) then if isUp and chghigh > 0 then chgvol else if isUp and chghigh < 0 then chgvol else if isUp then chgvol else if !isUp and chglow > 0 then chgvol else if !isUp and chglow < 0 then chgvol else chgvol else Double.NaN) + "\n" + Concat("", if zzSave == priceH then zzcounthigh else zzcountlow) + "\n" + if isUp then AsPercent((high - zzfibl) / (range)) else AsPercent((low - zzfibl) / range), if isUp and chghigh > 0 then Color.GREEN else if isUp and chghigh < 0 then Color.RED else if isUp then Color.GREEN else if !isUp and chglow > 0 then Color.GREEN else if !isUp and chglow < 0 then Color.RED else Color.RED, if isUp then yes else no );

AddChartBubble(showcombinedbubble2 and !IsNaN("ZZ$") and barNumber != 1, if isUp then high * (1 + bubbleoffset)  else low * (1 - bubbleoffset)  , "$" + chg + "\n" + Concat("", if barNumber == barCount and currentPoints < 0 then "$" + priceH else if barNumber == barCount and currentPoints > 0 then "$" + priceL else "$" + currentPriceLevel) , if isUp and chghigh > 0 then Color.GREEN else if isUp and chghigh < 0 then Color.RED else if isUp then Color.GREEN else if !isUp and chglow > 0 then Color.GREEN else if !isUp and chglow < 0 then Color.RED else Color.RED, if isUp then yes else no );

#Showlabel for Confirmed/Unconfirmed Status of Current Zigzag
AddLabel(showconfirmedLabel and barNumber != 1, (if isConf then "Confirmed " else "Unconfirmed ") + "ZigZag: " + chg, if !isConf then GlobalColor("Unconfirmed") else if isUp then GlobalColor("Up") else GlobalColor("Down"));

#Arrows
def zzL = if !IsNaN("ZZ$") and state == state.downtrend then priceL else GetValue(zzL, 1);
def zzH = if !IsNaN("ZZ$") and state == state.uptrend then priceH else GetValue(zzH, 1);
def dir = CompoundValue(1, if zzL != zzL[1] then 1 else if zzH != zzH[1] then -1 else dir[1], 0);
def signal = CompoundValue(1,
    if dir > 0 and low > zzL then
        if signal[1] <= 0 then 1 else signal[1]
    else if dir < 0 and high < zzH then
        if signal[1] >= 0 then -1 else signal[1]
    else signal[1]
, 0);
plot U1 = showArrows and signal > 0 and signal[1] <= 0;
U1.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_UP);
U1.SetDefaultColor(Color.GREEN);
U1.SetLineWeight(5);

plot isconfdn = if showArrows and !isUp and isconfreal then high + .05 else Double.NaN;
isconfdn.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN);
isconfdn.SetLineWeight(5);
isconfdn.SetDefaultColor(Color.WHITE);

plot isconfup = if showArrows and isUp and isconfreal then low - .05 else Double.NaN;
isconfup.SetPaintingStrategy(PaintingStrategy.ARROW_UP);
isconfup.SetLineWeight(5);
isconfup.SetDefaultColor(Color.WHITE);

plot D1 = showArrows and signal < 0 and signal[1] >= 0;
D1.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_DOWN);
D1.SetDefaultColor(Color.RED);
D1.SetLineWeight(5);

#Alerts
def EH_EL = if isUp and chghigh > 0 then 1 else if isUp and chghigh < 0 then 1 else if isUp then 2 else if !isUp and chglow > 0 then 1 else if !isUp and chglow < 0 then 1 else 3;
Alert(useAlerts and EH_EL == 2, "Even High", Alert.BAR, Sound.Ding);
Alert(useAlerts and EH_EL == 3, "Even Low", Alert.BAR, Sound.Ding);
Alert(useAlerts and U1, "ZIG-UP", Alert.BAR, Sound.Bell);
Alert(useAlerts and D1, "ZAG-DOWN", Alert.BAR, Sound.Chimes);
Alert(useAlerts and U1, "ZIG-UP", Alert.BAR, Sound.Bell);

#Additional Zigzag from TOS zigzaghighlow version using different ATR setting
input zzotherpriceh   = high;
input zzotherpricel   = low;
input zzotherperrev   = 0.2;
input zzotherabsrev   = 0.3;
input zzotheratrrev   = 5.0;
input zzotheratrlen   = 5;
input showotherbubble = no;
plot zzother = reference ZigZagHighLow(zzotherpriceh, zzotherpricel,  zzotherperrev, zzotherabsrev, "atr length" = zzotheratrlen, "atr reversal" = zzotheratrrev).ZZ;
zzother.EnableApproximation();
zzother.SetDefaultColor(Color.CYAN);
zzother.SetLineWeight(3);
def zzoth = if !IsNaN(zzother) then zzother else zzoth[1];
def chgzzoth = AbsValue(zzoth[1] - zzoth);
AddChartBubble(showotherbubble and !IsNaN(zzother), if zzother == high then high * (1 + bubbleoffset)  else low * (1 - bubbleoffset)   , "$" + zzother + "\n$" + chgzzoth , Color.CYAN, if zzother == high then yes else no);
## END CODE