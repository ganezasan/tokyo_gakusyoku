<?php
class SocialAccount extends OhenroBase {
    public $id;	    
    public $user_id;
    public $social_type;
    public $token;
    public $secret;
    public $share;
    public $fb_username;
    public $tw_username;

    function __construct($id,$user_id, $social_type, $token, $secret, $share,$fb_username,$tw_username, $created_at = null, $updated_at = null){
        $this->id = $id;
	$this->user_id = $user_id;
        $this->social_type = $social_type;
        $this->token = $token;
        $this->secret = $secret;
        $this->share = $share;
	$this->fb_username = $fb_username;
	$this->tw_username = $tw_username;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
    }

    /**
     * 保存する
     *
     * @params SocailToken[] $socialTokens ソーシャルトークン
     * @params boolean
     */
    function save (){
        // UPSERT
        $sql = <<<SQL
INSERT INTO SocialAccounts
(
 user_id
 , social_type
 , token
 , secret
 , share
 , fb_username
 , tw_username
 , created_at
)
VALUES
(
 :user_id
 , :social_type
 , :token
 , :secret
 , :share
 , :fb_username
 , :tw_username
 , now()
)
ON DUPLICATE KEY UPDATE
token       =:token2
, secret      =:secret2
, share       =:share2
SQL;

        // FIXME: 名前付きパラメタが複数あると挙動がおかしい
        $db = Zend_Db_Table::getDefaultAdapter();
        $sth = $db->prepare($sql);
        $sth->bindValue(':user_id', $this->user_id);
        $sth->bindValue(':social_type',$this->social_type);
        $sth->bindValue(':secret', $this->secret);
	$sth->bindValue(':fb_username',$this->fb_username);
	$sth->bindValue(':tw_username',$this->tw_username);
        $sth->bindValue(':secret2', $this->secret);
        $sth->bindValue(':token', $this->token);
        $sth->bindValue(':token2', $this->token);
        $sth->bindValue(':share', $this->share);
        $sth->bindValue(':share2', $this->share);
        $sth->execute();

        return true;
    }

    function update() {
	var_dump($this->id);
	$socialAccountsTable = new Zend_Db_Table('SocialAccounts');
	$where = $socialAccountsTable->getAdapter()->quoteInto('id = ?', $this->id);
	$socialAccountsTable->update(
    		array(
       		 'token'  => $this->token,
		 'secret' => $this->secret,
		 'share'  => $this->share
    		),
    		$where
	);
	return true;
    }
}
?>
