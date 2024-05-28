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
-- Table structure for table `exercise`
--

DROP TABLE IF EXISTS `exercise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercise` (
  `idExercise` int NOT NULL AUTO_INCREMENT,
  `Activity_idActivity` int NOT NULL,
  `defaultTime` int DEFAULT NULL COMMENT 'In minutes',
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idExercise`),
  KEY `fk_Exercise_Activity1_idx` (`Activity_idActivity`),
  CONSTRAINT `fk_Exercise_Activity1` FOREIGN KEY (`Activity_idActivity`) REFERENCES `activity` (`idActivity`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3 COMMENT='Un ejercicio es una actividad concreta con una duración de tiempo y que deberá ser realizado por un equipo o un conjunto de actores.\nUn ejercicio es definido para entrenar uno o varios resultados de aprendizajes y debe indicarse si es para todo el equipo, si es un deporte de equipo, o para miembros concretos.\nSe debe indicar el orden de los ejercicios en la sesión, que lo indicará la posición en la IU.\nUn ejercicio debe tener un duración concreta.\n';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercise`
--

LOCK TABLES `exercise` WRITE;
/*!40000 ALTER TABLE `exercise` DISABLE KEYS */;
INSERT INTO `exercise` VALUES (1,1,NULL,'Ejercicio1'),(2,1,NULL,'Ejercicio 2'),(3,2,10,'Disparos lejanos'),(4,3,15,'Centros y remates'),(5,4,10,'Carrera continua'),(6,5,10,'Calentamiento'),(7,6,20,'Partido entrenamiento'),(8,7,60,'Partido');
/*!40000 ALTER TABLE `exercise` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-22 17:49:59
