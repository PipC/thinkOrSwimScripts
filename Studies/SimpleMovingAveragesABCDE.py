#
# TD Ameritrade IP Company, Inc. (c) 2017-2020
#

input price = close;
input length_A01 = 10;
input length_B02 = 21;
input length_C05 = 50;
input length_D10 = 100;
input length_E20 = 200;
input displace = 0;



plot MA_A01 = MovingAverage(AverageType.EXPONENTIAL, price[-displace], length_A01);
plot MA_A02 = MovingAverage(AverageType.EXPONENTIAL, price[-displace], length_B02);
plot MA_C05 = MovingAverage(AverageType.SIMPLE, price[-displace], length_C05);
plot MA_D10 = MovingAverage(AverageType.SIMPLE, price[-displace], length_D10);
plot MA_E20 = MovingAverage(AverageType.SIMPLE, price[-displace], length_E20);

#MA_A01.SetDefaultColor(CreateColor( 20,150,250));
#MA_A02.SetDefaultColor(CreateColor( 50,250, 80));
#MA_C05.SetDefaultColor(CreateColor(230,250,  0));
#MA_D10.SetDefaultColor(CreateColor(240,150, 50));
#MA_E20.SetDefaultColor(CreateColor(240, 10, 10));

#RGB
MA_A01.SetDefaultColor(CreateColor(0, 100,  100));
MA_A02.SetDefaultColor(CreateColor(0, 150, 250));
MA_C05.SetDefaultColor(CreateColor(250, 100, 100));
MA_D10.SetDefaultColor(CreateColor(250, 140, 180));
MA_E20.SetDefaultColor(CreateColor(250, 220, 220));

#MA_A01.SetDefaultColor(CreateColor(205, 105, 150));
#MA_A02.SetDefaultColor(CreateColor(225, 125, 150));
#MA_C05.SetDefaultColor(CreateColor(255, 155, 0));
#MA_D10.SetDefaultColor(CreateColor(255, 205, 0));
#MA_E20.SetDefaultColor(CreateColor(255, 250, 0));

#MA_A01.SetDefaultColor(CreateColor(170, 0,  120));
#MA_A02.SetDefaultColor(CreateColor(190, 50, 140));
#MA_C05.SetDefaultColor(CreateColor(210, 100, 160));
#MA_D10.SetDefaultColor(CreateColor(230, 150, 180));
#MA_E20.SetDefaultColor(CreateColor(250, 200, 200));

MA_A01.SetPaintingStrategy(PaintingStrategy.LINE);
MA_A01.SetStyle(Curve.FIRM);
MA_A01.SetLineWeight(1);

MA_A02.SetPaintingStrategy(PaintingStrategy.LINE);
MA_A02.SetStyle(Curve.FIRM);
MA_A02.SetLineWeight(1);

MA_C05.SetPaintingStrategy(PaintingStrategy.LINE);
MA_C05.SetStyle(Curve.FIRM);
MA_C05.SetLineWeight(1);

MA_D10.SetPaintingStrategy(PaintingStrategy.LINE);
MA_D10.SetStyle(Curve.FIRM);
MA_D10.SetLineWeight(1);

MA_E20.SetPaintingStrategy(PaintingStrategy.LINE);
MA_E20.SetStyle(Curve.FIRM);
MA_E20.SetLineWeight(1);

