
var ApiMapper = require("apiMapper").ApiMapper;
var apiMapper = new ApiMapper();

/**
 * コントローラ起動時に渡される引数処理
 */
var args = arguments[0] || {};
$.args =  args;

// ユーザ情報をマッピング
$.user_icon.image = Alloy.Globals.user.icon_url;
$.username.text = Alloy.Globals.user.name;

// ソーシャル連携状態をサーバと同期する
for(var i=0; i<Alloy.Globals.user.social.length; i++){
    switch(Alloy.Globals.user.social[i].type){
        case "1":
            // Twitter
            $.switch_twitter.value = Alloy.Globals.user.social[i].post;
           break;
       case "2":
            // Facebook
            $.switch_facebook.value = Alloy.Globals.user.social[i].post;
           break;
   }
}

// Twitterボタン
// XXX: 認証を途中で終わらせるとスイッチがONなのに、ONになっていない現象が発生する
$.switch_twitter.addEventListener('change', function(e){
    if(e.source.value){
        // ON のとき
    	Ti.include('twitter_api.js');

    	//initialization
    	var twitterApi = new TwitterApi({
    	    consumerKey: Alloy.Globals.app.twitter_cosumer_token,
    	    consumerSecret:Alloy. Globals.app.twitter_consumer_secret,
    	});

    	// TODO: エレガントな方法もとむ
    	// コールバックができなかったので
    	// oauth_adapter.js の getAccessToken メソッドにて、Alloy.Globals.setTwitterAccount() を直に書いてコールしている
    	Alloy.Globals.setTwitterAccount = function(responseParams){
    	    twitterApi.account_verify_credentials({
    	        onSuccess: function(e){
                    // 更新
                    updateSocialSetting(e.source, 1, responseParams['oauth_token'], responseParams['oauth_token_secret'], 1);
                    twitterApi.clear_accesstoken();
                },
    	        onError: function(){
    	            alert('認証に失敗しました');
                    $.switch_twitter.value = false;
    	            twitterApi.clear_accesstoken();
    	        }
    	    });
    	};

        // 認証
        twitterApi.init({
            onError: function(){
                $.switch_twitter.value = false;
            }
        });
    }else{
        // OFF のときは更新
        updateSocialSetting(e.source.value, 1, null, null, 0);
    }
    // TODO: Twitter 版も作る
});

// Facebookボタン
$.switch_facebook.addEventListener('change', function(e){
    if(e.source.value){
        // ON のときは認証して更新
        Ti.Facebook.authorize();
    }else{
        // OFF のときは更新
        updateSocialSetting(e.source.value, 2, null, null, 0);

        // FIXME: updateSocialSetting で失敗したときにおかしくなる。（ボタンがOFFなのにサーバはONのまま）
        if(Ti.Facebook.loggedIn){
            Ti.Facebook.logout();
        }
    }
});


/**
 * ソーシャル設定更新
 * @param  social_type  1: Twitter, 2: Facebook
 * @param  share        1: ON, 0, OFF
 * @return void
 */
function updateSocialSetting(switch_button, social_type, token, secret, share){
    apiMapper.userNotificationApi(
        Alloy.Globals.user.token,
        social_type,
        token,
        secret,
        share,
        function(e){
            $.switch_button.value = share;
        },
        function(e){
            alert('更新に失敗しました。[notification]');
            $.switch_button.value = !share;  // 元に戻す
        }
    );
}


function loginFacebook(e){
    if(e.error){
        alert(e.error);
        $.switch_facebook.value = false;
        return;
    }else if(e.canceled){
        $.switch_facebook.value = false;
        return;
    }

    // 更新
    updateSocialSetting(e.source, 2, Ti.Facebook.getAccessToken(), null, 1);
}

Ti.Facebook.addEventListener('login', loginFacebook);
$.setting.addEventListener('close', function(){
    Ti.Facebook.removeEventListener('login', loginFacebook);
});