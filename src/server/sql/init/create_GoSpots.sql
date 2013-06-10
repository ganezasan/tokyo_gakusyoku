--
-- テーブルの構造 `GoSpots`
--

DROP TABLE IF EXISTS `GoSpots`;
CREATE TABLE IF NOT EXISTS `GoSpots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `spot_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`spot_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=28 ;

