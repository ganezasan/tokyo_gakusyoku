var Common = require("common").Common;
var common = new Common();
// コントローラ呼び出し元からナビゲーションバーをセットする
exports.setNavigation = function(nav, parent, spotId, selectButton,comment){
    $.nav = nav;
    $.parent = parent;
    //決定ボタン設置
    $.spotComment.rightNavButton = selectButton;
	$.textArea.value = comment;
	$.headCountLabel.text = common.jstrlen(comment);
};

var args = arguments[0] || {};
$.args =  args;
	
$.spotComment.addEventListener("open", function(event, type) {
	$.textArea.focus();
	$.textArea.setSuppressReturn(false);
});

$.textArea.addEventListener('change',function(e){
  $.headCountLabel.text = common.jstrlen($.textArea.value);
  if(parseInt($.headCountLabel.text) > 1000){
  	alert("1000文字を超えています。");
  }
});

