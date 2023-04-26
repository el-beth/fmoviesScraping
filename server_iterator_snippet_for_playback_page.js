// this works

var embedSelector = "div#player > iframe";
var servers = getServerList(), embeds=[], processed={};

function getServerList(){
	return document.querySelectorAll("div#servers > div.server");
}

function getCurrentEmbedSrc(){
	if (document.querySelector(embedSelector) !== null){ // assuming that if iframe is there it's src will be a non-zero string
		if (document.querySelector(embedSelector).src.length > 0){
			return document.querySelector(embedSelector).src;
		}
	} else {
		setTimeout(getCurrentEmbedSrc, 0.5*1000);
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

function commitCurrentBatch(){
	if (embeds.length === servers.length){
		processed[document.location.toString()] = embeds;
	} else {
		setTimeout(commitCurrentBatch, 500)
	}
}

function processServers(){
	i=0;
	servers[i].click();
	embeds=[];
	dispatchProcessing();
	commitCurrentBatch();
};

processServers();
