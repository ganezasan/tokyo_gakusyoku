Common = function(){};

// 文字をバイトで数えるための関数
// http://www.tohoho-web.com/js/string.htm
Common.prototype.jstrlen =  function(str,len, i) {
   len = 0;
	if(str == null){
		return len;
	}

   str = escape(str);
   for (i = 0; i < str.length; i++, len++) {
      if (str.charAt(i) == "%") {
         if (str.charAt(++i) == "u") {
	            i += 3;
	            len++;
	         }
	         i++;
	      }
	   }
   return len;
};

Common.prototype.createActivityIndicator = function(){
	var indicator = Ti.UI.createActivityIndicator(
		{
			top: 155,
			left: 120,
			height: 100,
			width: 'auto',
			style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG,
			font: {fontSize: 15},
			color: '#000',
			message: 'loading...',
			zindex:1,
		}
	);
	return indicator;	
}

exports.Common = Common;
