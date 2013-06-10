DROP TABLE IF EXISTS `Checkins`;
CREATE TABLE IF NOT EXISTS `Checkins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `spot_id` int(11) NOT NULL,
  `comment` text,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `comment_flag` int(11) DEFAULT NULL,
  `rating_1` int(11) DEFAULT NULL,
  `rating_2` int(11) DEFAULT NULL,
  `rating_3` int(11) DEFAULT NULL,
  `rating_4` int(11) DEFAULT NULL,
  `rating_5` int(11) DEFAULT NULL,
  `sa_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sa_id` (`sa_id`),
  KEY `spot_id` (`spot_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

--
-- テーブルの制約 `Checkins`
--
ALTER TABLE `Checkins`
  ADD CONSTRAINT `Checkins_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`),
  ADD CONSTRAINT `Checkins_ibfk_1` FOREIGN KEY (`sa_id`) REFERENCES `SocialAccounts` (`id`),
  ADD CONSTRAINT `Checkins_ibfk_2` FOREIGN KEY (`spot_id`) REFERENCES `SpotMaster` (`id`);

