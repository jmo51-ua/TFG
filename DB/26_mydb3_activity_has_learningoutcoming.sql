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
-- Table structure for table `activity_has_learningoutcoming`
--

DROP TABLE IF EXISTS `activity_has_learningoutcoming`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_has_learningoutcoming` (
  `Activity_idActivity` int NOT NULL,
  `LearningOutcoming_idLearningOutcoming` int NOT NULL,
  PRIMARY KEY (`Activity_idActivity`,`LearningOutcoming_idLearningOutcoming`),
  KEY `fk_Activity_has_LearningOutcoming_LearningOutcoming1_idx` (`LearningOutcoming_idLearningOutcoming`),
  KEY `fk_Activity_has_LearningOutcoming_Activity1_idx` (`Activity_idActivity`),
  CONSTRAINT `fk_Activity_has_LearningOutcoming_Activity1` FOREIGN KEY (`Activity_idActivity`) REFERENCES `activity` (`idActivity`),
  CONSTRAINT `fk_Activity_has_LearningOutcoming_LearningOutcoming1` FOREIGN KEY (`LearningOutcoming_idLearningOutcoming`) REFERENCES `learningoutcoming` (`idLearningOutcoming`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='Cada resultado de aprendizaje debe ser desarrollado a partir de diversas actividades.\nCada actividad además puede desarrollar varios resultados de aprendizaje.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_has_learningoutcoming`
--

LOCK TABLES `activity_has_learningoutcoming` WRITE;
/*!40000 ALTER TABLE `activity_has_learningoutcoming` DISABLE KEYS */;
INSERT INTO `activity_has_learningoutcoming` VALUES (1,1);
/*!40000 ALTER TABLE `activity_has_learningoutcoming` ENABLE KEYS */;
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
