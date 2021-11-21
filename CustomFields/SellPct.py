#Current Sell %
#Inputs

input Show30DayAvg = yes;
input ShowTodayVolume = yes;
input ShowPercentOf30DayAvg = yes;
input UnusualVolumePercent = 200;
input Show30BarAvg = yes;
input ShowCurrentBar = yes;
input ShowPercentOf30BarAvg = yes;
input ShowSellVolumePercent = yes;

def O = open;
def H = high;
def C = close;
def L = low;
def V = volume;
def buying = V*(C-L)/(H-L);
def selling = V*(H-C)/(H-L);

# Selling Volume

#def SellVol = selling;

# Total Volume

#def BuyVol = volume;

#Volume Data

def volLast30DayAvg = (volume(period = "DAY")[1] + volume(period = "DAY")[2] + volume(period = "DAY")[3] + volume(period = "DAY")[4] + volume(period = "DAY")[5] + volume(period = "DAY")[6] + volume(period = "DAY")[7] + volume(period = "DAY")[8] + volume(period = "DAY")[9] + volume(period = "DAY")[10] + volume(period = "DAY")[11] + volume(period = "DAY")[12] + volume(period = "DAY")[13] + volume(period = "DAY")[14] + volume(period = "DAY")[15] + volume(period = "DAY")[16] + volume(period = "DAY")[17] + volume(period = "DAY")[18] + volume(period = "DAY")[19] + volume(period = "DAY")[20] + volume(period = "DAY")[21] + volume(period = "DAY")[22] + volume(period = "DAY")[23] + volume(period = "DAY")[24] + volume(period = "DAY")[25] + volume(period = "DAY")[26] + volume(period = "DAY")[27] + volume(period = "DAY")[28] + volume(period = "DAY")[29] + volume(period = "DAY")[30]) / 30;
def today = volume(period = "DAY");
def percentOf30Day = Round((today / volLast30DayAvg) * 100, 0);
def avg30Bars = (volume[1] + volume[2] + volume[3] + volume[4] + volume[5] + volume[6] + volume[7] + volume[8] + volume[9] + volume[10] + volume[11] + volume[12] + volume[13] + volume[14] + volume[15] + volume[16] + volume[17] + volume[18] + volume[19] + volume[20] + volume[21] + volume[22] + volume[23] + volume[24] + volume[25] + volume[26] + volume[27] + volume[28] + volume[29] + volume[30]) / 30;
def curVolume = volume;
def percentOf30Bar = Round((curVolume / avg30Bars) * 100, 0);
def SellVolPercent = Round((Selling / Volume) * 100, 0);

# Labels
#AddLabel(Show30DayAvg, "Avg 30Days: " + Round(volLast30DayAvg, 0) + "  ", Color.LIGHT_GRAY);

#AddLabel(ShowTodayVolume, "Today: " + today + "  ", (if percentOf30Day >= UnusualVolumePercent then Color.GREEN else if percentOf30Day >= 100 then Color.ORANGE else Color.LIGHT_GRAY));

#AddLabel(ShowPercentOf30DayAvg, percentOf30Day + "%  ", (if percentOf30Day >= UnusualVolumePercent then Color.GREEN else if percentOf30Day >= 100 then Color.ORANGE else Color.WHITE) );

#AddLabel(Show30BarAvg, "Avg 30Bars: " + Round(avg30Bars, 0), Color.LIGHT_GRAY);

#AddLabel(ShowCurrentBar, "curBar: " + curVolume, (if percentOf30Bar >= UnusualVolumePercent then Color.GREEN else if PercentOf30Bar >= 100 then Color.ORANGE else Color.LIGHT_GRAY));

#AddLabel(ShowPercentOf30BarAvg, PercentOf30Bar + "%", (if PercentOf30Bar >= UnusualVolumePercent then Color.GREEN else if PercentOf30Bar >= 100 then Color.ORANGE else Color.WHITE) );

#AddLabel(ShowSellVolumePercent, "Current Sell: " + SellVolPercent + "%   ", (if SellVolPercent > 51 then Color.RED else if SellVolPercent < 49 then Color.GREEN else Color.ORANGE));

plot value = SellVolPercent;

#AssignBackgroundColor(
#if SellVolPercent == 0 then CreateColor(0,160,0) else
#if SellVolPercent < 25 then CreateColor(0,120,0) else
#if SellVolPercent < 40 then CreateColor(0,80,0) else
#if SellVolPercent < 50 then CreateColor(50,50,0) else
#if SellVolPercent == 50 then CreateColor(100,100,100) else
#if SellVolPercent > 50 and SellVolPercent < 75 then CreateColor(140,0,0) else
#CreateColor(200,0,0)); 

def colorFactor = 200;

AssignBackgroundColor(
CreateColor(colorFactor*SellVolPercent/100,colorFactor-colorFactor*SellVolPercent/100,0));

value.setdefaultcolor(color.light_gray);

