# https://usethinkscript.com/threads/madrid-moving-average-ribbons-for-thinkorswim.3122/

#Ended up Converting this script I found on TradingView which was called "Madrid Moving Average Ribbon" and recreated it in TOS
#http://madridjourneyonws.blogspot.com/
# 

#This plots a moving average ribbon, either exponential or standard.
#This study is best viewed with a dark background.  It provides an easy
#and fast way to determine the trend direction and possible reversals.

# Green : Uptrend. Long trading
# Dark Green : Reentry (buy the dip) or downtrend reversal warning
# Red : Downtrend. Short trading
# Dark Red : Short Reentry (sell the peak) or uptrend reversal warning

# To best determine if this is a reentry point or a trend reversal
# the MMARB (Madrid Moving Average Ribbon Bar) study is used.
# This is the bar located at the bottom.  This bar signals when a
# current trend reentry is found (partially filled with opposite dark color)
# or when a trend reversal is ahead (completely filled with opposite dark color).

#Converted/Ported by Xiuying 7/14/2018

input price = close;
input colorRibbon = yes;


plot ma05 = ExpAverage(price, 5);
plot ma10 = ExpAverage(price, 10);
plot ma15 = ExpAverage(price, 15);
plot ma20 = ExpAverage(price, 20);
plot ma25 = ExpAverage(price, 25);
plot ma30 = ExpAverage(price, 30);
plot ma35 = ExpAverage(price, 35);
plot ma40 = ExpAverage(price, 40);
plot ma45 = ExpAverage(price, 45);
plot ma50 = ExpAverage(price, 50);
plot ma55 = ExpAverage(price, 55);
plot ma60 = ExpAverage(price, 60);
plot ma65 = ExpAverage(price, 65);
plot ma70 = ExpAverage(price, 70);
plot ma75 = ExpAverage(price, 75);
plot ma80 = ExpAverage(price, 80);
plot ma85 = ExpAverage(price, 85);
plot ma90 = ExpAverage(price, 90);
plot ma95 = ExpAverage(price, 95);
plot ma100 = ExpAverage(price, 100);

ma05.SetDefaultColor(Color.Dark_Gray);
ma10.SetDefaultColor(Color.Dark_Gray);
ma15.SetDefaultColor(Color.Dark_Gray);
ma20.SetDefaultColor(Color.Dark_Gray);
ma25.SetDefaultColor(Color.Dark_Gray);
ma30.SetDefaultColor(Color.Dark_Gray);
ma35.SetDefaultColor(Color.Dark_Gray);
ma40.SetDefaultColor(Color.Dark_Gray);
ma45.SetDefaultColor(Color.Dark_Gray);
ma50.SetDefaultColor(Color.Dark_Gray);
ma55.SetDefaultColor(Color.Dark_Gray);
ma60.SetDefaultColor(Color.Dark_Gray);
ma65.SetDefaultColor(Color.Dark_Gray);
ma70.SetDefaultColor(Color.Dark_Gray);
ma75.SetDefaultColor(Color.Dark_Gray);
ma80.SetDefaultColor(Color.Dark_Gray);
ma85.SetDefaultColor(Color.Dark_Gray);
ma90.SetDefaultColor(Color.Dark_Gray);
ma95.SetDefaultColor(Color.Dark_Gray);
ma100.SetDefaultColor(Color.Dark_Gray);

ma05.AssignValueColor(if !colorRibbon then Color.CURRENT else 
if ma05 >= ma05[1] and ma05>ma100 then color.Green  else if ma05 < ma05[1] and ma05>ma100 then color.Dark_red else if ma05<= ma05[1] and ma05 <ma100 then color.red else if ma05 >= ma05[1] and ma05 < ma100 then color.Dark_green else color.gray);

ma10.AssignValueColor(if !colorRibbon then Color.CURRENT else 
if ma10 >= ma10[1] and ma05>ma100
then color.Green  else if ma10 < ma10[1] and ma05>ma100
then color.Dark_red else if ma10<= ma10[1] and ma05 <ma100
then color.red else if ma10 >= ma10[1] and ma05 < ma100
then color.Dark_green else color.gray);

ma15.AssignValueColor(if !colorRibbon then Color.CURRENT else 
if ma15 >= ma15[1] and ma05>ma100
then color.Green  else if ma15 < ma15[1] and ma05>ma100
then color.Dark_red else if ma15<= ma15[1] and ma05 <ma100
then color.red else if ma15 >= ma15[1] and ma05 < ma100
then color.Dark_green else color.gray);

ma20.AssignValueColor(if !colorRibbon then Color.CURRENT else 
if ma20 >= ma20[1] and ma05>ma100
then color.Green  else if ma20 < ma20[1] and ma05>ma100
then color.Dark_red else if ma20<= ma20[1] and ma05 <ma100
then color.red else if ma20 >= ma20[1] and ma05 < ma100
then color.Dark_green else color.gray);

ma25.AssignValueColor(if !colorRibbon then Color.CURRENT else 
if ma25 >= ma25[1] and ma05>ma100
then color.Green  else if ma25 < ma25[1] and ma05>ma100
then color.Dark_red else if ma25<= ma25[1] and ma05 <ma100
then color.red else if ma25 >= ma25[1] and ma05 < ma100
then color.Dark_green else color.gray);

ma30.AssignValueColor(if !colorRibbon then Color.CURRENT else 
if ma30 >= ma30[1] and ma05>ma100
then color.Green  else if ma30 < ma30[1] and ma05>ma100
then color.Dark_red else if ma30<= ma30[1] and ma05 <ma100
then color.red else if ma30 >= ma30[1] and ma05 < ma100
then color.Dark_green else color.gray);

ma35.AssignValueColor(if !colorRibbon then Color.CURRENT else 
if ma35 >= ma35[1] and ma05>ma100
then color.Green  else if ma35 < ma35[1] and ma05>ma100
then color.Dark_red else if ma35<= ma35[1] and ma05 <ma100
then color.red else if ma35 >= ma35[1] and ma05 < ma100
then color.Dark_green else color.gray);

ma40.AssignValueColor(if !colorRibbon then Color.CURRENT else 
if ma40 >= ma40[1] and ma05>ma100
then color.Green  else if ma40 < ma40[1] and ma05>ma100
then color.Dark_red else if ma40<= ma40[1] and ma05 <ma100
then color.red else if ma40 >= ma40[1] and ma05 < ma100
then color.Dark_green else color.gray);

ma45.AssignValueColor(if !colorRibbon then Color.CURRENT else 
if ma45 >= ma45[1] and ma05>ma100
then color.Green  else if ma45 < ma45[1] and ma05>ma100
then color.Dark_red else if ma45<= ma45[1] and ma05 <ma100
then color.red else if ma45 >= ma45[1] and ma05 < ma100
then color.Dark_green else color.gray);

ma50.AssignValueColor(if !colorRibbon then Color.CURRENT else 
if ma50 >= ma50[1] and ma05>ma100
then color.Green  else if ma50 < ma50[1] and ma05>ma100
then color.Dark_red else if ma50<= ma50[1] and ma05 <ma100
then color.red else if ma50 >= ma50[1] and ma05 < ma100
then color.Dark_green else color.gray);

ma55.AssignValueColor(if !colorRibbon then Color.CURRENT else 
if ma55 >= ma55[1] and ma05>ma100
then color.Green  else if ma55 < ma55[1] and ma05>ma100
then color.Dark_red else if ma55<= ma55[1] and ma05 <ma100
then color.red else if ma55 >= ma55[1] and ma05 < ma100
then color.Dark_green else color.gray);

ma60.AssignValueColor(if !colorRibbon then Color.CURRENT else 
if ma60 >= ma60[1] and ma05>ma100
then color.Green  else if ma60 < ma60[1] and ma05>ma100
then color.Dark_red else if ma60<= ma60[1] and ma05 <ma100
then color.red else if ma60 >= ma60[1] and ma05 < ma100
then color.Dark_green else color.gray);

ma65.AssignValueColor(if !colorRibbon then Color.CURRENT else 
if ma65 >= ma65[1] and ma05>ma100
then color.Green  else if ma65 < ma65[1] and ma05>ma100
then color.Dark_red else if ma65<= ma65[1] and ma05 <ma100
then color.red else if ma65 >= ma65[1] and ma05 < ma100
then color.Dark_green else color.gray);

ma70.AssignValueColor(if !colorRibbon then Color.CURRENT else 
if ma70 >= ma70[1] and ma05>ma100
then color.Green  else if ma70 < ma70[1] and ma05>ma100
then color.Dark_red else if ma70<= ma70[1] and ma05 <ma100
then color.red else if ma70 >= ma70[1] and ma05 < ma100
then color.Dark_green else color.gray);

ma75.AssignValueColor(if !colorRibbon then Color.CURRENT else 
if ma75 >= ma75[1] and ma05>ma100
then color.Green  else if ma75 < ma75[1] and ma05>ma100
then color.Dark_red else if ma75<= ma75[1] and ma05 <ma100
then color.red else if ma75 >= ma75[1] and ma05 < ma100
then color.Dark_green else color.gray);

ma80.AssignValueColor(if !colorRibbon then Color.CURRENT else 
if ma80 >= ma80[1] and ma05>ma100
then color.Green  else if ma80 < ma80[1] and ma05>ma100
then color.Dark_red else if ma80<= ma80[1] and ma05 <ma100
then color.red else if ma80 >= ma80[1] and ma05 < ma100
then color.Dark_green else color.gray);

ma85.AssignValueColor(if !colorRibbon then Color.CURRENT else 
if ma85 >= ma85[1] and ma05>ma100
then color.Green  else if ma85 < ma85[1] and ma05>ma100
then color.Dark_red else if ma85<= ma85[1] and ma05 <ma100
then color.red else if ma85 >= ma85[1] and ma05 < ma100
then color.Dark_green else color.gray);

ma90.AssignValueColor(if !colorRibbon then Color.CURRENT else 
if ma90 >= ma90[1] and ma05>ma100
then color.Green  else if ma90 < ma90[1] and ma05>ma100
then color.Dark_red else if ma90<= ma90[1] and ma05 <ma100
then color.red else if ma90 >= ma90[1] and ma05 < ma100
then color.Dark_green else color.gray);

ma95.AssignValueColor(if !colorRibbon then Color.CURRENT else 
if ma95 >= ma95[1] and ma05>ma100
then color.Green  else if ma95 < ma95[1] and ma05>ma100
then color.Dark_red else if ma95<= ma95[1] and ma05 <ma100
then color.red else if ma95 >= ma95[1] and ma05 < ma100
then color.Dark_green else color.gray);

ma100.AssignValueColor(if !colorRibbon then Color.CURRENT else 
if ma100 >= ma100[1] and ma05>ma100
then color.Green  else if ma100 < ma100[1] and ma05>ma100
then color.Dark_red else if ma100<= ma100[1] and ma05 <ma100
then color.red else if ma100 >= ma100[1] and ma05 < ma100
then color.Dark_green else color.gray);