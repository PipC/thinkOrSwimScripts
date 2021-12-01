#yakBro intraday anchoredVWAP excluding extended hours volume 2019

declare hide_on_daily;

def anchorTime = 0930;
def anchorEnd = 1600;

input ShowTodayOnly = yes;
def Today = if GetDay() == GetLastDay() then 1 else 0;
def postAnchorTime = if SecondsFromTime(anchorTime) >= 0 then 1 else 0;
def endAchorTime = if SecondsTillTime(anchorEnd) >= 0 then 1 else 0;

#plot anchorVWAP for intraday
def  volumeSum = compoundValue(1, if postAnchorTime and endAchorTime then volumeSum[1] + volume else 0, volume);
def  volumeVwapSum = compoundValue(1, if postAnchorTime and endAchorTime then volumeVwapSum[1] + volume * vwap else 0, volume * vwap);
 
plot anchorVWAP = if ShowTodayOnly and !Today then Double.NaN else if anchorTime then volumeVwapSum / volumeSum else Double.NaN;
anchorVWAP.setStyle(Curve.Firm);
anchorVWAP.setDefaultColor(Color.WHITE);
anchorVWAP.setlineWeight(2);