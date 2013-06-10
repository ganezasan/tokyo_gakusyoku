DROP TABLE IF EXISTS `SocialAccounts`;
CREATE TABLE IF NOT EXISTS `SocialAccounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `social_type` int(3) NOT NULL,
  `token` text,
  `secret` text,
  `user_id` int(11) NOT NULL,
  `share` int(2) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `fb_username` varchar(40) DEFAULT NULL,
  `tw_username` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

