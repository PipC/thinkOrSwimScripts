#
# TD Ameritrade IP Company, Inc. (c) 2018-2021
#

input adxLength = 10;
input macdFastLength = 12;
input macdSlowLength = 26;
input paintBars = yes;

plot adx = reference ADX(length = adxLength);
def macd = reference MACD("fast length" = macdFastLength, "slow length" = macdSlowLength);

def CAM_UP = adx >= adx[1] and macd > macd[1];
def CAM_PB = adx <= adx[1] and macd < macd[1];
def CAM_DN = adx >= adx[1] and macd < macd[1];
def CAM_CT = adx <= adx[1] and macd > macd[1];

DefineGlobalColor("CAM_UP", Color.GREEN);
DefineGlobalColor("CAM_PB", Color.YELLOW);
DefineGlobalColor("CAM_DN", Color.RED);
DefineGlobalColor("CAM_CT", Color.BLUE);

AssignBackgroundColor(if !paintBars then Color.CURRENT
else if CAM_UP then Color.DARK_GREEN
else if CAM_PB then Color.YELLOW
else if CAM_DN then Color.DARK_RED
else if CAM_CT then Color.BLUE
else Color.Current);

AddLabel( CAM_UP, "UP",  Color.WHITE);
AddLabel( CAM_PB, "PB",  Color.BLACK);
AddLabel( CAM_DN, "DN",  Color.WHITE);
AddLabel( CAM_CT, "CT",  Color.WHITE);


#    CAM_UP: When both ADX and MACD are rising, the study recognizes an upside momentum and colors the price plot green.
#    CAM_PB: When both ADX and MACD are declining, the study recognizes a possible pullback and colors the price plot yellow.
#    CAM_DN: When ADX is rising but MACD is declining, the study recognizes possible downtrend conditions and colors the price plot red.
#    CAM_CT: When MACD is rising but ADX is declining, the study recognizes a possible countertrend rally and colors the price plot blue.    
