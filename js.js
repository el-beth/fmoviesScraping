var inputElt = $("input"), dismissButton = $$("i"), tokenFilter=/https?:\/\/(www\.)?fmovies\.to\/[^ ]+/ig, queue = [];
queue.urls = [];
function $(i){ return document.querySelector(i); };
function $$(i){ return document.querySelectorAll(i); };

function Task(url){
	this.url = url;
	this.state = ""; // queued, processing, canceled, finished
	this.consequence; // if previous is finished, here goes either success of failure
	this.output = {}; // if state is finished, here will be the JSON output of the scrape
	queue.urls.push(url); // this is for a quick reference while queuing
	// this.addToQueue = function (){
	// 	 queue.push(this);
	// };
	this.removeFromQueue = function (){
		this.state = "canceled";
	};
}; // constructor to a task object


function tokenize(){
	var inputElt = event.target;
	if (event.key === "Enter"){
		if (inputElt.value.length !== 0){
			var text = inputElt.value;
			var tokens = text.match(tokenFilter);
			for (var i of tokens){
				if (!queue.urls.includes(i)){
					queue.push(new Task(i)); // only work on that which is not already in queue
				} else {
					continue;
				};
				var d = document.createElement('div');
				d.classList = "token-container";
				var s = document.createElement('span');
				s.classList = "token-container";
				s.innerText = i;
				var x = document.createElement('span');
				x.classList = "dismiss-button";
				x.addEventListener("click", removeToken);
				x.innerText = "ｘ";
				d.appendChild(s);
				d.appendChild(x);
				$("body").appendChild(d);
			};
			inputElt.value = "";
		}
	}
};
inputElt.addEventListener("keypress", tokenize)

// $('.dismiss-button').addEventListener('click', removeToken);
function removeToken(){
	event.target.parentElement.remove();
	var url = event.target.parentElement.innerText.replace(/ｘ$/,'');
	var index = queue.urls.lastIndexOf(url);
	queue[index].removeFromQueue();
}