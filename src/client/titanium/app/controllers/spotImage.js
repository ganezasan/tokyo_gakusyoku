Ti.include('picturegallery.js');
// APIMapper の準備
var ApiMapper = require("apiMapper").ApiMapper;
var images = [];

var args = arguments[0] || {};
$.args =  args;

// loadSpotImages($.args.spot_id,"1");

// コントローラ呼び出し元からナビゲーションバーをセットする
exports.setNavigation = function(nav, parent){
    $.nav = nav;
    $.parent = parent;
    loadSpotImages($.args.spot_id);
};

/**
 * 画像一覧取得
 * @param void
 * @return void
 */
loadSpotImages = function(spotId){
    var apiMapper = new ApiMapper();
    apiMapper.spotImageApi(
    	spotId,
    	function(){
    		// 成功したとき
    		var json = eval('(' + this.responseText + ')');
    		for(i = 0; i < json.spotImages.length; i++){
  				Ti.API.info(json.spotImages[i].file_name);
    		    var item = new Object();
  				//イメージセット
				item = {
				  path:Alloy.Globals.app.imageUrl+json.spotImages[i].file_name,
				  thumbPath:Alloy.Globals.app.imageUrl+json.spotImages[i].thumbnails,
				  caption: json.spotImages[i].comment
				};
				images.push(item);
    		}
    		var pictureGallery = PictureGallery.createWindow({
			  images: images,
			  windowGroup: $.nav
			});
			$.win.add(pictureGallery);
    	},
    	function(){
    		// 失敗したとき
    		alert('データの取得に失敗しました。 [spotImages]');
    	}
    );
}

// module.exports = spotImage;