#!/usr/local/bin/node
var fs = require('fs');
var request = require("request")
var npm = require("npm")

var repos = [];

var theme = process.argv.slice(2)[0];

var itemHTML = '<p><strong>${NAME}</strong> </a>by ${AUTHOR} - ${LICENSENAME} - ${LINKREPO}</p>\n';
var shortItemHTML = '<p><strong>${NAME}</strong></p>\n';
var commitHTML = '<p><a href="${USERHOME}" target="_blank"><img src="${IMG}" width=50> ${NAME}</a> ${N} Commits</p>\n';

var Repo = function (sectionName, url, statsUrl) {
	this.name = sectionName;
	this.url = url;
	this.deps = [];
	this.statsUrl = statsUrl;
};

var User = function (gitUser) {
	this.login = gitUser['login'];
	this.contributions = gitUser['contributions'];
	this.avatar_url = gitUser['avatar_url'];
	this.html_url = gitUser['html_url'];
};

var array = [
	new Repo("Volumio2","https://raw.githubusercontent.com/volumio/Volumio2/master/package.json","https://api.github.com/repos/volumio/Volumio2/contributors"),
	new Repo("Volumio2-UI","https://raw.githubusercontent.com/volumio/Volumio2-UI/master/package.json","https://api.github.com/repos/volumio/Volumio2/contributors"),
	new Repo("Volumio2-UI Bower","https://raw.githubusercontent.com/volumio/Volumio2-UI/master/bower.json","")
		];

var finishCount=0;
var finalCount = array.length*2;
npm.load(function (er) {
	for (itemN in array) {
		var item = array[itemN];
		readPackages(item);
		readAuthors(item);
	}
});

function readPackages(item) {
	request({
    	url: item.url,
    	json: true
		}, function (error, response, body) {
	    	if (!error && response.statusCode === 200) {
	    		var deps = body["dependencies"];
	    		var devDeps = body["devDependencies"];

				item.deps = deps;
				item.devDeps = devDeps;
				for (dep in deps) {
					finalCount++;
					fetchRepos(dep);
				}
				for (dep in devDeps) {
					finalCount++;
					fetchRepos(dep);
				}
		    }
		    finished();
	});
}

function fetchRepos(dep) {
	npm.commands.view([dep], true, function (er, data) {
    if (er) {
    	console.log("ERR: " + er);
    } else {
    	var k = Object.keys(data)[0];
    	var pkg = data[k];
    	try {

	    var vanilla = {repo: "#", author: "N/A", license: "N/A"};

	    if (Object.prototype.hasOwnProperty.call(pkg,"repository")) {
	    	if (Object.prototype.hasOwnProperty.call(pkg.repository,'url') ) {
	    		vanilla.repo = pkg.repository.url;
	    	} else {
	    		vanilla.repo = pkg.repository;
	    	}
	    }

	    if (Object.prototype.hasOwnProperty.call(pkg,"author") ) {
	    	if (Object.prototype.hasOwnProperty.call(pkg.author,"name")  ) {
	    		vanilla.author = pkg.author.name;
	    	} else {
	    		vanilla.author = pkg.author;
	    	}
	    }

	    	vanilla.license = pkg.license;

		repos[dep] = vanilla;
	} catch (e) {
		var k = Object.keys(data)[0];
    	var pkg = data[k];
		console.log("Error fetching " + dep + " " + k + " : "+ e + " - " + Object.keys(pkg));
	}

	}
	finished();
  });
}


function readAuthors(item) {
	console.log("authors " + item.statsUrl);
	request({
    	url: item.statsUrl,
    	json: true,
    	headers: {
    		'User-Agent': 'CreditsAgent'
  		},
  		'auth': {
    'user': 'vellori',
    'pass': 'xxx',
    'sendImmediately': false
  }
		}, function (error, response, body) {
	    	if (!error && response.statusCode === 200) {
	    		var authors = [];
	    		for (author in body) {
	    			authors.push(body[author]);
	    		}
	    		item.authors = authors;
		    }  else {
		    	try {
		    	console.log("Error reading authors " + body.message );
		    } catch (e) {}
		    }
		    finished();
	});
}

function addPackages(deps) {
	var myHTML = '';
	for (item in deps) {
		repo = repos[item];
		try {
		myHTML += itemHTML.replace("${NAME}",item)
						  .replace("${LINKREPO}",repo.repo)
						  .replace("${AUTHOR}",repo.author)
						  .replace("${LINKLIC}",item)
						  .replace("${LICENSENAME}",repo.license);
			} catch (e) {
							console.log("error html for " + item + ": " + e);
							myHTML += shortItemHTML.replace("${NAME}",item);
						}
               //'<li><span class="packagename">' + item + '</span>-<span class="packageversion">' + ver + '</span></li>\n';
	}
	return myHTML;
}

function addAuthors(authors) {
	var myHTML = '';
	for (authorN in authors) {
		var author = authors[authorN];
		myHTML += commitHTML.replace("${USERHOME}",author.html_url)
							.replace("${IMG}",author.avatar_url)
							.replace("${NAME}",author.login)
							.replace("${N}",author.contributions);
	}
	return myHTML;
}

function addSection(name) {
	return  "<h1>" + name + "</h1>";
}

function finished() {
	finishCount++;

	if (finishCount == finalCount) {
		writeHTML();
	}
}

function writeHTML() {
	var html = "";
	for (itemN in array) {
		var item = array[itemN];
		html += addSection(item.name);
		html += addPackages(item.deps);
		html += addPackages(item.devDeps);

		html += addAuthors(item.authors);
	}
  var creditsPath = "src/app/themes/" + theme + "/assets/static-pages/credits.html";
  console.log(creditsPath);
	fs.writeFile(creditsPath, html);
	console.log("Wrote html");
}
