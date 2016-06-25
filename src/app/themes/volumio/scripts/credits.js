#!/usr/local/bin/node
var fs = require('fs');
var request = require("request");
var npm = require("npm");
var fs=require('fs-extra');

var repos = [];

var theme = process.argv.slice(2)[0];

var itemHTML = '<strong>${NAME}</strong> </a>by ${AUTHOR} - ${LICENSENAME} - ${LINKREPO}<br>\n';
var shortItemHTML = '<strong>${NAME}</strong>';
var commitHTML = '<a href="${USERHOME}" target="_blank"><img src="${IMG}" width=50> ${NAME}</a> ${N} Commits<br>\n';

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
	new Repo("Volumio2-UI Bower","https://raw.githubusercontent.com/volumio/Volumio2-UI/master/bower.json",""),
	new Repo("Volumio2-UI","https://raw.githubusercontent.com/volumio/Volumio2-UI/master/package.json","https://api.github.com/repos/volumio/Volumio2-UI/contributors")
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
						  .replace("${LINKREPO}",'<a href="'+repo.repo+'"target="_blank">'+repo.repo+'</a>')
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
	var authorsnum = 0;
	for (authorN in authors) {
		authorsnum++;
	}
	var columnitems = Math.round((authorsnum/6));
	console.log("Items per Column:"+ columnitems);
	var myHTML = '<div class="row">';
	for (authorN in authors) {
		var author = authors[authorN];
			myHTML += '<div class="col-md-4 col-xs-24">'

		myHTML += commitHTML.replace("${USERHOME}",author.html_url)
							.replace("${IMG}",author.avatar_url)
							.replace("${NAME}",author.login)
							.replace("${N}",author.contributions);

	myHTML += '</div>';

}
myHTML += '</div>';
return myHTML;
}

function addSection(name) {
	return '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"><i class="fa fa-user"></i> '+name+'</h3></div><div class="panel-body">';
}

function finished() {
	finishCount++;

	if (finishCount == finalCount) {
		writeHTML();
	}
}

function addThirdPartCredits() {
	var thirdparty;
	var creditsjson=fs.readJsonSync(__dirname+'/credits.json');
	for (i = 0; i < creditsjson.categories.length; i++) {
		var category =  creditsjson.categories[i];
		console.log('Writing Category ' + category.name)
    thirdparty += '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"><i class="fa '+category.icon +'"></i> ';
		thirdparty += category.name
		thirdparty+= '</h3></div><div class="panel-body">';
		for (a = 0; a < category.credits.length; a++) {
			var item =  category.credits[a];
			if (item.logo) {
					thirdparty += '<img src="' + item.logo + '" width=50> </a>';
			}
			thirdparty += '<strong>' + item.name  +'</strong> by ';
			if (item.link) {
				thirdparty += '<a href="' + item.link + '"target="_blank">' + item.author + '</a><br>\n';
			} else {
				 thirdparty += item.author +  '<br>\n'
			}

		}
		thirdparty+= '</div></div>';
}

	return thirdparty
}

function writeHTML() {
	var html = '<div class="box"><div class="boxHeader"><div class="title"><h2>Credits</h2></div></div>	';
	for (itemN in array) {
			var item = array[itemN];
		console.log(item.name);
		if (item.name == 'Volumio2-UI Bower') {
			var htmlbower = addPackages(item.deps);
			htmlbower += addPackages(item.devDeps);
		} else  if (item.name == 'Volumio2-UI'){
		html += addSection(item.name);
		html += addPackages(item.deps);
		html += addPackages(item.devDeps);
		html += htmlbower;
		html += '</div></div>';
		html += addSection(item.name+' Contributors');
		html += addAuthors(item.authors);
		html += '</div></div>';
	} else {
		html += addSection(item.name);
		html += addPackages(item.deps);
		html += addPackages(item.devDeps);
		html += '</div></div>';
		html += addSection(item.name+' Contributors');
		html += addAuthors(item.authors);
		html += '</div></div>';
	}
	}
	html += addThirdPartCredits();
	html += '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"><i class="fa fa-info-circle"></i> License</h3></div><div class="panel-body"><p>'
	html += '<p><span class="help-block">This Program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation either version 3, '
	html += 'or (at your option) any later version. This Program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.'
	html += 'See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with Volumio; see the file COPYING. '
	html += 'If not, see <a href="http://www.gnu.org/licenses/" target="_blank">http://www.gnu.org/licenses</a></span></p></p></div></div>'
	html += '\n'
	html += '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title"><i class="fa fa-info-circle"></i> Legal Disclaimer </h3></div><div class="panel-body"><p>'
	html += '<p><strong>Copyright © 2013-2016 Michelangelo Guarise</strong>'
	html += '<span class="help-block">Volumio name and logo can be used for commercial purposes only with an explicit authorization. <a href="mailto:info@volumio.org">Contact us</a> for details. </span>'
	html += '<span class="help-block">We are not responsible for any damage to your computer or appliances caused by Volumio. Use it by your own risk.'
	html += 'Volumio uses several trademarks from different projects. Their rights are not overruled by our license and stay intact.</span>'
	html += '<span class="help-block"><i>All trademarks, copyrights and other forms of intellectual property belong to their respective owners.</i></span>'
	html += '<span class="help-block">Linux is a registered trademark of Linus Torvalds in the U.S. and other countries.'
	html += 'Spotify is a registered trademark of Spotify AB.'
	html += 'Airplay is a registered trademark of Apple Inc.'
	html += 'Direct-Stream Digital (DSD) is a registered trademark of Sony Corporation and Philips AG.</span>'
  html += '</p></div></div>'

	var creditsPath = "src/app/themes/" + theme + "/assets/static-pages/credits.html";
  console.log(creditsPath);
	fs.writeFile(creditsPath, html);
	console.log("Wrote html");
}
