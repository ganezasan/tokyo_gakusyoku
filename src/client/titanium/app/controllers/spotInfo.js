
var ApiMapper = require("apiMapper").ApiMapper;
var apiMapper = new ApiMapper();
var xhrFileUpload = require("xhr_fileupload");
var imageUrl = "http://gakusyoku.nas.iginga.com/images/spotImages/";
var Common = require("common").Common;
var common = new Common();

/**
 * コントローラ起動時に渡される引数処理
 */
var args = arguments[0] || {};
$.args =  args;

var initFlag = 0;

// 表示設定
// $.title.text = args.title || '';
// $.description.text = $.args.description || '';
// $.tableView.data = table_views();
$.spotInfo.addEventListener('focus', function(){
	//テーブルデータをセット
	tableDataSet($.args.spot_id);
});

//テーブルを表示
// tableDataSet($.args.spot_id);

// 呼び出し元からナビゲーションバーをセットする
exports.setNavigation = function(nav, parent){
    $.nav = nav;
    $.parent = parent;
};

// Checkinの有効無効設定
if( isUserLogined() &&
    isSpotNear($.args.currentPosition.latitude, $.args.currentPosition.longitude,
               $.args.spotPosition.latitude   , $.args.spotPosition.longitude)
    ){
    // チェックイン許可
    // $.comment.touchEnabled = true;
    // $.comment.value = $.args.comment || '';
    // $.comment.opacity = 1;
    $.checkinButton.touchEnabled = true;
    $.spotInfo.opacity = 1;
}else{
    // チェックイン拒否

    // ログイン状態に応じてコメントを変更
    if(isUserLogined()){
        if($.args.checkin){
            // すでにチェックインしていたときはコメントを入力
            // $.comment.value = $.args.comment;
        }else{
            //$.comment.value = "スポットに近づくとチェックインすることができます";
        }
    }else{
//        $.comment.value = "チェックインをするにはログインする必要があります";
        alert('チェックインするにはユーザ登録が必要です');
    }

	//後で戻す
    // $.comment.touchEnabled = false;
    // $.comment.opacity = 0.70;
    // $.checkinButton.touchEnabled = false;
    // $.checkinButton.opacity = 0.70;
}

/**
 * コメントボックスフォーカス時の設定
 */
// $.comment.addEventListener('focus', function(e){
    // // 1. 右上にチェックインボタンを表示する（キーボードで下部のチェックインボタンが隠れてしまうため）
    // var checkinButton = Ti.UI.createButton({title: 'Checkin'});
    // checkinButton.addEventListener('click', checkinSpot);
    // $.checkin.rightNavButton = checkinButton;
// });

/**
 * スポットにチェックインする
 */
var checkinSpot = function checkinSpot(){
   	var controller = Alloy.createController('checkin', $.args);
	var view = controller.getView();
    /**
     * ナビゲーションバー関連
     */
    controller.setNavigation($.nav, view);
    view.title = "チェックイン";
    $.nav.open(view);
};


/**
 * チェックインできる位置にスポットが存在するかチェック
 *
 * @param number myLat      ユーザのlat
 * @param number myLon      ユーザのlon
 * @param number spotLat    スポットのlat
 * @param number spotLon    スポットのlon
 * @param number baseDistance    "近くに存在するか"の基準値（km指定: default 0.2km）
 * @return boolean          true: 近くに存在する / false: 近くに存在しない
 *
 */
function isSpotNear(myLat, myLon, spotLat, spotLon, baseDistance){

    // 閾値（default 0.2km)
    var baseDistance = baseDistance || 0.2;

    // 距離を計算
    var R = 6371; // 地球の半径（km）
    var dLat = (spotLat-myLat) * Math.PI / 180;
    var dLon = (spotLon-myLon) * Math.PI / 180;
    var myLat = myLat * Math.PI / 180;
    var spotLat = spotLat * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(myLat) * Math.cos(spotLat);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var distance = R * c;

    Ti.API.info("Distance: " + distance);

    return (distance < baseDistance);
}

/**
 * ログインしているか判定
 * @param void
 * @return boolean true: ログイン済み, false: 未ログイン
 */
function isUserLogined(){
    if(typeof Alloy.Globals.user.token === "undefined"){
        return false;
    }
    return true;
}

function table_views(tableData) {
	// create table view data object
	$.tableView.data = tableData;		

	if (Ti.Platform.osname !== 'mobileweb') {
		$.tableView.style = Titanium.UI.iPhone.TableViewStyle.GROUPED;
	}
	
	$.tableView.addEventListener('click', function(e)
	{
		if (e.rowData.controller)
		{
			if(Number(e.rowData.param) == 0){
				alert("現在データがありません。");
			}else{
		        var controller = Alloy.createController(e.rowData.controller, $.args);
		        var view = controller.getView();
	            controller.setNavigation($.nav, view);
	            // controller.loadSpotImages($.args.spot_id);
	            view.title = e.rowData.navTitle;
	            $.nav.open(view,{animated : true});
   			}
   		}
	});
}

function tableDataSet(spotId) {
	//デフォルト設定
	var rowStyleNone = "Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE";
	var rowStyleBlue = "Titanium.UI.iPhone.TableViewCellSelectionStyle.BLUE";
		
	var rowData =[];
	var tableData = [
		{title:'学食名：', param:$.args.title, hasChild:false,navTitle:'',controller:'',touchEnabled:false, selectionStyle:rowStyleNone},
		{title:'大学名：', param:$.args.group1, hasChild:false,navTitle:'',controller:'',touchEnabled:false,selectionStyle:rowStyleNone},
		{title:'キャンパス名：', param:$.args.group2, hasChild:false,navTitle:'',controller:'',touchEnabled:false, selectionStyle:rowStyleNone},
		{title:'写真数：', param:'', hasChild:true, navTitle:'写真一覧', controller:'spotImage',touchEnabled:true, selectionStyle:rowStyleBlue},
		{title:'コメント数：', param:'', hasChild:true,navTitle:'コメント', controller:'spotInfoComment',touchEnabled:true, selectionStyle:rowStyleBlue},
		{title:'チェックイン数：', param:'', hasChild:false, navTitle:'',controller:'',touchEnabled:false, selectionStyle:rowStyleNone},
//		{title:'リンク：', param:'', hasChild:true, navTitle:'',controller:'',touchEnabled:true, selectionStyle:rowStyleBlue}
	];
	
	var token;
	if(isUserLogined()){
		token = Alloy.Globals.user.token;
	}else{
		token ='';
	}
	
	var message = 'loding...';
	var progressWindow = xhrFileUpload,
		win2 = new progressWindow('',message);
		win2.open();
	
    var apiMapper = new ApiMapper();
    apiMapper.spotCountInfoApi(
		token,
    	spotId,
    	function(){
			//プログレスバー画面を閉じる
			var t3 = Titanium.UI.create2DMatrix();
			t3 = t3.scale(0);
			win2.close({transform:t3,duration:300});	

    		// 成功したとき
    		var json = eval('(' + this.responseText + ')');
			if(Number(json.spot.imageCount) <= 0){
				tableData[3].touchEnabled = false;
				tableData[3].selectionStyle = rowStyleNone;
			}
			if(Number(json.spot.checkinCount) <= 0){
				tableData[4].touchEnabled = false;
				tableData[4].selectionStyle = rowStyleNone;
			}
			if(Number(json.spot.commentCount) <= 0){
				tableData[5].touchEnabled = false;
				tableData[5].selectionStyle = rowStyleNone;				
			}
				
			tableData[3].param = json.spot.imageCount;
			tableData[4].param = json.spot.commentCount;
			tableData[5].param = json.spot.checkinCount;

			var tableSection = $.tableSection;
			for ( var i in tableData) {
		        var args = {
		            title:tableData[i].title,
		            hasChild : tableData[i].hasChild,
		            navTitle : tableData[i].navTitle,
		            controller: tableData[i].controller,
		            param: tableData[i].param,
		            touchEnabled: tableData[i].touchEnabled,
		            selectionStyle: tableData[i].selectionStyle,           
		        };
		        if(Number(i) == 0){
		        	args.picture = imageUrl + $.args.picture;
		        	args.spot_id = $.args.spot_id;
		        	args.gospotCount = json.spot.gospotCount;
			        tableSection.add(Alloy.createController('spotInfoImageRow', args).getView());   	
		        }else{
			        tableSection.add(Alloy.createController('spotInfoRow', args).getView());		        	
		        }
		    }
		    rowData[0] = tableSection;
			
			if(initFlag == 0){
				table_views(rowData);
				initFlag = 1;
			}else{
				updateTableView(rowData);	
			}
    	},
    	function(){
			//プログレスバー画面を閉じる
			var t3 = Titanium.UI.create2DMatrix();
			t3 = t3.scale(0);
			win2.close({transform:t3,duration:300});	

    		// 失敗したとき
    		alert('データの取得に失敗しました。 [spotCountInfo]');
    	}
    );
}

function updateTableView(tableData){
	//テーブルデータの追加
	var rows =tableData[0].getRows();
	for(var i in rows){
		$.tableView.updateRow(i,rows[i],{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.FADE});
	}
}
