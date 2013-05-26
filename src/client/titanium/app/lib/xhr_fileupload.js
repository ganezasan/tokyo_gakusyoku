function xhr_upload(ind,message) {
	var t = Titanium.UI.create2DMatrix();
	t = t.scale(0);

	var win = Titanium.UI.createWindow({
		// backgroundColor:'#336699',
		backgroundColor:'#3B5998',
		borderWidth:1,
		borderColor:'#c1c1c1',
		height:250,
		width:300,
		borderRadius:10,
		opacity:0.92,
		transform:t
	});
	
	var indicator = Ti.UI.createActivityIndicator({
		top: 50,
		height: 100,
		width: 'auto',
		style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG,
		font: {fontSize: 15},
		color: '#FFF',
		message: message,
		zindex:1,
	});
	
	// create first transform to go beyond normal size
	var t1 = Titanium.UI.create2DMatrix();
	t1 = t1.scale(1.1);
	var a = Titanium.UI.createAnimation();
	a.transform = t1;
	a.duration = 200;

	// when this animation completes, scale to normal size
	a.addEventListener('complete', function()
	{
		Titanium.API.info('here in complete');
		var t2 = Titanium.UI.create2DMatrix();
		t2 = t2.scale(1.0);
		win.animate({transform:t2, duration:200});

	});
	
	//プログレスバーを表示する場合は変数として与える
	if(ind != ''){
		win.add(ind);
		ind.show();
	}

	win.add(indicator);
	indicator.show();
	win.open(a);
	return win;
};

module.exports = xhr_upload;
