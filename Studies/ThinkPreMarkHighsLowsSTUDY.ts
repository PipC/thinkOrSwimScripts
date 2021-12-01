# Globex, RTH and prior RTH High and Low 

# Request for JQ 11.8.18 

# v0.02 11.12.18 will plot prior RTH during current RTH 

# Nube 

 

    # inputs 

input bubbles = yes; 

 

    # univerals 

def na = Double.NaN; 

def bn = BarNumber(); 

def h  = high; 

def l  = low; 

 

Script prior { 

# subscript for getting prior value of a BarNumber() defined variable 

    input prior = close; 

    def   priorOf = if prior != prior[1] then prior[1] else priorOf[1]; 

    plot  priorBar = priorOf; 

} 

    

   # variables 

def cb   = HighestAll(if !IsNaN(h) then bn else na); 

def time = GetTime(); 

def rts  = RegularTradingStart(GetYYYYMMDD()); 

def rte  = RegularTradingEnd(GetYYYYMMDD()); 

 

def RTH = if   time crosses above rts 

          then bn else RTH[1]; 

#def globex = if   time crosses below rte 

            # then bn else globex[1]; 

# If you want to include the extended session in Globex, then use globex def below 

def globex = if   time crosses above rte 

             then bn else globex[1]; 

 

def priorRTH    = prior(RTH); 

def priorGlobex = prior(globex); 

def hRTH  = HighestAll(RTH); 

def hGX   = HighestAll(globex); 

def hPRTH = HighestAll(priorRTH); 

def hPGX  = HighestAll(priorGlobex); 

 

def gXhigh = HighestAll(if   bn >= hGX && bn < hRTH 

                        then h else if hRTH < hGX && bn >= hGX 

                                    then h else na); 

def gXlow = LowestAll(if   bn >= hGX && bn < hRTH 

                      then l else if hRTH < hGX && bn >= hGX 

                                  then l else na); 

def RTHhigh = HighestAll(if   bn >= hRTH && bn < hGX 

                         then h else if hGX < hRTH && bn >= hRTH 

                                    then h else na); 

def RTHlow = LowestAll(if   bn >= hRTH && bn < hGX 

                       then l else if hGX < hRTH && bn >= hRTH 

                                   then l else na); 

 

def priorRTHhigh = HighestAll(if   bn >= hPRTH  

                              &&   bn <  if   hGX < hRTH 

                                         then hGX 

                                         else hPGX 

                              then h else na); 

def priorRTHlow = LowestAll(if   bn >= hPRTH  

                            &&   bn <  if   hGX < hRTH 

                                       then hGX 

                                       else hPGX 

                            then l else na); 

                                   

plot  

GlobexHigh = gXhigh; 

GlobexHigh.SetDefaultColor(Color.Light_Green); 

plot  

GlobexLow = gXlow; 

GlobexLow.SetDefaultColor(Color.Pink); 

 

plot  

HighRTH = RTHhigh; 

HighRTH.SetDefaultColor(Color.Green); 

plot 

LowRTH  = RTHlow; 

LowRTH.SetDefaultColor(Color.Red); 

 

plot 

PreviousHighRTH = priorRTHhigh; 

PreviousHighRTH.SetDefaultColor(Color.Dark_Green); 

plot  

PreviousLowRTH  = priorRTHlow; 

PreviousLowRTH.SetDefaultColor(Color.Dark_Red); 



AddChartBubble(bubbles && bn == cb, gXhigh, "Globex High", Color.Light_Green); 

AddChartBubble(bubbles && bn == cb, RTHhigh, "RTH High", Color.Green); 

AddChartBubble(bubbles && bn == cb, priorRTHhigh, "Previous\n RTH High", Color.Dark_Green); 

AddChartBubble(bubbles && bn == cb, gXlow, "Globex Low", Color.Pink,0); 

AddChartBubble(bubbles && bn == cb, RTHlow, "RTH Low", Color.Red,0); 

AddChartBubble(bubbles && bn == cb, priorRTHlow, "Previous\n RTH Low", Color.Dark_Red,0); 

# f/ Globex, RTH and prior RTH High and Low 
