<?php
class Spot extends OhenroBase {
    public $spot_id;
    public $name;
    public $group1;
    public $group2;
    public $number;
    public $lat;
    public $lon;
    public $description;
    public $picture;
    public $reference;

    // checkin
    public $checkin_id;
    public $checkin_user_id;
    public $checkin_comment;
    public $comment_flag;

    public function __construct($spot_id, $name, $group1, $group2, $number, $lat, $lon, $description, $picture,$reference){
        $this->spot_id = $spot_id;
        $this->name    = $name;
	$this->group1  = $group1;
	$this->group2  = $group2;
        $this->numbera = $number;
        $this->lat     = $lat;
        $this->lon     = $lon;
        $this->description = $description;
	$this->picture = $picture;
	$this->reference = $reference;
    }

    public function checkin($user, $comment, $sa_id,$rating_1, $rating_2, $rating_3){
        $this->checkin_user_id = $user->id;
        $this->checkin_comment = $comment;

	if(empty($comment)){
		$this->comment_flag = 0;
	}else{
		$this->comment_flag = 1;
	}

        // save
        $checkinTable = new Zend_Db_Table('Checkins');
/*
#        // Upsert
#        $sql = <<<SQL
#INSERT INTO Checkin
#(
#      id
#    , user_id
#    , spot_id
#    , comment
#    , created_at
#)
#VALUES
#(
#      NULL
#    , :user_id
#    , :spot_id
#    , :comment
#    , now()
#)
#ON DUPLICATE KEY UPDATE
#      id = LAST_INSERT_ID(id)
#    , comment = :comment_duplicate
#SQL;
#        // FIXME: 名前付きパラメタが複数あると挙動がおかしい
#        $db = Zend_Db_Table::getDefaultAdapter();
#        $sth = $db->prepare($sql);
#        $sth->bindValue(':user_id', $this->checkin_user_id);
#        $sth->bindValue(':spot_id', $this->spot_id);
#        $sth->bindValue(':comment', $this->checkin_comment);
#        $sth->bindValue(':comment_duplicate', $this->checkin_comment);
#        $sth->execute();
*/

        // 単純インサート
        $insertId = $checkinTable->insert(
            array(
                'user_id' => $this->checkin_user_id, 
                'spot_id' => $this->spot_id,
                'comment' => $this->checkin_comment,
		'comment_flag' => $this->comment_flag,
		'sa_id'    => $sa_id,
		'rating_1' => $rating_1,
		'rating_2' => $rating_2,
		'rating_3' => $rating_3,
                'created_at' => new Zend_Db_Expr('now()'),
            )
        );

//        $insertId = $db->lastInsertId();
        $this->checkin_id = $insertId;

        return true;
    }
}
