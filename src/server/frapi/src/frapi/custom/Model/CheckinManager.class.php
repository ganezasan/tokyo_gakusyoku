<?php
class CheckinManager extends OhenroBase {
    public static function generateByCheckinId($checkin_id){
        $checkinTable = new Zend_Db_Table('checkins');
        $select = $checkinTable->select()->where('id = ?', $checkin_id);
        $r = $checkinTable->fetchRow($select);

        if(!$r){
            // TODO: エラー管理
            throw new Exception(sprintf('Invalid checkin id [id=%s]', $checkin_id));
        }

        // Spot 作成
        $checkin = new Checkin($r->id, $r->user_id, $r->spot_id, $r->comment,$r->sa_id, $r->comment_flag,$r->rating_1,$r->rating_2,$r->rating_3,$r->created_at, $r->updated_at);

        return $checkin;
    }

    function getCheckinCount($spot_id){
        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select()
                ->from('checkins', array('COUNT(*) as checkinCount','COUNT(comment_flag=1 or null) as commentCount'))
                ->where('spot_id = ?',$spot_id);
        return $db->fetchAll($select);
    }

    function getCheckin($spot_id){
	$checkinTable = new Zend_Db_Table('checkins');
    	//$select = $checkinTable->select()->where('spot_id = ?', $spot_id);
   	//	return $checkinTable->fetchAll($select);
  	$db = Zend_Db_Table::getDefaultAdapter(); 
	$select  = $db->select() //->setIntegrityCheck(false)
		->from(array('c' => 'checkins'),
			array('comment' => 'comment',
				'created_at' => "DATE_FORMAT(`c`.`created_at`,'%Y/%m/%d %k:%i')"))
		->join(
			array('u' => 'Users'),
			'c.user_id = u.id',
			array(
				'name' => 'name',
			)
		)
    		->join(
			array('s' => 'SocialAccounts'),
			'c.sa_id = s.id',
			array(
				'social_type' => 'social_type',
				'fb_username' => 'fb_username',
				'tw_username' => 'tw_username',
			)
		)
		->where('c.spot_id = ?',$spot_id)
		->where('c.comment_flag = 1')
		->order(array('c.created_at DESC'));
	//var_dump($select->__toString());
	return $db->fetchAll($select);	
	}
}
?>
