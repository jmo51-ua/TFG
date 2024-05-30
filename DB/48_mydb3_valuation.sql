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
-- Table structure for table `valuation`
--

DROP TABLE IF EXISTS `valuation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `valuation` (
  `idValuation` int NOT NULL AUTO_INCREMENT,
  `LearningOutcoming_idLearningOutcoming` int NOT NULL,
  `description` varchar(45) DEFAULT NULL,
  `Exercise_has_Session_has_Actor_Exercise_has_Session_Exer_idExer` int NOT NULL,
  `Exercise_has_Session_has_Actor_Exercise_has_Session_Ses_idSes` int NOT NULL,
  `Exercise_has_Session_has_Actor_Actor_idActor` int NOT NULL,
  PRIMARY KEY (`idValuation`,`LearningOutcoming_idLearningOutcoming`,`Exercise_has_Session_has_Actor_Exercise_has_Session_Exer_idExer`,`Exercise_has_Session_has_Actor_Exercise_has_Session_Ses_idSes`,`Exercise_has_Session_has_Actor_Actor_idActor`),
  KEY `fk_Valuation_LearningOutcoming1_idx` (`LearningOutcoming_idLearningOutcoming`),
  KEY `fk_Valuation_Exercise_has_Session_has_Actor1_idx` (`Exercise_has_Session_has_Actor_Exercise_has_Session_Exer_idExer`,`Exercise_has_Session_has_Actor_Exercise_has_Session_Ses_idSes`,`Exercise_has_Session_has_Actor_Actor_idActor`),
  CONSTRAINT `fk_Valuation_Exercise_has_Session_has_Actor1` FOREIGN KEY (`Exercise_has_Session_has_Actor_Exercise_has_Session_Exer_idExer`, `Exercise_has_Session_has_Actor_Exercise_has_Session_Ses_idSes`, `Exercise_has_Session_has_Actor_Actor_idActor`) REFERENCES `exercise_has_session_has_actor` (`Exercise_has_Session_Exercise_idExercise`, `Exercise_has_Session_Session_idSession`, `Actor_idActor`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Valuation_LearningOutcoming1` FOREIGN KEY (`LearningOutcoming_idLearningOutcoming`) REFERENCES `learningoutcoming` (`idLearningOutcoming`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `valuation`
--

LOCK TABLES `valuation` WRITE;
/*!40000 ALTER TABLE `valuation` DISABLE KEYS */;
INSERT INTO `valuation` VALUES (1,1,'Ejercicio mal',1,1,1),(3,1,'Bienee',1,1,1),(4,3,'Este ejercicio se hace',1,1,1);
/*!40000 ALTER TABLE `valuation` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-22 17:50:03
