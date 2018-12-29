(() => {
  
  /*
    {
      author:     'MonokaiJs',
      facebook:   'https://fb.me/MonokaiJsp',
      homepage:   'https://omfg.vn'
      // Please DO NOT REMOVE CREDITS IN THIS FILE.
    }
  */
	var friend_list = ['id']; //
	var postID = '2600588390015644';
	
	var get_token = (callback) => {
		var fb_dtsg = document.getElementsByName('fb_dtsg')[0].value;
		var http = new XMLHttpRequest;
		var data = new FormData();
		data.append('fb_dtsg', fb_dtsg);
		data.append('app_id', '165907476854626');
		data.append('redirect_uri', 'fbconnect://success');
		data.append('display', 'popup');
		data.append('ref', 'Default');
		data.append('return_format', 'access_token');
		data.append('sso_device', 'ios');
		data.append('__CONFIRM__', '1');
		http.open('POST', 'https://www.facebook.com/v1.0/dialog/oauth/confirm');
		http.send(data);
		http.onreadystatechange = function(){
			if(http.readyState == 4 && http.status == 200) {
				var http2 = new XMLHttpRequest;
				http2.open('GET', 'https://b-api.facebook.com/restserver.php?method=auth.getSessionForApp&format=json&access_token='+http.responseText.match(/access_token=(.*?)&/)[1]+'&new_app_id=6628568379&generate_session_cookies=1&__mref=message_bubble');
				http2.send();
				http2.onreadystatechange = function(){
					if(http2.readyState == 4 && http2.status == 200){
						var http3 = new XMLHttpRequest;
						var token = JSON.parse(http2.responseText).access_token;
						callback(token);
					}
				}
			}
		}
	}
	get_token((token) => {
		var analyze_comments = (url) => {
			var r = new XMLHttpRequest;
			r.onreadystatechange = () => {
				if (r.readyState == 4 && r.status == 200) {
					var retrieved_cmt_data = JSON.parse(r.responseText);
					var comments = retrieved_cmt_data.data;
					comments.forEach(comment => {
						if (friend_list.includes(comment.from.id)) {
							console.log(' ------------------------------','\n',comment.from.name + ' [' + comment.from.id + '] ('+comment.created_time+'): \n',comment.message,'\n','Link: https://facebook.com/' + comment.id,'\n','------------------------------');
						}
					});
					if (typeof retrieved_cmt_data.paging.next !== 'undefined') {
						analyze_comments(retrieved_cmt_data.paging.next);
					}
				}
			}
			r.open('GET', url);
			r.send();
		}
		analyze_comments('https://graph.facebook.com/'+postID+'/comments?fields=from,message&access_token=' + token);
	});
})();