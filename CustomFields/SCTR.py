input VALUEREF = close; 
input FC = 3; #Multiplier
input LT_Rate = 60;
input MT_Rate = 30;
input ST_Rate = 10;

#Long term input
input LT_EMA = 200;
input LT_ROC = 125;

#Middle term
input MT_EMA = 50;
input MT_ROC = 20;

#Short term input
input ST_EMA = 9;
input ST_RSI = 14;

input AVG_TYPE = AverageType.SIMPLE;

#Long term integer
def LT_EMAV = ((VALUEREF - MovingAverage(AVG_TYPE, VALUEREF, LT_EMA)) / MovingAverage(AVG_TYPE, VALUEREF, LT_EMA))*100;
def LT_ROCV = RateOfChange(LT_ROC);

#Middle term integer
def MT_EMAV = ((VALUEREF - MovingAverage(AVG_TYPE, VALUEREF, MT_EMA)) / MovingAverage(AVG_TYPE, VALUEREF, MT_EMA))*100;
def MT_ROCV = RateOfChange(MT_ROC, close);

#Middle term integer
def ST_EMAV = ((VALUEREF - MovingAverage(AVG_TYPE, VALUEREF, ST_EMA)) / MovingAverage(AVG_TYPE, VALUEREF, ST_EMA))*100;
def ST_ROCV = reference RSI(length = ST_RSI) - 50;

def LT_VAL = LT_Rate*0.01*((LT_EMAV + LT_ROCV)/2);
def MT_Val = MT_Rate*0.01*((MT_EMAV + MT_ROCV)/2);
def ST_Val = ST_Rate*0.01*((ST_EMAV + ST_ROCV)/2);
def SCTR = 50+(FC*(LT_Val + MT_Val + ST_Val));
plot SCTRV = if SCTR >= 0.1 and SCTR <= 99.9 
            then SCTR 
            else 
                if SCTR > 99.9 then 99.9 
                else 
                    if SCTR < 0.1 then 0.1 else Double.NaN;
                ;
            ;
assignbackgroundcolor (if SCTRV > 80 then color.dark_green else
                       if SCTRV > 60 and SCTRV <= 80 then createcolor(0,175,0) else
                       if SCTRV > 40 and SCTRV <= 60 then color.gray else
                       if SCTRV > 20 and SCTRV <= 40 then CreateColor(220, 0,0) else
                       if SCTRV <= 20 then CreateColor(150, 0,0) else
                       color.white);