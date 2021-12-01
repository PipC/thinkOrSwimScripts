#Wizard text: The current price
##Wizard input: price
#Wizard text: is within
#Wizard input: choice1
#Wizard text: % of the
#Wizard input: period
#Wizard text: period
#Wizard input: choice

def price = close;
input period = 252;
input choice = {default High, Low};
input choice1 = 3;

def hi = high;
def lo = low;

plot scan;
switch (choice) {
case High:
scan = price >= highest(hi,period)* ((100 - choice1) /100);
case Low:
scan = price <= lowest(lo,period)* ((100 + choice1) /100);;
}