// wait for page to load
// generate a list of episodes and store in global variable episodes
// determine number of episodes is greater than zero
// create global variables episodeIndex, episode
// set episodeIndex to 0
// assign episodes[episodeIndex] - i.e. the first episode to variable episode
// click on episode
// assert episode selection by waiting until classList of episode contains "active"
// create global variables servers, server, serverIndex, embeds=[], processed={}
// generate servers for currently selected episode and assign to its variable, servers
// assert server length is greater than zero
// set serverIndex to 0
// assign servers[serverIndex] to the variable server
// click on server ==>processServerStart
// assert server's classList contains "active"
// assert iframe exists
// assert server selection by checking if the src of the iframe corresponds to that server
// if src corresponds to server, push src to embeds
// if serverIndex equals (servers.length)-1, put embeds in processed using document.location.toString() as it's field
// increment serverIndex
// if serverIndex less than servers.length call processServer()