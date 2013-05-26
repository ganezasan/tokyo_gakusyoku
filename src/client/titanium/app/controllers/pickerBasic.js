var args = arguments[0] || {};
$.args =  args;

var maxrating = 40;
var minrating = 0.1;

// コントローラ呼び出し元からナビゲーションバーをセットする
exports.setNavigation = function(nav, parent, spotId){
    $.nav = nav;
    $.parent = parent;
   
};

// picker_basic();

picker_dialog();

function selectParam(){
	alert();
}

function picker_basic() {
	// var win = Ti.UI.createWindow();
	// $.win.backgroundColor = 'black';
	
	var data = [];
	for(i = 0; i <= maxrating;i++){
		var rating = i/10+1;
		data[i] = Ti.UI.createPickerRow({title:rating.toString(),custom_item:'b'});
	}
	
	// alert(data);
	// data[0]=Ti.UI.createPickerRow({title:'Bananas',custom_item:'b'});
	// data[1]=Ti.UI.createPickerRow({title:'Strawberries',custom_item:'s'});
	// data[2]=Ti.UI.createPickerRow({title:'Mangos',custom_item:'m'});
	// data[3]=Ti.UI.createPickerRow({title:'Grapes',custom_item:'g'});
	
	// turn on the selection indicator (off by default)
	$.pic.selectionIndicator = true;
	
	$.pic.add(data);
	
	// $.win.add(picker);
	
	$.pic.setSelectedRow(0,1,true);
	
	// var label = Ti.UI.createLabel({
		// text:'Make a move',
		// top:6,
		// width:'auto',
		// height:'auto',
		// textAlign:'center',
		// color:'white'
	// });
	// $.win.add(label);
// 	
	// var button = Ti.UI.createButton({
		// title:'Set to Grapes',
		// top:34,
		// width:120,
		// height:30
	// });
	// $.win.add(button);
// 	
	// button.addEventListener('click',function()
	// {
		// // column, row, animated (optional)
		// $.pic.setSelectedRow(0,3,true);
	// });
// 	
	// $.pic.addEventListener('change',function(e)
	// {
		// Ti.API.info("You selected row: "+e.row+", column: "+e.column+", custom_item: "+e.row.custom_item);
		// label.text = "row index: "+e.rowIndex+", column index: "+e.columnIndex;
	// });
// 	
	$.pic.setSelectedRow(0,1,false);
}

function picker_dialog(){
	var pickerView = Titanium.UI.createView({height:251,bottom:-251});
	var cancel =  Titanium.UI.createButton({
		title:'Cancel',
		style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});
	 
	var done =  Titanium.UI.createButton({
		title:'Done',
		style:Titanium.UI.iPhone.SystemButtonStyle.DONE
	});
	var spacer =  Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	var toolbar =  Titanium.UI.createToolbar({
		top:0,
		items:[cancel,spacer,done]
	});
	
	// value picker initialisation
	var picker = Titanium.UI.createPicker({top:43});
	picker.selectionIndicator=true;
	var pickerValues = [
		Titanium.UI.createPickerRow({title:'John'}),
		Titanium.UI.createPickerRow({title:'Alex'}),
		Titanium.UI.createPickerRow({title:'Marie'}),
		Titanium.UI.createPickerRow({title:'Eva'}),
		Titanium.UI.createPickerRow({title:'James'})
	];
	picker.add(pickerValues);
	pickerView.add(picker);
	pickerView.add(toolbar);
	$.pickerBasic.add(pickerView);
	
 	var slideIn =  Titanium.UI.createAnimation({bottom:0});
	var slideOut =  Titanium.UI.createAnimation({bottom:-251});
	pickerView.animate(slideIn);
	
	cancel.addEventListener('click',function() {
		pickerView.animate(slideOut);
	});
	
	done.addEventListener('click',function() {
		// $.comment.value =  picker.getSelectedRow(0).title;
		pickerView.animate(slideOut);
	});
}