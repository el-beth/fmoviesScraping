// this sorta works, it just repeats the filemoon embed at index 0 and 3 o each embed

function getEpisodes(){
	var episodeSelector = "div#episodes > div.episodes > div.range > div.episode > a";
	if (document.querySelectorAll(episodeSelector) !== null){
		return document.querySelectorAll(episodeSelector);
	};
}

var episodes = getEpisodes();
var episodeIndex = 0;

////////////////////////

var embedSelector = "div#player > iframe";
var servers, embeds=[], processed={};

function getCurrentEmbedSrc(){
	if (document.querySelector(embedSelector) !== null){ // assuming that if iframe is there it's src will be a non-zero string
		if (document.querySelector(embedSelector).src.length > 0){
			return document.querySelector(embedSelector).src;
		}
	} else {
		setTimeout(getCurrentEmbedSrc, 0.5*1000);
	}
}

function commitCurrentBatch(){
	if (embeds.length === servers.length){
		processed[document.location.toString()] = embeds;
		if (episodeIndex < episodes.length){
			++episodeIndex;
			processEpisode();
		}
	} else {
		setTimeout(commitCurrentBatch, 500)
	}
}

function dispatchProcessing(){
	var server = servers[i];
	if (i < servers.length){
		if (server.classList.contains("active") && document.querySelector(embedSelector) != null){
			embeds.push(getCurrentEmbedSrc());
			server = servers[++i];
			server.click();
			setTimeout(dispatchProcessing, 1000);
		} else {
			setTimeout(dispatchProcessing, 1000);
		}
	}
};

function getServerList(){
	return document.querySelectorAll("div#servers > div.server");
}

function processServers(){
	i=0;
	servers = getServerList();
	servers[i].click();
	embeds=[];
	dispatchProcessing();
	commitCurrentBatch();
};

////////////////////////

function assertEpisodeSelection(){
	if (episodes[episodeIndex].classList.contains("active")){
		// what to do after selecting an episode
		processServers();
	} else {
		setTimeout(assertEpisodeSelection, 300);
	};
}

function processEpisode(){
	episode = episodes[episodeIndex];
	episode.click();
	assertEpisodeSelection();
}

function processPage(){
	processEpisode();
}

processPage();
