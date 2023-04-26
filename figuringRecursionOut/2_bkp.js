var episodes;
var episode;
var episodeIndex;
var titleSelector = "li.breadcrumb-item:nth-child(3)";

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
		setTimeout(assertEpisodesGet, 1000);
	}
}
assertEpisodesGet();

function assertEpisodeSelection(){
	if (episode.classList.contains("active")){
		console.info(`episode selection asserted`);
	} else {
		setTimeout(assertEpisodeSelection, 1000);
	}
}

function processEpisode(){
	episode.click();
	assertEpisodeSelection();
}

processEpisode();