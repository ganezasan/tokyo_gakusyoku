SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- データベース: `tokyogakusyoku`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `Version`
--

DROP TABLE IF EXISTS `Version`;
CREATE TABLE IF NOT EXISTS `Version` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `version_id` float(3,2) NOT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- テーブルのデータのダンプ `Version`
--

INSERT INTO `Version` (`id`, `version_id`, `description`, `created_at`) VALUES
(1, 1.00, 'ニューリリース', '2013-03-30 13:08:29'),
(2, 1.50, '画像アップロード機能追加', '2013-06-08 13:08:46');
