<?php
class GoSpot extends OhenroBase {
    public $id;
    public $user_id;
    public $spot_id;
    public $created_at;

    public function __construct($id, $user_id, $spot_id, $created_at){
	$this->id = $id;
        $this->user_id = $user_id;
        $this->spot_id = $spot_id;
        $this->created_at = $created_at;
    }
}
