/** BACKUP **/


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
	inputElt.style.width="100%";
	inputElt.style.height="32px";
	inputElt.style.borderRadius="25px";
	inputElt.style.border="black solid 2px";
	inputElt.style.fontSize="16px";
	inputElt.style.padding="5px 20px";
	inputElt.style.margin="5px";
	inputElt.style.color="#123";
	inputElt.style.fontFamily="monospace";
	inputElt.placeholder="Paste the playback url here and hit Return";
	
	// https://fmovies.to/series/marvels-moon-girl-and-devil-dinosaur-olk8
	document.serialUrlMatcher = new RegExp();
	document.serialUrlMatcher.compile(/^https:\/\/(www\.)?fmovies\.to\/series\/.+$/);
	// https://fmovies.to/movie/life-upside-down-82v4v
	document.featureUrlMatcher = new RegExp();
	document.featureUrlMatcher.compile(/^https:\/\/(www\.)?fmovies\.to\/movie\/.+$/);

	document.currentSrc="";

	document.body.appendChild(inputElt);

	iframeElt=document.createElement("iframe");
	iframeElt.style.width="100%";
	iframeElt.style.height="300px";
	// iframeElt.style.display='none'
	iframeElt.id="iframeElement";
	iframeElt.style.border="none";
	iframeElt.style.margin="5px";

	document.body.appendChild(iframeElt);

	outputDiv=document.createElement("div");
	outputDiv.style.width="100%";
	outputDiv.id="outputDiv";
	outputDiv.height="100%";
	outputDiv.style.background="white";
	outputDiv.style.minHeight="300px";
	outputDiv.style.color="#123";
	outputDiv.style.border="#123 solid 1px";
	outputDiv.style.padding="16px";
	outputDiv.style.borderRadius="5px";
	outputDiv.style.fontFamily="monospace";

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

			
			top.outputDiv.innerText = top.iframeElt.contentWindow.document.querySelector('div.play > div.container iframe').src;

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