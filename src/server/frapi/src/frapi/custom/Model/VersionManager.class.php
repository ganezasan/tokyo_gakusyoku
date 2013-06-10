<?php
class VersionManager extends OhenroBase {
    /**
     * @params
     * @params 
     */
    public static function getLatestVersionId (){
        $db = new Zend_Db_Table('Version');
	$select = $db->select()
		->order(array('id DESC'));
	$row = $db->fetchRow($select);

        return $row;
    }
}
