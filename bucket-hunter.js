var request = require('request')
  , program = require('commander');

program
  .version('0.0.1')
  .option('-i, --ip [value]', 'ipAddr')
  .option('-f, --getFile [value]', 'getFile')
  .parse(process.argv);

console.log("/* __________________________________ */");
console.log("/* Bucket Hunter - Amazon AWS Open Bucket Scraper");
console.log("/* Samuel LESPES CARDILLO (Cyber_Owner) - @cyberwarfighte1");
console.log("/* Amitay Dan (popshark1)");
console.log("/* __________________________________ */");

/* _____________ CODE ___________ */

if(program.ip) {
    console.log('Passive DNS looking...');
    passiveDNS(program.ip);
} else if(program.getFile) {
    console.log('Checking availability...');
    verifyAccess(program.getFile,function(availability) {
        console.log(availability);
        if(availability == program.getFile + " is available") {
            console.log('Getting the file list...');
            getFiles(program.getFile,function(result){
                console.log('________ FILE LIST ___________');
                for(var k in result) {
                    console.log(result[k]);
                }
            });
        };
    });
} else {
    return console.log("usage : node bucket-hunter.js -h");
}

/* __________ FUNCTIONS ___________ */

// Deprecated
function findHostname(ip,apiKey) {
    request({
        headers: {
          'Authorization': apiKey,
        },
        uri: "https://mxtoolbox.com/api/v1/lookup/ip/"+ip,
        method: 'GET',
        json: true
      }, function(err,res,body){
        for(var k in body["Information"]) {
            passiveDNS(body["Information"][k]["Domain Name"]);
        }
    });
};

function passiveDNS(hostname) {
    request({
    uri: 'https://1d4.us/'+hostname,
    method: 'GET',
    json: true
  }, function(err,res,body){
        var hosted = parseResult(body,hostname);
        for(var k in hosted) {
            verifyAccess(hosted[k],function(availability){
                console.log(availability);
            });
        }
  });
};

function parseResult(data,hostname) {
    var result = [];
    var data = data.split('<tr class="odd">');

    for(var k in data)  {
        if(k == 0) continue; 

        var lines = data[k].split("<td width='150px'><a href='/");
        lines = lines[1].split(".\'>");
        if(lines[0] != hostname) result.push(lines[0]);
    }

    return result;
}

function verifyAccess(host,callback) {
    request({
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        uri: 'http://'+host,
        method: 'GET',
    }, function(err,res,body){
        if(err) return err;

        var availability = (body.indexOf("<Error>") != -1) ? "blocked" : "available";
        return callback(host + " is " + availability);
    });
}

function getFiles(host,callback) {
    request({
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        uri: 'http://'+host,
        method: 'GET',
    }, function(err,res,body){
        if(err) return err;
        var result = [];
        var body = body.split('<Contents>');

        for(var k in body) {
            if(k == 0) continue;

            var content = body[k].split('</Contents>');
            var fileName = content[0].split('<Key>');
            fileName = fileName[1].split('</Key>');
            result.push(host + '/' + fileName[0]);
        }

        return callback(result);
    });
}