#
# TD Ameritrade IP Company, Inc. (c) 2020
#
declare lower;

input length = 20;

plot R = (WMA(close, length) - Average(close, length)) * (length + 1) /
(StDev(close, length) * Sqrt((Sqr(length) - 1) / 3));
plot ZeroLine = 0;

R.SetDefaultColor(GetColor(5));
ZeroLine.SetDefaultColor(GetColor(7));

R.DefineColor("Up", Color.LIGHT_GREEN);
R.DefineColor("Down", Color.LIGHT_RED);
R.AssignValueColor(if R > R[1] then R.color("Up") else R.color("Down"));
R.SetLineWeight(3);
