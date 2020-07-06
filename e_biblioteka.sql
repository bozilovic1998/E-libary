-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3308
-- Generation Time: Jan 07, 2020 at 07:00 PM
-- Server version: 8.0.18
-- PHP Version: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `e_biblioteka`
--

-- --------------------------------------------------------

--
-- Table structure for table `administrator`
--

DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `a_korisnicko_ime` varchar(100) NOT NULL,
  `a_lozinka` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `administrator`
--

INSERT INTO `administrator` (`id`, `a_korisnicko_ime`, `a_lozinka`) VALUES
(1, 'admin', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `autori`
--

DROP TABLE IF EXISTS `autori`;
CREATE TABLE IF NOT EXISTS `autori` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ime_prezime` varchar(100) NOT NULL,
  `godina_rodjenja` varchar(100) NOT NULL,
  `mesto_rodjenja` varchar(100) NOT NULL,
  `drzava` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `autori`
--

INSERT INTO `autori` (`id`, `ime_prezime`, `godina_rodjenja`, `mesto_rodjenja`, `drzava`) VALUES
(1, 'Marko Šelić', '1983.', 'Paraćin', 'Srbija'),
(2, 'Danijel Mejson', '1976.', 'Los Anđeles', 'Kalifornija, SAD'),
(3, 'Ivo Andrić', '1892.', 'Dolac', 'Bosna i Hercegovina'),
(4, 'Meša Selimović', '1910.', 'Tuzla', 'Bosna i Hercegovina'),
(5, 'Peter Handke', '1942.', 'Grifen', 'Austrija'),
(6, 'Miloš Kosanović', '1990.', 'Niš', 'Srbija');

-- --------------------------------------------------------

--
-- Table structure for table `bibliotekari`
--

DROP TABLE IF EXISTS `bibliotekari`;
CREATE TABLE IF NOT EXISTS `bibliotekari` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `b_ime_prezime` varchar(100) NOT NULL,
  `b_korisnicko_ime` varchar(100) NOT NULL,
  `b_email` varchar(100) NOT NULL,
  `b_lozinka` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `bibliotekari`
--

INSERT INTO `bibliotekari` (`id`, `b_ime_prezime`, `b_korisnicko_ime`, `b_email`, `b_lozinka`) VALUES
(9, 'bibliotekar', 'bibliotekar', 'bibliotekar@gmail.com', 'bibliotekar');

-- --------------------------------------------------------

--
-- Table structure for table `knjige`
--

DROP TABLE IF EXISTS `knjige`;
CREATE TABLE IF NOT EXISTS `knjige` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `autor_id` int(11) NOT NULL,
  `naziv` varchar(100) NOT NULL,
  `zanr` varchar(100) NOT NULL,
  `izdavac` varchar(100) NOT NULL,
  `godina_izdavanja` varchar(100) NOT NULL,
  `broj_strana` varchar(100) NOT NULL,
  `jezik` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `foreign` (`autor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `knjige`
--

INSERT INTO `knjige` (`id`, `autor_id`, `naziv`, `zanr`, `izdavac`, `godina_izdavanja`, `broj_strana`, `jezik`) VALUES
(13, 1, 'Malterego – Knjiga prva: Rubikova stolica', 'Triler', 'Laguna', '2016.', '342', 'Srpski'),
(14, 2, 'Zimski vojnik', 'Istorija, Drama', 'Laguna', '2019.', '333', 'Srpski'),
(17, 1, 'Malterego – Knjiga druga: Higijena nesećanja I deo', 'Triler', 'Laguna', '2017.', '424', 'Srpski'),
(18, 1, 'Malterego – Knjiga druga: Higijena nesećanja II deo', 'Triler', 'Laguna', '2018.', '438', 'Srpski'),
(19, 6, 'Klijent server sistemi - Praktikum za Laboratorijske vežbe ', 'Praktikum', 'Visoka Tehnička škola Niš', '2019.', '77', 'Srpski');

-- --------------------------------------------------------

--
-- Table structure for table `korisnici`
--

DROP TABLE IF EXISTS `korisnici`;
CREATE TABLE IF NOT EXISTS `korisnici` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `k_ime_prezime` varchar(100) NOT NULL,
  `k_korisnicko_ime` varchar(100) NOT NULL,
  `k_email` varchar(100) NOT NULL,
  `k_lozinka` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `korisnici`
--

INSERT INTO `korisnici` (`id`, `k_ime_prezime`, `k_korisnicko_ime`, `k_email`, `k_lozinka`) VALUES
(4, 'korisnik', 'korisnik', 'korisnik@gmail.com', 'korisnik');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `knjige`
--
ALTER TABLE `knjige`
  ADD CONSTRAINT `foreign` FOREIGN KEY (`autor_id`) REFERENCES `autori` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
