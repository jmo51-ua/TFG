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
-- Table structure for table `exercise_has_session_has_actor`
--

DROP TABLE IF EXISTS `exercise_has_session_has_actor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercise_has_session_has_actor` (
  `Exercise_has_Session_Exercise_idExercise` int NOT NULL,
  `Exercise_has_Session_Session_idSession` int NOT NULL,
  `Actor_idActor` int NOT NULL,
  `comment` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`Exercise_has_Session_Exercise_idExercise`,`Exercise_has_Session_Session_idSession`,`Actor_idActor`),
  KEY `fk_Exercise_has_Session_has_Actor_Actor1_idx` (`Actor_idActor`),
  KEY `fk_Exercise_has_Session_has_Actor_Exercise_has_Session1_idx` (`Exercise_has_Session_Exercise_idExercise`,`Exercise_has_Session_Session_idSession`),
  CONSTRAINT `fk_Exercise_has_Session_has_Actor_Actor1` FOREIGN KEY (`Actor_idActor`) REFERENCES `actor` (`idActor`),
  CONSTRAINT `fk_Exercise_has_Session_has_Actor_Exercise_has_Session1` FOREIGN KEY (`Exercise_has_Session_Exercise_idExercise`, `Exercise_has_Session_Session_idSession`) REFERENCES `exercise_has_session` (`Exercise_idExercise`, `Session_idSession`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercise_has_session_has_actor`
--

LOCK TABLES `exercise_has_session_has_actor` WRITE;
/*!40000 ALTER TABLE `exercise_has_session_has_actor` DISABLE KEYS */;
INSERT INTO `exercise_has_session_has_actor` VALUES (1,1,1,NULL),(1,2,1,NULL),(1,3,1,NULL),(4,4,13,'Será un crack si sabe controlar su caracter. O no????? Nunca lo sabremos'),(4,4,14,NULL),(4,4,15,'Que grande es!!!'),(4,4,16,NULL),(4,4,17,NULL),(4,4,18,NULL),(4,4,19,NULL),(4,4,20,NULL),(4,4,21,NULL),(5,4,13,'Pedro pedro pedro pedro pe'),(5,4,14,'javiiii'),(5,4,15,NULL),(5,4,16,NULL),(5,4,17,NULL),(5,4,18,NULL),(5,4,19,NULL),(5,4,20,NULL),(5,4,21,NULL),(6,4,13,NULL),(6,4,14,NULL),(6,4,15,NULL),(6,4,16,NULL),(6,4,17,NULL),(6,4,18,NULL),(6,4,19,NULL),(6,4,20,NULL),(6,4,21,NULL),(7,4,13,NULL),(7,4,14,NULL),(7,4,15,NULL),(7,4,16,NULL),(7,4,17,NULL),(7,4,18,NULL),(7,4,19,NULL),(7,4,20,NULL),(7,4,21,NULL);
/*!40000 ALTER TABLE `exercise_has_session_has_actor` ENABLE KEYS */;
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
