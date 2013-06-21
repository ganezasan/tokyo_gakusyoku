<?php

/**
 * Action Spot_checkin 
 * 
 * CheckIn
 * 
 * @link http://getfrapi.com
 * @author Frapi <frapi@getfrapi.com>
 * @link api/spot/checkin
 */
class Action_Spot_checkin extends Frapi_Action implements Frapi_Action_Interface
{

    /**
     * Required parameters
     * 
     * @var An array of required parameters.
     */
    protected $requiredParams = array(
        'token',
        'spot_id',
	);

    /**
     * The data container to use in toArray()
     * 
     * @var A container of data to fill and return in toArray()
     */
    private $data = array();

    /**
     * To Array
     * 
     * This method returns the value found in the database 
     * into an associative array.
     * 
     * @return array
     */
    public function toArray()
    {
        $this->data['token'] = $this->getParam('token', self::TYPE_OUTPUT);
        $this->data['spot_id'] = $this->getParam('spot_id', self::TYPE_OUTPUT);
        /*$this->data['comment'] = $this->getParam('comment', self::TYPE_OUTPUT);
        $this->data['rating_1'] = $this->getParam('rating_1', self::TYPE_OUTPUT);
        $this->data['rating_2'] = $this->getParam('rating_2', self::TYPE_OUTPUT);
        $this->data['rating_3'] = $this->getParam('rating_3', self::TYPE_OUTPUT);
        $this->data['image'] = $this->getParam('image', self::TYPE_OUTPUT);
	*/
	return $this->data;
    }

    /**
     * Default Call Method
     * 
     * This method is called when no specific request handler has been found
     * 
     * @return array
     */
    public function executeAction()
    {
        $valid = $this->hasRequiredParameters($this->requiredParams);
        if ($valid instanceof Frapi_Error) {
            throw $valid;
        }
        
        return $this->toArray();
    }

    /**
     * Get Request Handler
     * 
     * This method is called when a request is a GET
     * 
     * @return array
     */
    public function executeGet()
    {
        $valid = $this->hasRequiredParameters($this->requiredParams);
        if ($valid instanceof Frapi_Error) {
            throw $valid;
        }
        
        return $this->toArray();
    }

    /**
     * Post Request Handler
     * 
     * This method is called when a request is a POST
     * 
     * @return array
     */
    public function executePost()
    {
        // 必須チェック
        $valid = $this->hasRequiredParameters($this->requiredParams);
        if ($valid instanceof Frapi_Error) {
            throw $valid;
        }
	
        $user = UserFactory::generateByToken($this->getParam('token'));
        $spot = SpotManager::generateBySpotId($this->getParam('spot_id'));
        //ソーシャルアカウントID取得
	$sa_id = SocialAccountManager::getSocialAccountId($user->id);
	$comment = $this->getParam('comment');
       	$rating_1 = $this->getParam('rating_1');
        $rating_2 = $this->getParam('rating_2');
        $rating_3 = $this->getParam('rating_3');

        $spot->checkin($user,$comment,$sa_id,$rating_1,$rating_2,$rating_3);
	$checkin = CheckinManager::generateByCheckinId($spot->checkin_id);
        
	// シェア設定
        $message = sprintf("%s (%s にチェックインしました) #東京学食巡り", 
			mb_strimwidth($comment, 0, 80, '...'), $spot->name);
        ShareQueue::enqueue($user, $checkin->id, $message);

        // 写真を投稿
        // 受け取ったファイル
        if(isset($_FILES["image"])){
            $tmpfile = $_FILES["image"]["tmp_name"];
            // error_log(print_r($_FILES, true));
            
            // Daizu 向け POST 情報
            $client = new Zend_Http_Client(IMG_ENDPOINT_URL,    // config.ini にて設定
                array(
                    'maxredirects' => 0,
                    'timeout'      => 30   // TODO: 妥当な値に変更
                )
            );

            $client->setFileUpload($tmpfile, 'picture[avatar]'); // ファイル添付
            $client->setHeaders('Accept', '*/*');
            $client->setMethod(Zend_Http_Client::POST);
            // 送信
            $response = $client->request();
            $json = json_decode($response->getBody());

	    //morioka結合後修正予定
	    $photo = new Photo(
	    	$spot->spot_id,
	    	$user->id,
	   	$checkin->id,
	    	$json->id,
	    	$json->image_small,
	    	$json->image_medium,
	    	$json->image_large
	    );

	    $photo->save();	
        }

	error_log(print_r($response, true)); 		
        // レスポンス
        $response = array(
            "id" => $checkin->id,
            "created_at" => $checkin->created_at,
            "updated_at" => $checkin->updated_at,
        );

        return array("checkin" => $response, "meta" => array("status" => "true"));

    }

    /**
     * Put Request Handler
     * 
     * This method is called when a request is a PUT
     * 
     * @return array
     */
    public function executePut()
    {
        // 必須チェック
        $valid = $this->hasRequiredParameters($this->requiredParams);
        if ($valid instanceof Frapi_Error) {
            throw $valid;
        }
        return $this->toArray();
    }

    /**
     * Delete Request Handler
     * 
     * This method is called when a request is a DELETE
     * 
     * @return array
     */
    public function executeDelete()
    {
        $valid = $this->hasRequiredParameters($this->requiredParams);
        if ($valid instanceof Frapi_Error) {
            throw $valid;
        }
        return $this->toArray();
    }

    /**
     * Head Request Handler
     * 
     * This method is called when a request is a HEAD
     * 
     * @return array
     */
    public function executeHead()
    {
        $valid = $this->hasRequiredParameters($this->requiredParams);
        if ($valid instanceof Frapi_Error) {
            throw $valid;
        }
        
        return $this->toArray();
    }


}

