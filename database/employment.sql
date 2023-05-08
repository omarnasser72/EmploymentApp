-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 22, 2023 at 09:25 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `employment`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(1024) NOT NULL,
  `token` varchar(255) NOT NULL,
  `status` tinyint(255) NOT NULL COMMENT '1 >> online\r\n0 >> offline',
  `phone` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `email`, `name`, `password`, `token`, `status`, `phone`) VALUES
(5, 'ad@mail.com', 'omar nasser', '$2b$10$5dLVowB2bFwesek0loowX.CIzMbaJH/TzREpw9RPxo4whEtWSW.jS', '1702cfebb35dd80da9a518be811c87dc', 0, '5446545');

-- --------------------------------------------------------

--
-- Table structure for table `applicant`
--

CREATE TABLE `applicant` (
  `id` int(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `status` tinyint(255) NOT NULL COMMENT '1 >> online\r\n0 >> offline',
  `jobSearches` varchar(1024) NOT NULL,
  `token` varchar(255) NOT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applicant`
--

INSERT INTO `applicant` (`id`, `email`, `name`, `password`, `phone`, `status`, `jobSearches`, `token`, `image_url`) VALUES
(21, 'ali@m.com', 'ali ahmed', '$2b$10$Fo88Ve3N7l2W3bwe3SPHpuDwaR9kYxPoJdeR4BCbHL.cp9Ll2ckf2', '01273333686', 0, '', 'f0cd0d4343f073f1d20f4de12a0b0896', '');

-- --------------------------------------------------------

--
-- Table structure for table `applicant_accepted_reqs`
--

CREATE TABLE `applicant_accepted_reqs` (
  `applicant_id` int(255) NOT NULL,
  `acc_job` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `applicant_curr_req_jobs`
--

CREATE TABLE `applicant_curr_req_jobs` (
  `applicant_id` int(255) NOT NULL,
  `currReqJob_id` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `applicant_declined_reqs`
--

CREATE TABLE `applicant_declined_reqs` (
  `applicant_id` int(255) NOT NULL,
  `dec_req` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `applicant_req_jobs`
--

CREATE TABLE `applicant_req_jobs` (
  `applicant_id` int(255) NOT NULL,
  `reqJob_id` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job`
--

CREATE TABLE `job` (
  `id` int(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `offer` varchar(255) NOT NULL,
  `maxCandidateNumber` int(255) NOT NULL,
  `qualifications` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job`
--

INSERT INTO `job` (`id`, `position`, `description`, `offer`, `maxCandidateNumber`, `qualifications`) VALUES
(2, 'gfd', 'kjkl', 'kljkjnknk', 4, 5);

-- --------------------------------------------------------

--
-- Table structure for table `qualifications`
--

CREATE TABLE `qualifications` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `qualifications`
--

INSERT INTO `qualifications` (`id`, `name`, `description`) VALUES
(5, 'devops qualifications', 'IT background and coding skills'),
(6, 'devops qualifications', 'IT background and coding skills');

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `id` int(255) NOT NULL,
  `job_id` int(255) NOT NULL,
  `applicant_id` int(255) NOT NULL,
  `status` int(255) NOT NULL COMMENT '0>>pending\r\n1>>accepted\r\n-1>>rejected'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `applicant`
--
ALTER TABLE `applicant`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `applicant_accepted_reqs`
--
ALTER TABLE `applicant_accepted_reqs`
  ADD PRIMARY KEY (`applicant_id`,`acc_job`),
  ADD KEY `const_acc_job` (`acc_job`);

--
-- Indexes for table `applicant_curr_req_jobs`
--
ALTER TABLE `applicant_curr_req_jobs`
  ADD PRIMARY KEY (`applicant_id`,`currReqJob_id`),
  ADD KEY `const_currReqJobs` (`currReqJob_id`);

--
-- Indexes for table `applicant_declined_reqs`
--
ALTER TABLE `applicant_declined_reqs`
  ADD PRIMARY KEY (`applicant_id`,`dec_req`),
  ADD KEY `const_dec_job` (`dec_req`);

--
-- Indexes for table `applicant_req_jobs`
--
ALTER TABLE `applicant_req_jobs`
  ADD PRIMARY KEY (`applicant_id`,`reqJob_id`),
  ADD KEY `const_reqJobs` (`reqJob_id`);

--
-- Indexes for table `job`
--
ALTER TABLE `job`
  ADD PRIMARY KEY (`id`),
  ADD KEY `const_qual` (`qualifications`);

--
-- Indexes for table `qualifications`
--
ALTER TABLE `qualifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `const_apps_id` (`applicant_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `applicant`
--
ALTER TABLE `applicant`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `job`
--
ALTER TABLE `job`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `qualifications`
--
ALTER TABLE `qualifications`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applicant_accepted_reqs`
--
ALTER TABLE `applicant_accepted_reqs`
  ADD CONSTRAINT `const_acc_job` FOREIGN KEY (`acc_job`) REFERENCES `job` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `const_applicant_Id` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `applicant_curr_req_jobs`
--
ALTER TABLE `applicant_curr_req_jobs`
  ADD CONSTRAINT `const_appid` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `const_currReqJobs` FOREIGN KEY (`currReqJob_id`) REFERENCES `job` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `applicant_declined_reqs`
--
ALTER TABLE `applicant_declined_reqs`
  ADD CONSTRAINT `const_applicantId` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `const_dec_job` FOREIGN KEY (`dec_req`) REFERENCES `job` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `applicant_req_jobs`
--
ALTER TABLE `applicant_req_jobs`
  ADD CONSTRAINT `const_app_id` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `const_reqJobs` FOREIGN KEY (`reqJob_id`) REFERENCES `job` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `job`
--
ALTER TABLE `job`
  ADD CONSTRAINT `const_qual` FOREIGN KEY (`qualifications`) REFERENCES `qualifications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `const_apps_id` FOREIGN KEY (`applicant_id`) REFERENCES `applicant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `const_job_id` FOREIGN KEY (`job_id`) REFERENCES `job` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
