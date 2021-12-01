# from input all the way down to plot is merely a copy/paste of the traditional PSAR study.  Below that is the additional lines added to the code to create audible and visual alerts + chart label.

input accelerationFactor = 0.02;
input accelerationLimit = 0.2;

assert(accelerationFactor > 0, "'acceleration factor' must be positive: " + accelerationFactor);
assert(accelerationLimit >= accelerationFactor, "'acceleration limit' (" + accelerationLimit + ") must be greater than or equal to 'acceleration factor' (" + accelerationFactor + ")");

def state = {default init, long, short};
def extreme;
def SAR;
def acc;

switch (state[1]) {
case init:
    state = state.long;
    acc = accelerationFactor;
    extreme = high;
    SAR = low;
case short:
    if (SAR[1] < high)
    then {
        state = state.long;
        acc = accelerationFactor;
        extreme = high;
        SAR = extreme[1];
    } else {
        state = state.short;
        if (low < extreme[1])
        then {
            acc = min(acc[1] + accelerationFactor, accelerationLimit);
            extreme = low;
        } else {
            acc = acc[1];
            extreme = extreme[1];
        }
        SAR = max(max(high, high[1]), SAR[1] + acc * (extreme - SAR[1]));
    }
case long:
    if (SAR[1] > low)
    then {
        state = state.short;
        acc = accelerationFactor;
        extreme = low;
        SAR = extreme[1];
    } else {
        state = state.long;
        if (high > extreme[1])
        then {
            acc = min(acc[1] + accelerationFactor, accelerationLimit);
            extreme = high;
        } else {
            acc = acc[1];
            extreme = extreme[1];
        }
        SAR = min(min(low, low[1]), SAR[1] + acc * (extreme - SAR[1]));
    }
}

plot parSAR = SAR;
parSAR.SetPaintingStrategy(PaintingStrategy.POINTS);
parSAR.SetDefaultColor(color.BLUE);



#code below this line creates a visible alert (chart label) and audible alert on the first bar the PSAR dots flip (price crosses PSAR)

# because of the copy/paste of tradtional PSAR study above this it is easy to use that to create the below def and plot with simple lines of code.

def PSAR = ParabolicSAR(accelerationFactor = accelerationFactor, accelerationLimit = accelerationLimit);

plot BullishSignal = Crosses(PSAR, close, CrossingDirection.BELOW);
BullishSignal.SetLineWeight(5);
BullishSignal.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_UP);
BullishSignal.AssignValueColor(CreateColor(51, 204, 0));

# in Alert you select what text will appear in the messages window when your alert trigers by placing those words between quotation marks.  Alert(condition or trigger, words to appear, how often to sound the alert, what sound to hear)
Alert(BullishSignal, "Bullish PSAR", Alert.BAR, Sound.Ring);
AddLabel(close > PSAR, "     Bullish PSAR     ", CreateColor(51,204,0));

# Because BullishSignal will be true ONLY for the bar where the PSAR dots flip, this label is a visual alert that will ONLY appear at the time the PSAR dots flip
AddLabel(if BullishSignal == 1 then yes else no, "     PSAR just flipped to Bullish     ", (CreateColor(51,204,0)));



plot BearishSignal = Crosses(PSAR, close, CrossingDirection.ABOVE);
BearishSignal.SetPaintingStrategy(PaintingStrategy.BOOLEAN_ARROW_DOWN);
BearishSignal.AssignValueColor(Color.RED);
BearishSignal.SetLineWeight(5);

# Because BeaarishSignal will be true ONLY for the bar where the PSAR dots flip, this label is a visual alert that will ONLY appear at the time the PSAR dots flip
Alert(BearishSignal, "Bearish PSAR", Alert.BAR, Sound.Ring);
AddLabel(close < PSAR, "     Bearish PSAR     ", color.RED);
AddLabel(if BearishSignal == 1 then yes else no, "     PSAR just flipped to Bearish     ", color.RED);