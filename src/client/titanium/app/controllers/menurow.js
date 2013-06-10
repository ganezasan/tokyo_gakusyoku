
var args = arguments[0] || {};

// チェックイン済みのときはアイコンをつける
if(args.checkin){
    $.icon.image = 'checkbox_checked_icon&16.png';
}

// タイトル
$.title.text = args.title || '';
// サブタイトル設定
$.subTitle.text = args.subTitle || '';

// 任意プロパティ
$.row.customTitle = args.title;
$.row.customLat = args.latitude;
$.row.customLon = args.longitude;