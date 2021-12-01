# SCTR's
declare lower;

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
SCTRV.setLineWeight(2);
SCTRV.setStyle(Curve.FIRM);
SCTRV.AssignValueColor(
      if SCTR > 80 then 
          Color.GREEN 
      else
          if SCTR > 60 then
              Color.LIGHT_GREEN
          else
              if SCTR < 20 then 
                 Color.RED 
              else
                 Color.GRAY 
      );

plot SCTRX = if SCTR > 99.9 
             then 
                (99.9 + log(SCTR - 99.9))
             else
                if SCTR < 0.1 then 
                    (0.1 + log(SCTR - 0.1))
                else 
                    SCTR
             ; 
SCTRX.setStyle(Curve.POINTS);
SCTRX.setLineWeight(2);
SCTRX.AssignValueColor(
      if SCTR > 80 then 
          Color.GREEN 
      else
          if SCTR > 60 then
              Color.LIGHT_GREEN
          else
              if SCTR < 20 then 
                 Color.RED 
              else
                 Color.GRAY 
      );
AddLabel(SCTRX, "SCTR: " + SCTRX, if SCTRX > 80 then 
          Color.GREEN 
      else
          if SCTRX > 60 then
              Color.LIGHT_GREEN
          else
              if SCTRX < 20 then 
                 Color.RED 
              else
                 Color.GRAY );


plot UpperBound = 100;
UpperBound.AssignValueColor(Color.WHITE);
plot LowerLevel = 20;
LowerLevel.AssignValueColor(Color.RED);
plot MiddleLevel = 50;
MiddleLevel.AssignValueColor(Color.WHITE);
plot UpperLevel = 80;
UpperLevel.AssignValueColor(Color.GREEN);
plot LowerBound = 0;
LowerBound.AssignValueColor(Color.WHITE);