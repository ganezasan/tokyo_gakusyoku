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
	//$image = $this->getParam('image');

        $spot->checkin($user,$comment,$sa_id,$rating_1,$rating_2,$rating_3);
        $checkin = CheckinManager::generateByCheckinId($spot->checkin_id);
	/*
        // シェア設定
        $message = sprintf("%s (%s にチェックインしました) #東京学食巡り", mb_strimwidth($comment, 0, 80, '...'), $spot->name);
        ShareQueue::enqueue($user, $checkin->id, $message);
*/

	// レスポンス
	$response = array(
			"id" => $checkin->id,
			"created_at" => $checkin->created_at,
			"updated_at" => $checkin->updated_at,
			);
	// 画像保存先のディレクトリ
	$save_dir ="/tmp/images/";

	if(!isset($_FILES)){
		$json = "{\"error\":\"files\"}";
	}elseif(!isset($_FILES["image"])){
		$json = "{\"error\":\"files_media\"}";
	}elseif(!isset($_FILES["image"]["name"])){
		$json = "{\"error\":\"files_media_name\"}";
	}else{
		//$fileName = sha1(uniqid(mt_rand(), true)) . "_" .  basename($_FILES["image"]["name"]);
		$fileName = basename($_FILES["image"]["name"]);
		$target_path = $save_dir . $fileName;
		// アップロードファイルの保存
		if(!move_uploaded_file($_FILES["image"]["tmp_name"],$target_path)){
			$json = "{\"error\":\"Can not Upload Image.{$fileName}\"}";
		}else{
			$json = "{\"error\":\"\"}";
		}
	
		error_log($_FILES["image"]["error"], 3, '/var/tmp/app.log');
		error_log($_FILES["image"]["name"], 3, '/var/tmp/app.log');
		error_log($_FILES["image"]["tmp_name"], 3, '/var/tmp/app.log');

		$response['image'] = $json;
	
		//morioka結合後修正予定
		$photo = new Photo(
                	$spot->spot_id,
                	$user->id,
			$checkin->id,
			'99999999999',
			//$json->id,
			$fileName,
			$fileName,
			$fileName
			//$json->image_small,
			//$json->image_medium,
			//$json->image_large
			);

		$photo->save();	
		
	}
	
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

        $user = UserFactory::generateByToken($this->getParam('token'));
        $spot = SpotManager::generateBySpotId($this->getParam('spot_id'));
        $comment = $this->getParam('comment');
       	$rating_1 = $this->getParam('rating_1');
        $rating_2 = $this->getParam('rating_2');
        $rating_3 = $this->getParam('rating_3');
	//$image = $this->getParam('image');

        $spot->checkin($user,$comment,$rating_1,$rating_2,$rating_3);
        $checkin = CheckinManager::generateByCheckinId($spot->checkin_id);
	/*
        // シェア設定
        $message = sprintf("%s (%s にチェックインしました) #東京学食巡り", mb_strimwidth($comment, 0, 80, '...'), $spot->name);
        ShareQueue::enqueue($user, $checkin->id, $message);
*/

	// レスポンス
	$response = array(
			"id" => $checkin->id,
			"created_at" => $checkin->created_at,
			"updated_at" => $checkin->updated_at,
			);
	// 画像保存先のディレクトリ
	$save_dir ="/tmp/images/";

	if(!isset($_FILES)){
		$json = "{\"error\":\"files\"}";
	}elseif(!isset($_FILES["image"])){
		$json = "{\"error\":\"files_media\"}";
	}elseif(!isset($_FILES["image"]["name"])){
		$json = "{\"error\":\"files_media_name\"}";
	}else{
		//$objDateTime = new DateTime('NOW');
		//$fileName = $objDateTime->format(DateTime::ISO8601) ."_". sha1(uniqid(mt_rand(), true)) . "_" .  basename($image["name"]);
		$fileName = sha1(uniqid(mt_rand(), true)) . "_" .  basename($_FILES["name"]);
		$target_path = $save_dir . $fileName;
		// アップロードファイルの保存
		if(!move_uploaded_file($_FILES["tmp_name"],$target_path)){
			$json = "{\"error\":\"Can not Upload Image.{$fileName}\"}";
		}else{
			$json = "{\"error\":\"\"}";
		}
		
		error_log($_FILES["image"]["error"], 3, '/var/tmp/app.log');
		error_log($_FILES["image"]["name"], 3, '/var/tmp/app.log');
		error_log($_FILES["image"]["tmp_name"], 3, '/var/tmp/app.log');

		$response['image'] = $json;
	}

        return array("checkin" => $response, "meta" => array("status" => "true"));
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

