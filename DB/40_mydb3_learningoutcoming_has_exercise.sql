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
-- Table structure for table `learningoutcoming_has_exercise`
--

DROP TABLE IF EXISTS `learningoutcoming_has_exercise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `learningoutcoming_has_exercise` (
  `LearningOutcoming_idLearningOutcoming` int NOT NULL,
  `Exercise_idExercise` int NOT NULL,
  PRIMARY KEY (`LearningOutcoming_idLearningOutcoming`,`Exercise_idExercise`),
  KEY `fk_LearningOutcoming_has_Exercise_Exercise1_idx` (`Exercise_idExercise`),
  KEY `fk_LearningOutcoming_has_Exercise_LearningOutcoming1_idx` (`LearningOutcoming_idLearningOutcoming`),
  CONSTRAINT `fk_LearningOutcoming_has_Exercise_Exercise1` FOREIGN KEY (`Exercise_idExercise`) REFERENCES `exercise` (`idExercise`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_LearningOutcoming_has_Exercise_LearningOutcoming1` FOREIGN KEY (`LearningOutcoming_idLearningOutcoming`) REFERENCES `learningoutcoming` (`idLearningOutcoming`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learningoutcoming_has_exercise`
--

LOCK TABLES `learningoutcoming_has_exercise` WRITE;
/*!40000 ALTER TABLE `learningoutcoming_has_exercise` DISABLE KEYS */;
INSERT INTO `learningoutcoming_has_exercise` VALUES (1,1),(3,1),(7,1),(3,2),(7,2),(9,4),(13,4),(15,4),(12,5),(11,6),(10,7),(11,7),(12,7);
/*!40000 ALTER TABLE `learningoutcoming_has_exercise` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-22 17:50:02
