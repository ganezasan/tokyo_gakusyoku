<?php

/**
 * Action Spot_getcomment 
 * 
 * Array
 * 
 * @link http://getfrapi.com
 * @author Frapi <frapi@getfrapi.com>
 * @link api/spot/get_comment
 */
class Action_Spot_getcomment extends Frapi_Action implements Frapi_Action_Interface
{

    /**
     * Required parameters
     * 
     * @var An array of required parameters.
     */
    protected $requiredParams = array('spot_id');

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
        $this->data['spot_id'] = $this->getParam('spot_id', self::TYPE_OUTPUT);
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
       
	$spot_id = $this->getParam('spot_id'); 
	$checkinManager = new CheckinManager();
	$checkins = $checkinManager->getCheckin($spot_id);	

	$fb_api_path = "https://graph.facebook.com/";
	$tw_api_path = "http://api.twitter.com/1/users/profile_image?screen_name=";

         // response
        $response = array(
            "comments" => array(),
       	   // "comments" => $checkins,
	    "meta" => array("status" => "true"), 
	);

	foreach($checkins as $s){
	    $socialType = $s["social_type"];
	    
  	   //1がtwitter, 2がfacebook
	    if(strcmp($socialType,"1") == 0){
		$imageUrl = $tw_api_path.$s["tw_username"];	
	    }else{
		$imageUrl = $fb_api_path . $s["fb_username"] . "/picture"; 
	    }
	
            $response["comments"][] = array(
                'username' => $s["name"],
                'created_at' => $s["created_at"],
		'comment' => $s["comment"],
             //   'rating' => $s->rating,
            	'imagePath' => $imageUrl
		);
	 }
	
	return $response;
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
        $valid = $this->hasRequiredParameters($this->requiredParams);
        if ($valid instanceof Frapi_Error) {
            throw $valid;
        }
        
        return $this->toArray();
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

