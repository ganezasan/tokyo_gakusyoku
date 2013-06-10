var args = arguments[0] || {};　　// index.jsから引数を受け取る
$.title.text = args.title;  // タイトル指定
$.param.text = args.param;  // パラメータ指定
$.comment.text = args.comment; //コメント指定
$.imageView = args.imageView; //イメージ（画像）指定
$.row.titleLabel = args.title;
$.row.param = args.param;
$.row.comment = args.comment;
$.row.controller = args.controller;
$.row.navTitle = args.navTitle;
$.row.touchEnabled = args.touchEnabled;
$.row.selectionStyle = args.selectionStyle;
$.row.hasChild = args.hasChild;
$.row.imageView = args.imageView;


