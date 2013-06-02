var ApiMapper = require("apiMapper").ApiMapper;
var apiMapper = new ApiMapper();
var xhrFileUpload = require("xhr_fileupload");

/**
 * コントローラ起動時に渡される引数処理
 */
var args = arguments[0] || {};
$.args =  args;

tableDataSet($.args.spot_id);

// 呼び出し元からナビゲーションバーをセットする
exports.setNavigation = function(nav, parent){
    $.nav = nav;
    $.parent = parent;
};

function tableDataSet(spotId) {
	// //デフォルト設定
	var rowStyleNone = "Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE";
	var rowData =[];
	
	var message = 'loding...';
	var progressWindow = xhrFileUpload,
		win2 = new progressWindow('',message);
		win2.open();
		
    var apiMapper = new ApiMapper();
    apiMapper.spotCommentApi(
    	spotId,
    	function(){
			//プログレスバー画面を閉じる
			var t3 = Titanium.UI.create2DMatrix();
			t3 = t3.scale(0);
			win2.close({transform:t3,duration:300});	

    		// 成功したとき
    		var json = eval('(' + this.responseText + ')');
			var tableSection = $.tableSection;
			var tableData = json.comments;
			for ( var i in tableData) {
				var $title = tableData[i].username + '（' + tableData[i].created_at +'）';
		        var args = {
		            title: $title,
		            comment: tableData[i].comment,
		            picture: tableData[i].imagePath,
		            hasChild:false,
		            touchEnabled: false,
		            selectionStyle: rowStyleNone,
		        };
		        tableSection.add(Alloy.createController('spotInfoCommentRow', args).getView());		        	
		    }
		    rowData[0] = tableSection;
			$.tableView.data = rowData;
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
