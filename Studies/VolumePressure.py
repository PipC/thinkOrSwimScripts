# Volume Pressure
# Mobius
# Mobius at MyTrade
# V01.02.2010
#https://usethinkscript.com/threads/buy-and-sell-volume-pressure-indicator-for-thinkorswim.578/

declare lower;

input nVP = 20;
input VPdelta = 20;
input avgLength = 55;

  plot VP = Sum(((close - open) / (high - low)) * volume, nVP);
  def VPup = Average(VP, VPdelta)  >  Average(VP, VPdelta)[1];
  def VPdn = Average(VP, VPdelta)  <  Average(VP, VPdelta)[1];;
          VP.SetPaintingStrategy(PaintingStrategy.Histogram);
          VP.SetLineWeight(3);
          VP.AssignValueColor(if VP < 0 and VPup
                                            then Color.Light_GREEN
                                            else if VP > 0 and VPup
                                            then Color.Green
                                            else if VP > 0 and VPdn
                                            then Color.Yellow
                                            else  Color.RED);

  plot zerobase = If isNaN(volume) then Double.NaN else 0;
          zerobase.SetPaintingStrategy(PaintingStrategy.Line);
          zerobase.SetLineWeight(3);
          zerobase.AssignValueColor(if IsAscending(VP, nVP)
                                                        then Color.GREEN
                                                        else  Color.RED);

  plot TrendLine = Inertia(VP, avgLength);
          TrendLine.SetLineWeight(1);
          TrendLine.AssignValueColor(if Sum(TrendLine > TrendLine[1], 3) == 3
                                                          then Color.LIGHT_GRAY
                                                          else  Color.LIGHT_ORANGE);