plot vwap = vwap();
AssignBackgroundColor(if close > vwap then Color.DARK_GREEN else if close < vwap then Color.DARK_RED else Color.DARK_ORANGE);