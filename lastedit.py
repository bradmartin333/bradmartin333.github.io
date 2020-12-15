#!/usr/bin/env python
import os.path
import time
print("Updated %s" % time.ctime(os.path.getmtime("mylog.txt")))
