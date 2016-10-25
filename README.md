# hipchat-deleter

A little script for node.js to delete your 1:1 HipChat(tm) history with another user within a given date range. (From the web interface, this is a very tedious task, because each message must be deleted individually.)

Please run `npm install` on the command line to fetch dependencies before executing.

Right after start on the command line, the script prompts you for all relevant information (e-mail address, date range, ...)

The script works well with the xsrf protection that Atlassian(r) has recently added to HipChat(tm) and which causes other currently available scripts to fail.

Use at your own risk. No warranty.
