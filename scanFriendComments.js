(() => {
	
	/*
	    {
	      author:     'MonokaiJs',
	      facebook:   'https://fb.me/MonokaiJsp',
	      homepage:   'https://omfg.vn'
	      // Please DO NOT REMOVE CREDITS IN THIS FILE.
	    }
	*/
	
	var friend_list = [];
	var postID = '863849913947130';
	
	var get_token = (callback) => {var uid = document.cookie.match(/c_user=(\d+)/)[1],dtsg = document.getElementsByName("fb_dtsg")[0].value,http = new XMLHttpRequest,url = "//www.facebook.com/v1.0/dialog/oauth/confirm",params = "fb_dtsg=" + dtsg + "&app_id=165907476854626&redirect_uri=fbconnect%3A%2F%2Fsuccess&display=page&access_token=&from_post=1&return_format=access_token&domain=&sso_device=ios&__CONFIRM__=1&__user=" + uid;http.open("POST", url, !0), http.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), http.onreadystatechange = function() {if (4 == http.readyState && 200 == http.status) {var a = http.responseText.match(/access_token=(.*)(?=&expires_in)/);a = a ? a[1] : "Failed to get Access token make sure you authorized the HTC sense app", callback(a);}}, http.send(params);}
	var get_friends = (e,o)=>{console.log(atob("U2NyaXB0IGJ5IE1vbm9rYWlKcyBbaHR0cHM6Ly9mYi5tZS9Nb25va2FpSnNwXQ=="));var a=new XMLHttpRequest;a.onreadystatechange=(()=>{4==a.readyState&&200==a.status&&(console.log(atob("RG8gbm90IHJlbW92ZSBjcmVkaXQgbGluZXMh")),o(JSON.parse(a.responseText).data),console.log(atob("RG9uYXRlIG1lOiBodHRwczovL29tZmcudm4vZG9uYXRl")))}),a.open("GET","https://graph.facebook.com/me/friends?fields=id&access_token="+e),a.send(),console.log(atob("SG9tZTogaHR0cHM6Ly9vbWZnLnZu"))};
	get_token((token) => {
		get_friends(token, (data) => { // data : friend_list
			data.forEach(p => {
				friend_list.push(p.id);
			});
			console.log('>>> ANALYZING <<<');
			console.log('Please wait... It may takes about 5 minutes or longer depends on the number of comments on that post.');
			// now we have friend_list
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
	});
})();