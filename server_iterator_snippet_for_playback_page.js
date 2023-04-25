// this works

var embedSelector = "div#player > iframe";

function getServerList(){
	return document.querySelectorAll("div#servers > div.server");
}

function getCurrentEmbedSrc(){
	if (document.querySelector(embedSelector) !== null){
		if (document.querySelector(embedSelector).src.length > 0){
			return document.querySelector(embedSelector).src;
		}
	} else {
		setTimeout(getCurrentEmbedSrc, 0.5*1000);
	}
}

var servers = getServerList(), embeds=[];
i=0;
servers[i].click()
function processServer(){
	server = servers[i];
	if (i < servers.length){
		if (server.classList.contains("active") && document.querySelector(embedSelector) != null){
			embeds.push(getCurrentEmbedSrc());
			server = servers[++i];
			server.click();
			setTimeout(processServer, 1000);
		} else {
			setTimeout(processServer, 1000);
		}
	}
};
processServer();