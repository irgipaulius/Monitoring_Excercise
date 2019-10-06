-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 05, 2019 at 10:42 AM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `monitoring`
--

-- --------------------------------------------------------

--
-- Table structure for table `monitoredendpoints`
--

CREATE TABLE `monitoredendpoints` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `url` text NOT NULL,
  `created` date NOT NULL,
  `checked` date NOT NULL,
  `monitorInterval` int(11) NOT NULL,
  `owner` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table `monitoringresult`
--

CREATE TABLE `monitoringresult` (
  `id` int(11) NOT NULL,
  `checked` date NOT NULL,
  `statusCode` int(11) NOT NULL,
  `payload` text NOT NULL,
  `monitoredEndpointID` int(11) NOT NULL COMMENT 'id of a row from MonitoredEndpoint table'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `accessToken` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `accessToken`) VALUES
(1, 'Applifting', 'info@applifting.cz', '93f39e2f-80de-4033-99ee-249d92736a25'),
(2, 'Batman', 'batman@example.com', 'dcb20f8a-5657-4f1b-9f7f-ce65739b359e'),
(2, 'Batman', 'batman@example.com', 'dcb20f8a-5657-4f1b-9f7f-ce65739b359e');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
