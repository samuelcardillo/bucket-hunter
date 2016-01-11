# Bucket Hunter - Amazon AWS Open Files Scraper

After few research, we discovered that by using passive DNS lookup on Amazon servers we can found hostname of customer hosted in the cloud. Many of them are not using any authentication systems and some of them are hosting sensitive files. 

We wrote a quick tool as proof of concept of automated exploitation as well as a white paper.

### How to install 
* Clone the git (or click on the download button)
* Install [Node.js](https://nodejs.org/) on your computer
* Open your console and go in the repertory where `bucket-hunter.js` is located
* Write `npm install` and wait until everything is finished
* Write `node bucket-hunter.js` in the console

### How does it work : 

To find the IP range of Amazon, use this [JSON document](https://ip-ranges.amazonaws.com/ip-ranges.json). The use of this JSON makes this security research unique by letting us use official Amazon IP ranges and not technics like bruteforcing. Yet, the previous bucket hunter were doing very well.

Lets take the **ip** of one for example : 
```
"ip_prefix": "54.231.128.0/19"
```

So the **IP** goes from `54.231.128.0` to `54.231.128.19`. 

Launch the script by writing 
`node bucket-hunter.js -i 54.231.128.0` in order to see the DNS passive lookup result concerning this URL. After a bit of times, you will see a list of results. 

If you see something like `example.s3.amazonaws.com is available` then you can copy the URL (`example.s3.amazonaws.com`) and launch the command :`node bucket-hunter.js -f example.s3.amazonaws.com` which will give you link for every files listed on the Amazon AWS bucket you selected.

## authors : 
* [Samuel LESPES CARDILLO](http://samuelcardillo.com/) (Cyber_Owner) [@cyberwarfighte1](https://twitter.com/cyberwarfighte1)
* [Amitay Dan](http://amitaydan.com) (popshark) [@popshark1](https://twitter.com/popshark1)