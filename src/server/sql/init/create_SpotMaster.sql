SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- データベース: `tokyogakusyoku`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `SpotMaster`
--

DROP TABLE IF EXISTS `SpotMaster`;
CREATE TABLE IF NOT EXISTS `SpotMaster` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `group1` text,
  `group2` text,
  `number` int(11) NOT NULL,
  `lat` decimal(9,6) NOT NULL,
  `lon` decimal(9,6) NOT NULL,
  `description` text,
  `picture` text,
  `reference` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

