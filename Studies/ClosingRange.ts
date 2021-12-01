#input closingPeriod = GetAggregationPeriod;
def closingValue = close(period=GetAggregationPeriod());
def highValue = high(period=GetAggregationPeriod());
def lowValue = low(period=GetAggregationPeriod());
def closingRange = ( closingValue - lowValue) / (highValue - lowValue );
AddLabel(yes, "CR:"+round(closingRange,2), 
#if closingRange > 0.4 then Color.LIGHT_GREEN else Color.LIGHT_ORANGE
CreateColor(255-255*closingRange,255*closingRange,255*closingRange)
);