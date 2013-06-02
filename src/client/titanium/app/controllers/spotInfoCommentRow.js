var args = arguments[0] || {};　　// index.jsから引数を受け取る
$.args =  args;

$.title.text = args.title;  // タイトル指定
$.imageView.image = args.picture; //イメージ（画像）指定
$.comment.text = args.comment;  // パラメータ指定
$.row.touchEnabled = args.touchEnabled;
$.row.selectionStyle = args.selectionStyle;
$.row.hasChild = args.hasChild;
