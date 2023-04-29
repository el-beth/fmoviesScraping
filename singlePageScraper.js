// paste this in a console opened after navigating to https://fmovies.to
var global = top.document;
global.iframeLoaded = false;
global.iframeLoading = false;
global.iframeElt = document.createElement('iframe');
global.inputElt = document.createElement('input');


function createScraperPage(){
	for (var bodyChild of document.body.children){
		bodyChild.remove();
	};
	if (document.body.childElementCount > 0	){
			setTimeout(createScraperPage, 100);
	}
	else {
		// once all elements have been removed, draw my page
		var spanElt = document.createElement('span');
		spanElt.innerText=" > ";
		spanElt.style.color = "#456";
		spanElt.style.position = "absolute";
		spanElt.style.left = "65px";
		spanElt.style.top = "24px";
		spanElt.style.fontWeight = "bold";
		spanElt.style.zIndex = "1";

		global.inputElt.style.position = "fixed";
		global.inputElt.style.top = "10px";
		global.inputElt.style.left = "3%";
		global.inputElt.style.border = "#066 2px solid";
		global.inputElt.style.borderRadius = "20px";
		global.inputElt.style.height = "40px";
		global.inputElt.style.width = "92%";
		global.inputElt.style.paddingLeft = "40px";
		global.inputElt.style.fontFamily = "monospace";
		global.inputElt.style.fontSize = "1.3em";
		global.inputElt.style.margin = "5px auto";
		global.inputElt.style.color = "#123";
		global.inputElt.placeholder = "Paste URL here and press `Return`";
		global.inputElt.id = "inputElement";
		global.inputElt.type = "text";

		global.iframeElt.style.border = "none";
		global.iframeElt.style.width = "100%";
		global.iframeElt.style.position = "fixed";
		global.iframeElt.style.top = "70px";
		global.iframeElt.style.minHeight = "100%";

		global.inputElt.addEventListener("keypress", () => {
			if (event.key === "Enter"){
				if (/^https:\/\/fmovies\.to\/(series\/.+|movie\/.+)$/.test(global.inputElt.value)){
					loadIframe(global.inputElt);
				} else {
					global.inputElt.value = "";
					disableInput(global.inputElt);
					global.inputElt.style.color = "red"; 
					global.inputElt.placeholder = "WRONG INPUT";
					setTimeout((inputElt) => {
						inputElt.placeholder = "Paste URL here and press `Return`";
						inputElt.style.color = "#123";
						enableInput(inputElt); // this is animation
					} , 300, global.inputElt);
				}
			}
		});

		document.body.append(spanElt);
		document.body.append(global.inputElt);
		document.body.append(global.iframeElt);


	};
};

function $(i){
	return document.querySelector(i);
}

function startLoadingIframe(){
	disableInput(global.inputElt);
	global.iframeLoading = true;
	try {
		global.iframeElt.src = global.inputElt.value;
	} catch(e){
		setTimeout(startLoadingIframe, 100);
	}
}

function assertIframeLoaded(){
	if (global.iframeLoaded === false && global.iframeLoading === true){
		var serverEltSelector = "div#servers > div.server.active";
		try{
			var serverElt = global.iframeElt.contentWindow.document.querySelector(serverEltSelector)
			if (serverElt !== undefined){
				if (serverElt.checkVisibility()){
					// loading has ended
					global.iframeLoading = false;
					global.iframeLoaded = true;
				}
			}
		} catch (error){
			setTimeout(assertIframeLoaded, 1000);
		};
	}
}

function dispatchScraper(){
	if (global.iframeLoaded === true && global.iframeLoading === false){
		scrapeCurrentPage();
	} else {
		setTimeout(dispatchScraper, 1000);
	}
}

function loadIframe(inputElt){
	if (global.iframeLoaded === true && global.iframeLoading === false){
		// finished loading
		// dispatchScraper();
		console.info('finished loading IFrame');
	} else if (global.iframeLoaded === false && global.iframeLoading === true){
		// wait ( still loading ... )
		setTimeout(loadIframe, 1000);
		setTimeout(dispatchScraper, 1000)
	} else if (global.iframeLoaded === false && global.iframeLoading === false){
		startLoadingIframe();
		setTimeout(assertIframeLoaded, 500);
	};
}

function disableInput(inputElt){
	inputElt.disabled = true;
}

function enableInput(inputElt){
	inputElt.disabled = false;
}

function scrapeCurrentPage(){
	var episodes, episode, episodeIndex, servers, server, serverIndex, embeds = [], processed = {}, titleSelector = "li.breadcrumb-item:nth-child(3)", serversSelector = "div#servers > div.server", embedSelector = "div#player > iframe", vidStreamSrcRegex = /^https:\/\/vizcloud\.co\/e\/.+$/, myCloudSrcRegex = /^https:\/\/mcloud\.to\/e\/.+$/, filemoonSrcRegex = /^https:\/\/filemoon\.sx\/e\/.+$/, streamtapeSrcRegex = /^https:\/\/streamtape\.com\/e\/.+$/;
	global.processed = processed;
	function $(selector){
		return global.iframeElt.contentWindow.document.querySelector(selector);
	};

	function $$(selector){
		return global.iframeElt.contentWindow.document.querySelectorAll(selector);
	};

	function getEpisodes(){
		var episodeSelector = "div#episodes > div.episodes > div.range > div.episode > a";
		if ($$(episodeSelector) !== null){
			return $$(episodeSelector);
		};
	};

	function assertEpisodesGet(){
		if (episodes.length > 0){
			console.info(`got ${episodes.length} episodes}`);
		} else {
			setTimeout(assertEpisodesGet, 100);
		}
	};

	function assertEpisodeSelection(){
		if (episode.classList.contains("active")){
			servers = getServers();
			console.info(`episode selection asserted`);
		} else {
			setTimeout(assertEpisodeSelection, 100);
		}
	};

	function getServers(){
		return $$(serversSelector);
	};

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
	};

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

	function processServer(){
		if ($(embedSelector) !== null){
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
					processed[episode.href.toString()] = embeds;
					embeds=[];
					if (episodeIndex < episodes.length){
						++episodeIndex;
						episode=episodes[episodeIndex];
						processEpisode();
					} else {
						console.info('finished processing');
						enableInput(global.inputElt);
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
	};

	function stagnationHelper(){
		try {
			if ($("div#watch > div.play > div.container").innerText === "Server error, please refresh this page and try again"){
				$("div#servers > div.server.active").click();
				setTimeout(stagnationHelper, 5000);
			} else {
				setTimeout(stagnationHelper, 5000);
			};
		} catch(error){
			setTimeout(stagnationHelper, 5000);
		};
	};

	function announcing(){
		try {
			var lastKey = processed[episodes[episodes.length-1]]; // this will throw an exception until scraping ends
			// at end of scraping, this will keep going down the try block without existing the try block
			if (lastKey !== undefined){
				console.info(`finished processing`);
				var logo = $("a#logo");
				var logoContainer = logo.parentElement;
				logo.remove();
				var button = document.createElement('button');
				button.innerText = "Copy JSON";
				button.style.fontSize = "1.3em";
				button.style.color = "white";
				button.style.position = "fixed";
				button.style.left = "3%";
				button.style.borderRadius = "20px";
				button.style.top = "-30px";
				button.style.zIndex = "2147483647";
				button.classList = "mt-5 btn btn-lg btn-outline-primary";
				logoContainer.prepend(button);

				button.addEventListener("click", () => {
					navigator.clipboard.writeText(JSON.stringify(processed));
				});

				enableInput(global.inputElt);
				global.iframeLoaded = false;

			} else {
				console.info(`scraping not done yet`);
				setTimeout(announcing, 5000);	
			};
		} catch (error){
			console.info(`scraping not done yet`);
			setTimeout(announcing, 5000);
		};
	};

	episodes = getEpisodes();
	episodeIndex = 0;
	episode = episodes[episodeIndex];
	assertEpisodesGet();
	processEpisode();
	announcing();
	stagnationHelper();
}


// execution starts here
createScraperPage();
