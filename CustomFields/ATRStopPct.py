plot stopPct = Round((close - reference ATRTrailingStop()) / close * 100, 1);

# stopPct.assignValueColor(if stopPct <= 5 then color.WHITE else if stopPct <= 10 then color.BLACK else color.WHITE);
# assignbackgroundcolor(if stopPct < 0 then color.RED else 
#                       if stopPct <= 5 then color.dark_green else
#                       if stopPct > 5 and stopPct <= 8 then color.GREEN else
#                       if stopPct > 8 and stopPct <= 10 then color.LIGHT_GREEN else color.BLACK);
# AddLabel(yes, AsText(Round(stopPct,1),"%1$.1f")+"%", if stopPct < 0 then color.RED else 
#                       if stopPct <= 5 then color.LIGHT_GREEN else
#                       if stopPct > 5 and stopPct <= 8 then color.GREEN else
#                       if stopPct > 8 and stopPct <= 10 then color.DARK_GREEN else color.GRAY);

stopPct.assignValueColor(if stopPct < 0 then color.RED else 
                       if stopPct <= 5 then color.LIGHT_GREEN else
                       if stopPct > 5 and stopPct <= 8 then color.GREEN else
                       if stopPct > 8 and stopPct <= 10 then color.DARK_GREEN else color.DARK_GRAY);