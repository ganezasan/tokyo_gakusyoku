<?php
class PhotoManager extends OhenroBase {
    function getAllImages(){
        $photosTable = new Zend_Db_Table('Photos');
        return $photosTable->fetchAll();
    }

    function getImages($spot_id){
	$photosTable = new Zend_Db_Table('Photos');
	$select = $photosTable->select()->where('spot_id = ?', $spot_id);
	return $photosTable->fetchAll($select);
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
