#!/usr/bin/env python
f = open('mylog.txt', 'r')
data = f.readlines()

DK = "Dave owes "
MS = "Miroslav owes "
BM = "Brad owes "

tally = [0] * 6

for d in data:
	tally[int(d)] += 1

sum = [tally[0]-tally[2], tally[1]-tally[4], tally[3]-tally[5]]

if sum[0] < 0:
	DK += "Miroslav (" + str(abs(sum[0])) + ") "
elif sum[0] > 0:
	MS += "Dave (" + str(abs(sum[0])) + ") "

if sum[1] < 0:
	if len(DK.split(" ")) > 3:
		DK += "and "
        DK += "Brad (" + str(abs(sum[1])) + ") "
elif sum[1] > 0:
        BM += "Dave (" + str(abs(sum[1])) + ") "

if sum[2] < 0:
        if len(MS.split(" ")) > 3:
                MS += "and "
        MS += "Brad (" + str(abs(sum[2])) + ") "
elif sum[2] > 0:
        if len(BM.split(" ")) > 3:
                BM += "and "
        BM += "Miroslav (" + str(abs(sum[2])) + ") "

if len(DK.split(" ")) == 3:
	DK = ""
if len(MS.split(" ")) == 3:
        MS = ""
if len(BM.split(" ")) == 3:
        BM = ""

DK = DK.replace(" (1)", "")
MS = MS.replace(" (1)", "")
BM = BM.replace(" (1)", "")

print(DK + '<br>' + MS + '<br>' + BM)
