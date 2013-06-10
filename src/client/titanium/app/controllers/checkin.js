var ApiMapper = require("apiMapper").ApiMapper;
var apiMapper = new ApiMapper();
var createIndicator = require("createIndicator");
var Common = require("common").Common;
var common = new Common();

/**
 * コントローラ起動時に渡される引数処理
 */
var args = arguments[0] || {};
$.args =  args;

// 表示設定
// $.title.text = args.title || '';
// $.description.text = $.args.description || '';
// $.tableView.data = table_views();

//テーブルデータをセット
tableDataSet($.args.spot_id);

//テーブルデータ
// var tableData = [{image:'', rating_1:'', rating_2:'', rating_3:'',comment:''}];
var checkinData = new Array(5);

//picker
createPicker();
var slideIn =  Titanium.UI.createAnimation({bottom:0});
var slideOut =  Titanium.UI.createAnimation({bottom:-251});
var tmpRow;
// $.image.image = args.imagePath;

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
    $.checkin.opacity = 1;
}else{
    // チェックイン拒否

    // ログイン状態に応じてコメントを変更
    if(isUserLogined()){
        if($.args.checkin){
            // すでにチェックインしていたときはコメントを入力
            // $.comment.value = $.args.comment;
        }else{
   //         $.comment.value = "スポットに近づくとチェックインすることができます";
        }
    }else{
     //   $.comment.value = "チェックインをするにはログインする必要があります";
        alert('チェックインするにはユーザ登録が必要です');
    }

	//あとで戻す
    // $.checkinButton.touchEnabled = false;
    // $.checkinButton.touchEnabled = false;
    // $.checkinButton.opacity = 0.70;
}

/**
 * スポットにチェックインする
 */
var checkinSpot = function checkinSpot(){
    var spot_id = $.args.spot_id;
	var image = checkinData[0];
	var rating_1 = checkinData[1];
	var rating_2 = checkinData[2];
	var rating_3 = checkinData[3];
	var comment = checkinData[4];
	
	var ind=Titanium.UI.createProgressBar({
		width:200,
		height:50,
		min:0,
		max:1,
		value:0,
		style:Titanium.UI.iPhone.ProgressBarStyle.PLAIN,
		font:{fontSize:11, fontWeight:'bold'},
		color:'#888'
	});
	
	var message = 'Uploading Image...';
	var progressWindow = createIndicator,
		win2 = new progressWindow(ind,message,150,250,0);
		win2.open();
	
	//他の操作不可とする
	$.nav.setTouchEnabled(false);
	$.checkin.opacity = 0.7;
	
    apiMapper.spotcheckinApi(
    	Alloy.Globals.user.token,
    	spot_id, 
    	comment,
		rating_1,
		rating_2,
		rating_3,
		image,
        function(e){
            //成功時
			alert("チェックインしました。");
            Ti.API.info("Received text: " + this.responseText);
            Ti.API.info('Checkin completed');
			//プログレスバー画面を閉じる
			var t3 = Titanium.UI.create2DMatrix();
			t3 = t3.scale(0);
			win2.close({transform:t3,duration:300});	

			//操作可能にする
			$.nav.setTouchEnabled(true);
			$.checkin.opacity = 1.0;

            
            // Map画面に戻る
            $.nav.close($.parent);
	        $.nav.group.close($.checkin.getView());
        },
        function(e){
			//プログレスバー画面を閉じる
			var t3 = Titanium.UI.create2DMatrix();
			t3 = t3.scale(0);
			win2.close({transform:t3,duration:300});	

			//操作可能にする
			$.nav.setTouchEnabled(true);
			$.checkin.opacity = 1.0;

            //失敗時
            Ti.API.info("Received text: " + this.responseText);
            alert('チェックインに失敗しました : ' + e.data);
        },
        function(e){
        	ind.value = e.progress;
			Ti.API.info('ONSENDSTREAM - PROGRESS: ' + e.progress);
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
	options:['撮影する', 'アルバムから選ぶ', 'キャンセル'],
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
    }
});

function startCamera() {
    Titanium.Media.showCamera(
        {
	        success:function(event) {
		        var image = event.media;
		        setImage(image);
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
		        setImage(image);
             },
            // error:  function(error) { },
            // cancel: function() { },
            allowEditing: false,
            mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
        }
    );
}

function table_views(tableData) {
	// create table view data object
	//テーブルデータの追加
	$.tableView.data = tableData;

	if (Ti.Platform.osname !== 'mobileweb') {
		$.tableView.style = Titanium.UI.iPhone.TableViewStyle.GROUPED;
	}
	
	$.tableView.addEventListener('click', function(e)
	{
		if (e.rowData.controller == '')
		{
   			//評価
   			$.pickerView.animate(slideIn);
   			$.scrollView.setTouchEnabled(false);
   			$.scrollView.opacity = 0.7;
			tmpRow = e;
   		}else if(e.rowData.controller == 'spotComment'){
			//コメントビュー表示
			tmpRow = e;
	        var controller = Alloy.createController(e.rowData.controller, $.args);
	        var view = controller.getView();
            // controller.loadSpotImages($.args.spot_id);
            var selectButton = Ti.UI.createButton({title: '決定'});
        	//決定ボタン設置
			selectButton.addEventListener('click', function() {
			  	if(parseInt(common.jstrlen(controller.textArea.value)) > 140){
			  		alert("140文字を超えています。");
			  	}else{
				    setComment(controller.textArea.value);
				    $.nav.close(view);			  		
			  	}
			});
            controller.setNavigation($.nav, view, $.args.spot_id,selectButton,e.row.comment);
            view.title = e.rowData.navTitle;
	        $.nav.open(view,{animated : true});
   		}else{
   			tmpRow = e;
   			//写真アップロード表示
   			sourceSelect.show();
   		}
	});
}

function tableDataSet(spotId) {
	//デフォルト設定
	var rowStyleNone = "Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE";
	var rowStyleBlue = "Titanium.UI.iPhone.TableViewCellSelectionStyle.BLUE";
	var tableData = [];
	var rowData = [
		{title:'写真を投稿する', hasChild:true, navTitle:'写真一覧', param:'',controller:'spotImage', touchEnabled:true, selectionStyle:rowStyleBlue},
		{title:'料理', hasChild:true,navTitle:'', param:'--',controller:'',touchEnabled:true, selectionStyle:rowStyleBlue},
		{title:'CP', hasChild:true,navTitle:'', param:'--', controller:'',touchEnabled:true, selectionStyle:rowStyleBlue},
		{title:'雰囲気', hasChild:true,navTitle:'', param:'--', controller:'',touchEnabled:true, selectionStyle:rowStyleBlue},
		{title:'コメント', hasChild:true, navTitle:'コメント',param:'',controller:'spotComment',touchEnabled:true, selectionStyle:rowStyleBlue}
	];

	var tableSection = $.tableSection;
	tableSection.headerTitle = $.args.title;

	//tableRow作成
	for ( var i in rowData) {
        var args = {
            title:rowData[i].title,
            hasChild : rowData[i].hasChild,
            navTitle : rowData[i].navTitle,
            controller: rowData[i].controller,
            param: rowData[i].param,
            // comment: rowData[i].comment,
            touchEnabled: rowData[i].touchEnabled,
            selectionStyle: rowData[i].selectionStyle,           
        };
        tableSection.add(Alloy.createController('checkinRow', args).getView());
    }
    tableData[0] = tableSection;
	//テーブルを表示
    table_views(tableData);
}

function createPicker(){
	$.pic.selectionIndicator=true;
	var maxrating = 40;
	var minrating = 0.1;
	var pickerValues = [];
	for(i = 0; i <= maxrating;i++){
		var rating = i/10+1;
		pickerValues[i] = Ti.UI.createPickerRow({title:rating.toString(),custom_item:'b'});
	}
	$.pic.add(pickerValues);
}

$.pickerCancel.addEventListener('click',function() {
	$.pickerView.animate(slideOut);
	$.scrollView.setTouchEnabled(true);
	$.scrollView.opacity = 1.0;
});

$.pickerDone.addEventListener('click',function(e) {
    var args = {
        title:tmpRow.row.titleLabel,
        hasChild : tmpRow.row.hasChild,
        navTitle : tmpRow.row.navTitle,
        controller: tmpRow.row.controller,
        param: $.pic.getSelectedRow(0).title,
        touchEnabled: tmpRow.row.touchEnabled,
        selectionStyle: tmpRow.row.selectionStyle,           
    };
	
	var newrow = Alloy.createController('checkinRow', args).getView();
	$.tableView.updateRow(tmpRow.index,newrow,{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.LEFT});
	$.pickerView.animate(slideOut);
	$.scrollView.setTouchEnabled(true);
	$.scrollView.opacity = 1.0;	
	checkinData[tmpRow.index] = $.pic.getSelectedRow(0).title;
	tmpRow = null;
});

setComment = function(comment){
    var args = {
        title:tmpRow.row.titleLabel,
		comment:comment,
        hasChild : tmpRow.row.hasChild,
        navTitle : tmpRow.row.navTitle,
        controller: tmpRow.row.controller,
        touchEnabled: tmpRow.row.touchEnabled,
        selectionStyle: tmpRow.row.selectionStyle,     
    };
	var newrow = Alloy.createController('checkinRow', args).getView();
	$.tableView.updateRow(tmpRow.index,newrow,{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.LEFT});
	checkinData[tmpRow.index] = comment;
	tmpRow = null;
}

setImage = function(image){
    var args = {
        title:tmpRow.row.titleLabel,
		imageView:image,
        hasChild : tmpRow.row.hasChild,
        navTitle : tmpRow.row.navTitle,
        controller: tmpRow.row.controller,
        touchEnabled: tmpRow.row.touchEnabled,
        selectionStyle: tmpRow.row.selectionStyle,     
    };
	var newrow = Alloy.createController('checkinImageRow', args).getView();
	$.tableView.updateRow(tmpRow.index,newrow,{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.LEFT});
	checkinData[tmpRow.index] = image.imageAsResized(960, 960);
	tmpRow = null;
}
