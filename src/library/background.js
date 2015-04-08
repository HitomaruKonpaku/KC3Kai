/* BACKGROUND ACTIONS
---------------------------------*/
var KC4BG = {

	/* [get_option]
	Content scripts request for localStorage
	------------------------------------------*/
	get_option:function(request, sender, response){
		// If field requested exists in localStorage
		if(typeof localStorage[request.field] != "undefined"){
			response({
				success: true,
				value: localStorage[request.field]
			});
		
		// Does not exist in localStorage
		}else{
			response({
				success: false,
			});
		}
	},
	
	/* [set_api_link]
	API Link extracted, save and open
	------------------------------------------*/
	set_api_link:function(request, sender, response){
		localStorage.absoluteswf = request.swfsrc;
		localStorage.extract_api = false;
		window.open("../pages/game/game.html", "kc4_game");
		response({success:true});
		chrome.tabs.remove([sender.tab.id], function(){});
	},
	
	/* [activate_game]
	Try to activate game inside inspected tab
	------------------------------------------*/
	activate_game:function(request, sender, response){
		console.log('Admiral Dashboard requests to attempt game activation at Tab#'+request.tabId);
		chrome.tabs.sendMessage(request.tabId, {
			game:"kancolle",
			type:"game",
			action:"activate"
		}, response);
		return true; // dual-async response
	}
	
};

/* INTERACTION REQUESTS
---------------------------------*/
chrome.runtime.onMessage.addListener(function(request, sender, response) {
	// Check if call was inteded for this script
    if(request.game==="kancolle" && request.type==="background"){
		
		// Check if action exists
		if(typeof KC4BG[request.action] != "undefined"){
			
			// Execute action
			KC4BG[request.action](request, sender, response);
			return true; // dual-async response
		}else{
			// Unknown action
			response({ success: false });
		}
	}
});