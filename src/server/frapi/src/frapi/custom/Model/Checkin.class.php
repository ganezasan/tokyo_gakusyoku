<?php
class Checkin extends OhenroBase {
    public $id;
    public $user_id;
    public $spot_id;
    public $number;
    public $lat;
    public $lon;
    public $description;

    // checkin
    public $checkin_id;
    public $checkin_user_id;
    public $checkin_comment;
    public $comment_flag;
    public $sa_id;
    public $rating_1;
    public $rating_2;
    public $rating_3;

    public function __construct($id, $user_id, $spot_id, $comment, $comment_flag, $sa_id, $rating_1, $rating_2, $rating_3, $created_at, $updated_at){
	$this->id = $id;
        $this->user_id = $user_id;
        $this->spot_id = $spot_id;
        $this->comment = $comment;
	$this->comment_flag = $comment_flag;
	$this->sa_id = $sa_id;
	$this->rating_1 = $rating_1;
	$this->rating_2 = $rating_2;
	$this->rating_3 = $rating_3;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
    }
}
