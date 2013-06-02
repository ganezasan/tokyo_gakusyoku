<?php
class SpotImages extends OhenroBase {
    public $id;
    public $spot_id;
    public $user_id;
    public $file_name;
    public $thumbnails;
    public $created_at;
    public $daizu_image_small;
    public $daizu_image_large;

    public function __construct($id,$spot_id,$user_id,$file_name,$thumbnails,$created_at){
        $this->id = $id;
        $this->spot_id = $spot_id;
        $this->user_id = $user_id;
        $this->file_name    = $file_name;
        $this->thumbnails = $thumbnails;
        $this->created_at = $created_at;
    }
}
?>


