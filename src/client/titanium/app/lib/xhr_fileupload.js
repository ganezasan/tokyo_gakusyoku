function xhr_upload() {
	var t = Titanium.UI.create2DMatrix();
	t = t.scale(0);

	var win = Titanium.UI.createWindow({
		backgroundColor:'#336699',
		borderWidth:8,
		borderColor:'#999',
		height:400,
		width:300,
		borderRadius:10,
		opacity:0.92,
		transform:t
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

	// create a button to close window
	var b = Titanium.UI.createButton({
		title:'Close',
		height:30,
		width:150
	});
	win.add(b);
	
	var ind=Titanium.UI.createProgressBar({
		width:200,
		height:50,
		top:50,
		min:0,
		max:1,
		value:0,
		style:Titanium.UI.iPhone.ProgressBarStyle.PLAIN,
		message:'Uploading Image',
		font:{fontSize:12, fontWeight:'bold'},
		color:'#888'
	});
	win.add(ind);
	ind.show();

	b.addEventListener('click', function()
	{
		Titanium.Media.openPhotoGallery({
			success:function(event)
			{
				Ti.API.info("success! event: " + JSON.stringify(event));
				var media = event.media;
	            // var dialog = Ti.UI.createAlertDialog({
		            // message: event.metadata,
		            // ok: 'OK',
		            // title: 'Metadata'
		        // }).show();
				
				var xhr = Titanium.Network.createHTTPClient();
		        var url = "http://54.248.225.182/api/spot/up_image.json";
				xhr.onerror = function(e)
				{
					Ti.UI.createAlertDialog({title:'Error', message:e.error}).show();
					Ti.API.info('IN ERROR ' + e.error);
				};
				// xhr.setTimeout(20000);
				// xhr.setRequestHeader("enctype", "multipart/form-data");
				// xhr.setRequestHeader("Content-Type", "image/jpeg");

				xhr.onload = function(e)
				{
					// Ti.UI.createAlertDialog({title:'Success', message:'status code ' + this.status}).show();
					Ti.API.info('IN ONLOAD ' + this.status + ' readyState ' + this.readyState);
					
					//閉じる
					var t3 = Titanium.UI.create2DMatrix();
					t3 = t3.scale(0);
					win.close({transform:t3,duration:300});	
				};
				xhr.onsendstream = function(e)
				{
					ind.value = e.progress ;
					Ti.API.info('ONSENDSTREAM - PROGRESS: ' + e.progress);
				};
		        xhr.open('POST', url);
	   			xhr.send({image:media,name:name});

				// // open the client
				// xhr.open('POST','https://twitpic.com/api/uploadAndPost');
				// // send the datai
				// xhr.send({media:image,username:'fgsandford1000',password:'sanford1000',message:'check me out'});
			},
			cancel:function()
			{
				var t3 = Titanium.UI.create2DMatrix();
				t3 = t3.scale(0);
				win.close({transform:t3,duration:300});					
			},
			error:function(error)
			{
				var t3 = Titanium.UI.create2DMatrix();
				t3 = t3.scale(0);
				win.close({transform:t3,duration:300});		
			},
			allowEditing:false
		});
	});

	win.open(a);
	return win;
};

module.exports = xhr_upload;
