input tradingPercentageOfCash = 2;
input buyingPowerSource = {default Auto, NetLiq, TotalCash, ManualInput};
input manualInputCashTotal = 0; #Hint Total Cash is $0 will use GetTotalCash();
def buyingPower = if buyingPowerSource == buyingPowerSource.ManualInput then manualInputCashTotal 
else if buyingPowerSource == buyingPowerSource.TotalCash then GetTotalCash() 
else if buyingPowerSource == buyingPowerSource.NetLiq then GetNetLiq() 
else if buyingPowerSource == buyingPowerSource.Auto then
    if tradingPercentageOfCash/100 * GetNetLiq() < GetTotalCash() 
    then GetTotalCash()
    else tradingPercentageOfCash/100 * GetNetLiq()
else GetTotalCash();
def totalCash = buyingPower;
#def totalNetLiq = if cashTotal ==0 then GetNetLiq() else 0;
def tradeSize = RoundDown(totalCash * tradingPercentageOfCash / 100 / close, 0);
#def tradeSizeByCache = RoundDown(totalCash * tradingPercentageOfCash / 100 / close, 0);
#def tradeSizeByNetLiq = RoundDown(totalNetLiq * tradingPercentageOfCash / 100 / close, 0);
#def tradeSize = if cashTotal == 0 then (
#    if tradeSizeByNetLiq > totalCash then tradeSizeByCache else tradeSizeByNetLiq
#) else cashTotal;
AddLabel(yes, 
( tradeSize +"|$"+round(tradeSize*close,0)+"~"+
tradingPercentageOfCash + "%" + (if totalCash == 0 then "" else " of $" + 
if totalCash >= 1000000 then Round(totalCash / 1000000, 1) + "m" else
if totalCash >= 1000 then Round(totalCash / 1000, 1) + "k" else
totalCash + "") + if buyingPowerSource != buyingPowerSource.ManualInput then "*" else ""
) 
, Color.WHITE);