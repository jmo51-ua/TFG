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
-- Table structure for table `actor_manages_exercise_in_session`
--

DROP TABLE IF EXISTS `actor_manages_exercise_in_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actor_manages_exercise_in_session` (
  `Actor_idActor` int NOT NULL,
  `Exercise_has_Session_Exercise_idExercise` int NOT NULL,
  `Exercise_has_Session_Session_idSession` int NOT NULL,
  PRIMARY KEY (`Actor_idActor`,`Exercise_has_Session_Exercise_idExercise`,`Exercise_has_Session_Session_idSession`),
  KEY `fk_Actor_has_Exercise_has_Session_Exercise_has_Session1_idx` (`Exercise_has_Session_Exercise_idExercise`,`Exercise_has_Session_Session_idSession`),
  KEY `fk_Actor_has_Exercise_has_Session_Actor1_idx` (`Actor_idActor`),
  CONSTRAINT `fk_Actor_has_Exercise_has_Session_Actor1` FOREIGN KEY (`Actor_idActor`) REFERENCES `actor` (`idActor`),
  CONSTRAINT `fk_Actor_has_Exercise_has_Session_Exercise_has_Session1` FOREIGN KEY (`Exercise_has_Session_Exercise_idExercise`, `Exercise_has_Session_Session_idSession`) REFERENCES `exercise_has_session` (`Exercise_idExercise`, `Session_idSession`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='Uno o varios actores deben dirigir cada ejercicio dentro de la sesión.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actor_manages_exercise_in_session`
--

LOCK TABLES `actor_manages_exercise_in_session` WRITE;
/*!40000 ALTER TABLE `actor_manages_exercise_in_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `actor_manages_exercise_in_session` ENABLE KEYS */;
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
