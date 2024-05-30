-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: mydb3
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `exercise_has_session`
--

DROP TABLE IF EXISTS `exercise_has_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercise_has_session` (
  `Exercise_idExercise` int NOT NULL,
  `Session_idSession` int NOT NULL,
  `Organization_has_Category_Organization_idOrganization` int NOT NULL,
  `Organization_has_Category_Category_idCategory` int NOT NULL,
  `Organization_has_Category_type` varchar(10) NOT NULL,
  PRIMARY KEY (`Exercise_idExercise`,`Session_idSession`),
  KEY `fk_Exercise_has_Session_Session1_idx` (`Session_idSession`),
  KEY `fk_Exercise_has_Session_Exercise1_idx` (`Exercise_idExercise`),
  KEY `fk_Exercise_has_Session_Organization_has_Category1_idx` (`Organization_has_Category_Organization_idOrganization`,`Organization_has_Category_Category_idCategory`,`Organization_has_Category_type`),
  CONSTRAINT `fk_Exercise_has_Session_Exercise1` FOREIGN KEY (`Exercise_idExercise`) REFERENCES `exercise` (`idExercise`),
  CONSTRAINT `fk_Exercise_has_Session_Organization_has_Category1` FOREIGN KEY (`Organization_has_Category_Organization_idOrganization`, `Organization_has_Category_Category_idCategory`, `Organization_has_Category_type`) REFERENCES `organization_has_category` (`Organization_idOrganization`, `Category_idCategory`, `type`),
  CONSTRAINT `fk_Exercise_has_Session_Session1` FOREIGN KEY (`Session_idSession`) REFERENCES `session` (`idSession`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercise_has_session`
--

LOCK TABLES `exercise_has_session` WRITE;
/*!40000 ALTER TABLE `exercise_has_session` DISABLE KEYS */;
INSERT INTO `exercise_has_session` VALUES (1,1,1,1,'A'),(1,2,1,1,'A'),(1,3,1,1,'A'),(4,4,10,1,'B'),(5,4,10,1,'B'),(6,4,10,1,'B'),(7,4,10,1,'B'),(8,5,10,2,'A');
/*!40000 ALTER TABLE `exercise_has_session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-22 17:50:00
