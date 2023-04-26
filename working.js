// This works, load the serial page -> Ctrl + Shift + K -> paste all of this
// script in the console -> hit Return and close the console with Ctrl + W.
// when the script finishes its work there will appear a button on the top
// left of the page, the button will read Copy JSON
var episodes;
var episode;
var episodeIndex;
var servers;
var server;
var serverIndex;
var embeds = [];
var processed = {};
var titleSelector = "li.breadcrumb-item:nth-child(3)";
var serversSelector = "div#servers > div.server";
var embedSelector = "div#player > iframe";
var vidStreamSrcRegex = /^https:\/\/vizcloud\.co\/e\/.+$/;
var myCloudSrcRegex = /^https:\/\/mcloud\.to\/e\/.+$/;
var filemoonSrcRegex = /^https:\/\/filemoon\.sx\/e\/.+$/;
var streamtapeSrcRegex = /^https:\/\/streamtape\.com\/e\/.+$/;

function $(selector){
	return document.querySelector(selector);
}

function $$(selector){
	return document.querySelectorAll(selector);
}

function getTitle(){
	return $(titleSelector).innerText.replaceAll(/^\/\s*/g,'');
}

function getEpisodes(){
	var episodeSelector = "div#episodes > div.episodes > div.range > div.episode > a";
	if ($$(episodeSelector) !== null){
		return $$(episodeSelector);
	};
}

episodes = getEpisodes();
episodeIndex = 0;
episode = episodes[episodeIndex];
function assertEpisodesGet(){
	if (episodes.length > 0){
		console.info(`got ${episodes.length} episodes for ${getTitle()}`);
	} else {
		setTimeout(assertEpisodesGet, 100);
	}
}
assertEpisodesGet();

function assertEpisodeSelection(){
	if (episode.classList.contains("active")){
		servers = getServers();
		console.info(`episode selection asserted`);
	} else {
		setTimeout(assertEpisodeSelection, 100);
	}
}

function getServers(){
	return $$(serversSelector);
}

function assertIframe(){
	if ($(embedSelector) === null){
		setTimeout(assertIframe, 100);
	} else {
		if (serverIndex === 0 && !vidStreamSrcRegex.test($(embedSelector).src)){
			setTimeout( () => { 
				servers[0].click();
			} , 100);
		}
	}
}

function assertServerSelection(){
	if (server.classList.contains("active")){
		assertIframe();
	} else {
		setTimeout(assertServerSelection, 100);
	};
};

function dispatchNextServer(){
	++serverIndex;
	server = servers[serverIndex];
	server.click();
	assertServerSelection();
	processServer();
};

function reportStatus(){
	var returnObject =  {
		"currentEpisodeNumber":`${document.location.toString().match(/[^\/]+$/)[0]}`,
		"episodeIndex":episodeIndex,
		"serverIndex":serverIndex
	};
	return returnObject.toString();
}

function processServer(){
	if ($(embedSelector) !== null){
		reportStatus();
		console.info('iframe is there')
		if ($(embedSelector).src.length !== 0){
			if (serverIndex === 0 && vidStreamSrcRegex.test($(embedSelector).src)){
				embeds[0] = ($(embedSelector).src);
				dispatchNextServer();
			} else if (serverIndex === 1 && myCloudSrcRegex.test($(embedSelector).src)){
				embeds[1] = ($(embedSelector).src);
				dispatchNextServer();
			} else if (serverIndex === 2 && filemoonSrcRegex.test($(embedSelector).src)){
				embeds[2] = ($(embedSelector).src);
				dispatchNextServer();
			} else if (serverIndex === 3 && streamtapeSrcRegex.test($(embedSelector).src)){
				embeds[3] = ($(embedSelector).src);
				processed[document.location.toString()] = embeds;
				embeds=[];
				if (episodeIndex < episodes.length){
					++episodeIndex;
					episode=episodes[episodeIndex];
					processEpisode();
				} else {
					console.info('finished processing');
					return 0;
				}
			} else {
				setTimeout(processServer, 100);
			}
		} else {
			setTimeout(processServer, 100);
		}
	} else {
		setTimeout(processServer, 100);
	}
};

function processEpisode(){
	episode.click();
	assertEpisodeSelection();
	serverIndex = 0;
	server = servers[0];
	server.click();
	assertServerSelection();
	processServer();
}

function announceCompletion(){
	if (Object.keys(processed).length === episodes.length){
		console.info(`finished processing`);
		var logo = $("a#logo");
		var logoContainer = logo.parentElement;
		logo.remove();
		var button = document.createElement('button');
		button.innerText = "Copy JSON";
		var attr = {"fontSize":"5em", "color":"white", "position":"fixed", "left":"20px"};
		button.style.fontSize = "5em";
		button.style.color = "white";
		button.style.position = "fixed";
		button.style.left = "20px";
		button.style.zIndex = "2147483647";
		button.classList = "mt-5 btn btn-lg btn-outline-primary";
		logoContainer.prepend(button);

		button.addEventListener("click", () => {
			navigator.clipboard.writeText(JSON.stringify(processed));
		});
	} else {
		setTimeout(announceCompletion, 3000);
	};
};

processEpisode();
announceCompletion()