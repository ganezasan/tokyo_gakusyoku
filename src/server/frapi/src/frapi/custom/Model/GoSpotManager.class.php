<?php
class GoSpotManager extends OhenroBase {
    public static function insertGoSpot($user_id, $spot_id){
	
        $goSpotTable = new Zend_Db_Table('GoSpots');
        
	$goSpotInnsertId = $goSpotTable->insert(
            array(
                'user_id' => $user_id, 
                'spot_id' => $spot_id,
                'created_at' => new Zend_Db_Expr('now()'),
            )
        );
	
        return true;
    }
    public static function getGoSpotCount($user_id,$spot_id){
        $db = Zend_Db_Table::getDefaultAdapter();
        $select = $db->select()
                ->from('GoSpots','COUNT(*)')
                ->where('user_id = ?',$user_id)
      		->where('spot_id = ?',$spot_id);
	  return $db->fetchOne($select);
    }

}

?>
