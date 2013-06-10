--
-- テーブルの構造 `Photos`
--

DROP TABLE IF EXISTS `Photos`;
CREATE TABLE IF NOT EXISTS `Photos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `spot_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `checkin_id` int(11) NOT NULL,
  `daizu_id` text NOT NULL,
  `daizu_image_small` text NOT NULL,
  `daizu_image_medium` text NOT NULL,
  `daizu_image_large` text NOT NULL,
  `comment` text,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `spot_id` (`spot_id`),
  KEY `user_id` (`user_id`),
  KEY `checkin_id` (`checkin_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
