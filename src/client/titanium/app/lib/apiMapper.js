/**
 * @author KOMATSU Issei
 */

/**
 * インスタンス化の仕方
 * var ApiMapper = require("lib/ApiMapper").ApiMapper;
 * var apiMapper = new ApiMapper();
 */

/*
 * 天気予報を取得するサンプル
 *
apiMapper.forecastApi(
	"41",		// 緯度
	"139.7",	// 経度
	function(){
		// 成功したとき
		 var json = eval('(' + this.responseText + ')');
		 alert(json.forecast.temperature.min); // 最低気温をalert表示
		 label1.text = json.forecast.date;	// label1 のテキストを日付に変更する場合
	},
	function(){
		// 失敗したとき
		alert('天気予報の取得に失敗しました');
	}
);
*/

/*
 * 通知設定をするサンプル
 *
apiMapper.notificationApi(
	"deviceId",	// device_id
	"41",		// 緯度
	"139.7",	// 経度
	function(){
		// 成功したとき
		 var json = eval('(' + this.responseText + ')');
		 alert(json);
	},
	function(){
		// 失敗したとき
		alert('通知の設定に失敗しました');
	}
);
*/

/*
 * プリミティブなAPIアクセサ
 * 原則、プライベートメソッドとする
 *
apiMapper.accessApi(
	'GET',
	'http://freeze.test.cheek-it.com/api/forecast.json?lat=41.123&lon=141',
	{},
	function (){
		// 成功したとき
		alert(this.responseText);
	},
	function (){
		alert("ERROR");
	}
);
*/

ApiMapper = function(){};
//ApiMapper.prototype.apiEndpoint = "http://aoyama.cheek-it.com/api";
ApiMapper.prototype.apiEndpoint = Alloy.Globals.app.api_endpoint;
ApiMapper.prototype.accessApi = function(method, uri, param, callback_success, callback_failure,callback_status) {

		// オフラインなら失敗
		if(Titanium.Network.online == false){
		    return false;
		}

		var xhr = Titanium.Network.createHTTPClient();
		xhr.onload = callback_success;
		xhr.onerror = callback_failure;
		xhr.onsendstream = callback_status;
		xhr.open(method, uri);
		xhr.send(param);

		return true;
};

ApiMapper.prototype.spotAllApi = function (callback_success, callback_failure){
	return this.accessApi('GET', this.apiEndpoint + "/spot/all.json", {}, callback_success, callback_failure,'');
}

ApiMapper.prototype.spotMyApi = function (token, callback_success, callback_failure){
	return this.accessApi('GET', this.apiEndpoint + "/spot/my.json?token=" + token, {}, callback_success, callback_failure,'');
}

ApiMapper.prototype.spotcheckinApi = function (token, spot_id, comment,rating_1,rating_2,rating_3,image,callback_success, callback_failure,callback_status){
	return this.accessApi(
		'POST',
		this.apiEndpoint + "/spot/checkin.json",
		{token : token, spot_id : spot_id, comment : comment, rating_1:rating_1,rating_2:rating_2,rating_3:rating_3,image:image},
		callback_success,
		callback_failure,
		callback_status);
}

ApiMapper.prototype.userregisterApi = function (name, social_type, social_token, social_secret, fb_username, tw_username, callback_success, callback_failure){
	return this.accessApi(
		'POST',
		this.apiEndpoint + "/user/register.json",
		{name : name, social_type : social_type, social_token : social_token,social_secret : Ti.Utils.md5HexDigest("cheekit" + social_secret), fb_username : fb_username, tw_username : tw_username },
		callback_success,
		callback_failure,
		'');
}

ApiMapper.prototype.usermyApi = function (token, callback_success, callback_failure){
	return this.accessApi(
		'GET',
		this.apiEndpoint + "/user/my.json?token="+ token,
		{},
		callback_success,
		callback_failure,
		'');
}

ApiMapper.prototype.userNotificationApi = function (token,social_type,social_token,social_secret,post, callback_success, callback_failure){
	return this.accessApi(
		'POST',
		this.apiEndpoint + "/user/notification.json",
		{token : token,social_type : social_type,social_token : social_token,social_secret : social_secret,post : post},
		callback_success,
		callback_failure,
		'');
}

ApiMapper.prototype.spotUpimageApi = function (callback_success, callback_failure,image_name,image){
	return this.accessApi('POST',
		 this.apiEndpoint + "/spot/up_image.json",
		 {name:image_name,image:image},
		 callback_success,
		 callback_failure,
		 '');
}

ApiMapper.prototype.spotImageApi = function (spot_id,callback_success, callback_failure){
	return this.accessApi(
		'GET',
		// this.apiEndpoint + "/spot/get_image.json?spot_id=" + spot_id + "&user_id=" + user_id,
		this.apiEndpoint + "/spot/get_image.json?spot_id=" + spot_id　+ "&user_id=",
		{},
		callback_success,
		callback_failure,
		'');
}

ApiMapper.prototype.spotCountInfoApi = function (token,spot_id,callback_success, callback_failure){
	return this.accessApi(
		'GET',
		this.apiEndpoint + "/spot/countinfo.json?token=" + token + "&spot_id=" + spot_id,
		{},
		callback_success,
		callback_failure,
		'');
}

ApiMapper.prototype.spotAddGoSpotApi = function (token, spot_id,callback_success, callback_failure){
	return this.accessApi('PUT',
		 this.apiEndpoint + "/spot/add_gospot.json",
		 {token:token,spot_id:spot_id},
		 callback_success,
		 callback_failure,
		 '');
 }
 
 ApiMapper.prototype.spotCommentApi = function (spot_id,callback_success, callback_failure){
	return this.accessApi(
		'GET',
		this.apiEndpoint + "/spot/get_comment.json?spot_id=" + spot_id,
		{},
		callback_success,
		callback_failure,
		'');
}

exports.ApiMapper = ApiMapper;