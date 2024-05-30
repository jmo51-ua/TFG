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
-- Table structure for table `learningoutcoming_has_variable`
--

DROP TABLE IF EXISTS `learningoutcoming_has_variable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `learningoutcoming_has_variable` (
  `LearningOutcoming_idLearningOutcoming` int NOT NULL,
  `Variable_idVariable` int NOT NULL,
  PRIMARY KEY (`LearningOutcoming_idLearningOutcoming`,`Variable_idVariable`),
  KEY `fk_LearningOutcoming_has_Variable_Variable1_idx` (`Variable_idVariable`),
  KEY `fk_LearningOutcoming_has_Variable_LearningOutcoming1_idx` (`LearningOutcoming_idLearningOutcoming`),
  CONSTRAINT `fk_LearningOutcoming_has_Variable_LearningOutcoming1` FOREIGN KEY (`LearningOutcoming_idLearningOutcoming`) REFERENCES `learningoutcoming` (`idLearningOutcoming`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_LearningOutcoming_has_Variable_Variable1` FOREIGN KEY (`Variable_idVariable`) REFERENCES `variable` (`idVariable`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learningoutcoming_has_variable`
--

LOCK TABLES `learningoutcoming_has_variable` WRITE;
/*!40000 ALTER TABLE `learningoutcoming_has_variable` DISABLE KEYS */;
INSERT INTO `learningoutcoming_has_variable` VALUES (1,5),(1,6),(3,7),(3,8),(7,9),(7,10),(3,12),(3,13),(8,14),(13,17),(13,18),(15,21),(15,22),(12,25),(12,26),(12,27),(11,28),(10,31),(10,32);
/*!40000 ALTER TABLE `learningoutcoming_has_variable` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-22 17:50:01
