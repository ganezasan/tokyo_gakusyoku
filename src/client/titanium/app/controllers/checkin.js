
var ApiMapper = require("apiMapper").ApiMapper;
var apiMapper = new ApiMapper();
var xhrFileUpload = require("xhr_fileupload");
/**
 * コントローラ起動時に渡される引数処理
 */
var args = arguments[0] || {};
$.args =  args;
// 表示設定
// $.title.text = args.title || '';
// $.description.text = $.args.description || '';
// $.tableView.data = table_views();
table_views($.args);
// $.image.image = args.imagePath;

// 呼び出し元からナビゲーションバーをセットする
exports.setNavigation = function(nav, parent){
    $.nav = nav;
    $.parent = parent;
    //cameraボタン設置
    var cameraButton = Ti.UI.createButton({title: 'Camera'});
    cameraButton.addEventListener('click', function() {
        sourceSelect.show();
    });
    $.checkin.rightNavButton = cameraButton;    
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
    $.checkin.opacity = 1;
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
    $.checkinButton.touchEnabled = false;
    $.checkinButton.touchEnabled = false;
    $.checkinButton.opacity = 0.70;
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
	//新チェックイン画面表示処理に変更する
    var spot_id = $.args.spot_id;
    // var comment = $.comment.value;

    apiMapper.spotcheckinApi(Alloy.Globals.user.token, spot_id, comment,
        function(e){
            //成功時
            Ti.API.info("Received text: " + this.responseText);
            Ti.API.info('Checkin completed');

            // Map画面に戻る
            $.nav.close($.parent);
//            $.nav.group.close($.checkin.getView());
        },
        function(e){
            //失敗時
            Ti.API.info("Received text: " + this.responseText);
            alert('チェックインに失敗しました : ' + e.data);
        }
    );
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


/*****カメラアップロード機能実装******/
var sourceSelect = Titanium.UI.createOptionDialog({
	options:['撮影する', 'アルバムから選ぶ', 'キャンセル','test','fileupload'],
	cancel:2,
	title:'写真を添付'
});

sourceSelect.addEventListener('click',function(e)
{
	switch( e.index ) {
    case 0:
        startCamera();
        break;
    case 1:
        selectFromPhotoGallery();
        break;
    case 3:
		var ExampleWindow = xhrFileUpload,
			win2 = new ExampleWindow();
			win2.open();
		// self.containingTab.open(win2,{animated:true});
	    break;
    case 4:
    	uploadImage();
    }
});

function startCamera() {
    Titanium.Media.showCamera(
        {
	        success:function(event) {
		        var image = event.media;
                $.imageView.image = image;
                $.imageView.show();
                //消した uploadToTwitPic(image);
		    },
	        //cancel:function(){},
	        error:function(error) {
		        if (error.code == Titanium.Media.NO_CAMERA) {
                    alert('カメラがありません');
		        }
		    },
	        saveToPhotoGallery:false, //本番ではtrueにする
	        allowEditing:true,
	        mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
        }
    );
}

function selectFromPhotoGallery() {
    Ti.Media.openPhotoGallery(
        {
            success: function(event) {
                var image = event.media;
                $.imageView.image = image;
                //消した uploadToTwitPic(image);
             },
            // error:  function(error) { },
            // cancel: function() { },
            allowEditing: false,
            mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
        }
    );
}

function uploadImage() {
	Titanium.Media.openPhotoGallery({
		success:function(event)
		{
			Ti.API.info("success! event: " + JSON.stringify(event));
			var media = event.media;
			var name = 'test.png'
		    var dialog = Ti.UI.createAlertDialog({
		        message: event,
		        ok: 'OK',
		        title: 'Metadata'
		    }).show();
		    
			var xhr = Titanium.Network.createHTTPClient();
		    var url = "http://54.248.225.182/api/spot/up_image.json";
			xhr.open('POST', url);
			var f1 = Titanium.Filesystem.getFile('twitterButton@2x.png');
			var myimage=f1.read();
			//通信する
			// xhr.send({image:myimage,name:'twitterButton@2x.png'});	
			xhr.send({image:event.media,name:name});	

			xhr.onerror = function(e)
				{
					Ti.UI.createAlertDialog({title:'Error', message:e.error}).show();
					Ti.API.info('IN ERROR ' + e.error);
				};
			xhr.onload = function(e)
				{
					// Ti.UI.createAlertDialog({title:'Success', message:'status code ' + this.status}).show();
					Ti.API.info('IN ONLOAD ' + this.status + ' readyState ' + this.readyState);
		            Ti.API.info("Received text: " + this.responseText);
		   		};
			xhr.onsendstream = function(e)
				{
					ind.value = e.progress ;
					Ti.API.info('ONSENDSTREAM - PROGRESS: ' + e.progress);
				};
		},
		cancel:function()
			{
				Ti.API.info('cancel');
			},
		error:function(error)
			{
				Ti.API.info('error');
			},
		allowEditing:false
	});
}

function table_views(_args) {
	// create table view data object	
	var setRowStyle = "Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE";

	var tableData = [
		{title:'大学名：' + $.args.title, hasChild:false,touchEnabled:false, selectionStyle:setRowStyle,header:'学食Info'},
		{title:'キャンパス名：', hasChild:false,touchEnabled:false,selectionStyle:setRowStyle},
		{title:'写真：', hasChild:true, navTitle:'写真一覧', controller:'spotImage'},
		{title:'コメント：', hasChild:true, controller:''},
		{title:'チェックイン数：', hasChild:true, controller:''},
		{title:'リンク：', hasChild:true, controller:''}
	];
	
	//テーブルデータの追加
	$.tableView.data = tableData;

	if (Ti.Platform.osname !== 'mobileweb') {
		$.tableView.style = Titanium.UI.iPhone.TableViewStyle.GROUPED;
	}
	
	$.tableView.addEventListener('click', function(e)
	{
		if (e.rowData.controller)
		{
	        var controller = Alloy.createController(e.rowData.controller, $.args);
	        var view = controller.getView();
            controller.setNavigation($.nav, view);
            controller.loadSpotImages($.args.spot_id);
            view.title = e.rowData.navTitle;
            $.nav.open(view,{animated : true});
   		}
	});
}
