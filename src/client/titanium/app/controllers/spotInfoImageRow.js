var ApiMapper = require("apiMapper").ApiMapper;
var apiMapper = new ApiMapper();

var args = arguments[0] || {};　　// index.jsから引数を受け取る
$.args =  args;

$.title.text = args.title;  // タイトル指定
$.imageView.image = args.picture; //イメージ（画像）指定
$.param.text = args.param;  // パラメータ指定
$.row.titleLabel = args.title;
$.row.param = args.param;
$.row.controller = args.controller;
$.row.navTitle = args.navTitle;
$.row.touchEnabled = args.touchEnabled;
$.row.selectionStyle = args.selectionStyle;
$.row.hasChild = args.hasChild;
$.row.imageView = args.imageView;

//初期処理
init();

function init(){
	if(Number(args.gospotCount) != 0){
		changeButtonStyle();
	}	
}

var goSpot = function goSpot() {
	//ログインチェック
	if(typeof Alloy.Globals.user.token === "undefined"){
		alert("この機能を利用するにはユーザ登録が必要です");
    }else{
	    var apiMapper = new ApiMapper();
	    apiMapper.spotAddGoSpotApi(
			Alloy.Globals.user.token,
	    	$.args.spot_id,
	    	function(){
				changeButtonStyle();
	    	},
	    	function(){
	    		// 失敗したとき
	    		alert('データの登録に失敗しました。 [spotAddGoSpot]');
	    	}
		);
	}
}

function changeButtonStyle(){
	$.goButton.color = "#FFF";
	$.goButton.backgroundColor = "#3B5998";
    $.goButton.touchEnabled = false;
}

