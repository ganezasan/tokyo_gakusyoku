<?php
class SpotImagesManager extends OhenroBase {
    function getAllImages(){
        $spotImagesTable = new Zend_Db_Table('Photos');
        return $spotImagesTable->fetchAll();
    }

    function getImages($spot_id){
	$spotImagesTable = new Zend_Db_Table('Photos');
	$select = $spotImagesTable->select()->where('spot_id = ?', $spot_id);
	return $spotImagesTable->fetchAll($select);
    }
    
    function getImagesCount($spot_id){
	$db = Zend_Db_Table::getDefaultAdapter();
	$select = $db->select()
		->from('Photos', 'COUNT(*)')
		->where('spot_id = ?',$spot_id);
	return $db->fetchOne($select);
    }
}
?>
