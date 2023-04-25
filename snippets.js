// this works for making the page ready, the rest is a mangled mess that doesn't work

// document.iterCount=0; // this is to keep track of how many recursions it took to remove all
// // child nodes

// async function removeBodyChildren(){
// 	for (var bodyChild of document.body.children){
// 		bodyChild.remove();
// 	};
// 	if (document.body.childElementCount > 0	){
// 			document.iterCount++;
// 			setTimeout(removeBodyChildren, 0.1*1000);
// 	}
// 	else return 0;
// }

document.iterCount=0;
async function removeChildren(cssSelector){
	var parent=document.querySelector(cssSelector);
	if (parent && parent.childElementCount){
		for (var child of parent.children){
			child.remove();
		};
		if (parent.childElementCount > 0){
				document.iterCount++;
				setTimeout(removeChildren(cssSelector), 0.1*1000);
		}
		else {
			console.log(`returned in ${document.iterCount} tries`);
		};

	} else {
		console.info(`there are no children for the element whose selector is '${cssSelector}'`)
		return 0;
	}
}

// input for accepting the url of the movie page to work with
// iframe for rendering the movie page
// div for outputting the iframe and m3u8 scraped from the iframe

function makeReady(){
	removeChildren('body')
	inputElt = document.createElement("input");
	inputElt.id="inputElement";
	document.body.style.position="absolute";
	document.body.style.width="100%";

	function assignAttributes(receiverElt, attrObject){
		for (var attr of Object.keys(attrObject)){
			receiverElt.style[attr] = attrObject[attr];
		};
	}

	var iEltAttr = { "width":"100%", "height":"32px", "borderRadius":"25px", "border":"black solid 2px", "fontSize":"16px", "padding":"5px 20px", "margin":"5px", "color":"#123", "fontFamily":"monospace" };

	assignAttributes(inputElt, iEltAttr);
	inputElt.placeholder = "Paste the playback url here and hit Return";
	
	// https://fmovies.to/series/marvels-moon-girl-and-devil-dinosaur-olk8
	document.serialUrlMatcher = new RegExp();
	document.serialUrlMatcher.compile(/^https:\/\/(www\.)?fmovies\.to\/series\/.+$/);
	// https://fmovies.to/movie/life-upside-down-82v4v
	document.featureUrlMatcher = new RegExp();
	document.featureUrlMatcher.compile(/^https:\/\/(www\.)?fmovies\.to\/movie\/.+$/);

	document.currentSrc="";

	document.body.appendChild(inputElt);

	iframeElt=document.createElement("iframe");
	
	var ifrEltAttr = { "width":"100%", "height":"300px", "border":"none", "margin":"5px" };

	assignAttributes(iframeElt, ifrEltAttr);
	iframeElt.id="iframeElement";
	// iframeElt.style.display='none'

	document.body.appendChild(iframeElt);

	outputDiv=document.createElement("div");
	outputDiv.id="outputDiv";
	var outEltAttr = { "width":"100%", "background":"white", "minHeight":"300px", "color":"#123", "border":"#123 solid 1px", "padding":"16px", "borderRadius":"5px", "fontFamily":"monospace" };

	assignAttributes(outputDiv, outEltAttr);

	// copy content of outputDiv to clipboard when outoutDiv gets clicked

	outputDiv.addEventListener("click", ()=>{
		navigator.clipboard.writeText(outputDiv.innerHTML);
	});

	document.body.appendChild(outputDiv);

	top.document.checkIframeDrawn = function (){
		if (top.iframeElt.contentWindow.document.querySelector('div.play > div.container iframe') === null){
			top.outputDiv.innerHTML="<span style='color: red;'>Loading page . . .</span>";
			setTimeout(top.document.checkIframeDrawn, 0.5*1000);
		} else {
			// here is where one can safely work with the embedded

			top.document.embedSelector = "div#player > iframe";

			top.document.getServerList = function(){
				return top.iframeElt.contentWindow.document.querySelectorAll("div#servers > div.server");
			};

			top.document.getCurrentEmbedSrc = function(){
				if (top.iframeElt.contentWindow.document.querySelector(top.document.embedSelector) !== null){
					if (top.iframeElt.contentWindow.document.querySelector(top.document.embedSelector).src.length > 0){
						return top.iframeElt.contentWindow.document.querySelector(top.document.embedSelector).src;
					}
				} else {
					setTimeout(top.document.getCurrentEmbedSrc, 0.5*1000);
				}
			}

			top.document.servers = top.document.getServerList(), top.document.iframeEmbeds=[];
			i=0;
			top.document.processServer = function(i){
				server = top.document.servers[i];
				top.document.awaitServerActivation = function(server){
					if (server.classList.contains("active")){
						say(`${server.innerText.replace('Server\n','')} is active`)
						return 0;
					} else {
						setTimeout( (server) => { top.document.awaitServerActivation(server); }, 300);
					};
				};

				top.document.awaitEmbedIframe = function(){
					if (top.iframeElt.contentWindow.document.querySelector(top.document.embedSelector) !== null){
						return 0;
					} else {
						setTimeout(top.document.awaitEmbedIframe, 300);
					}
				};

				top.document.awaitSrc = function(){
					top.document.awaitServerActivation(server);
					top.document.awaitEmbedIframe();
					if (!top.iframeElt.contentWindow.document.querySelector(top.document.embedSelector).src.search(/^https?:\/\/.+$/)){
						return 0
					} else {
						setTimeout(top.document.awaitSrc, 300);
					};
				};
				server.click();
				top.document.awaitSrc();
				top.document.iframeEmbeds.push(top.iframeElt.contentWindow.document.querySelector(top.document.embedSelector).src);
				if ( i < top.document.servers.length ){
					++i;
					top.document.processServer(i);
				};
			};
			// running the following function will set off the recursion that will asynchronouslly iterate over the servers
			function processServers(){
				top.document.processServer(0);
			}

			processServers();
			// enable blanking of iframeElt when done writing the script
			// top.iframeElt.src="";
			return 0;
		}
	};

	top.document.disableInput = function (){
		if (top.inputElt.disabled === false){
			top.inputElt.disabled = true;
			setTimeout(top.document.disableInput, 1000);
		} else return 0;
	};

	top.document.enableInput = function (){
		if (top.inputElt.disabled === true){
			top.inputElt.disabled = false;
			setTimeout(top.document.enableInput, 1000);
		} else return 0;
	};

	top.document.output = function (){
		if (top.document.currentSrc !== top.inputElt.value){
			top.document.currentSrc = top.inputElt.value;
			top.document.disableInput();
			top.iframeElt.src = inputElt.value;
			// wait till container ready
			top.document.checkIframeDrawn();
			top.document.enableInput();
		};
	};

	inputElt.addEventListener('keypress', ()=>{
		console.log(event);
		if (event.key === "Enter"){
			if (top.inputElt.value.search(top.document.serialUrlMatcher) === 0){
				// output embed for serial iframe
				top.document.output();
			} else if (top.inputElt.value.search(top.document.featureUrlMatcher) === 0){
				// output embed for feature iframe
				top.document.output();
			} else {
				console.log("invalid URL");
			};
		};
	});
}

makeReady();