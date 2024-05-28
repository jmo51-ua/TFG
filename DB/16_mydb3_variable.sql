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
-- Table structure for table `variable`
--

DROP TABLE IF EXISTS `variable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variable` (
  `idVariable` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `KPI_idKPI` int NOT NULL,
  `KPI_LearningOutcoming_idLearningOutcoming` int NOT NULL,
  `type` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`idVariable`,`KPI_idKPI`,`KPI_LearningOutcoming_idLearningOutcoming`),
  KEY `fk_Variable_KPI1_idx` (`KPI_idKPI`,`KPI_LearningOutcoming_idLearningOutcoming`),
  CONSTRAINT `fk_Variable_KPI1` FOREIGN KEY (`KPI_idKPI`, `KPI_LearningOutcoming_idLearningOutcoming`) REFERENCES `kpi` (`idKPI`, `LearningOutcoming_idLearningOutcoming`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variable`
--

LOCK TABLES `variable` WRITE;
/*!40000 ALTER TABLE `variable` DISABLE KEYS */;
INSERT INTO `variable` VALUES (3,'Variable nueva','nueva',1,1,1),(4,'Variable de prueba','jeje',1,1,1),(5,'Ejecución','aver',4,1,1),(6,'Esfuerzo','ola',4,1,1),(7,'Esfuerzo',NULL,5,3,1),(8,'Ejecucion',NULL,5,3,1),(9,'Esfuerzo',NULL,6,7,1),(10,'Ejecucion',NULL,6,7,1),(12,'Esfuerzo',NULL,2,3,1),(13,'Ejecución',NULL,2,3,1),(14,'Variable derecha',NULL,7,8,1),(15,'Pases cortos correctos','Numero de pases cortos buenos',9,13,1),(16,'Pases cortos bien ejecutados','Realiza bien los pases cortos',9,13,2),(17,'Centros bien realizados','Numero de centros buenos',10,13,1),(18,'Centra correctamente','Realiza bien los centros',10,13,2),(19,'Pases largos correctos','Numero pases largos buenos',11,13,1),(20,'Pases largos bien ejecutados','Realiza bien los pases largos',11,13,2),(21,'Goles de remate','Numero de goles de remate',12,15,1),(22,'Remata correctamente','Realiza bien los remates',12,15,2),(23,'Goles definicion','Numero goles definiendo',13,15,1),(24,'Define correctamente','Define correctamente',13,15,2),(25,'Tiempo corriendo','Tiempo que está corriendo',15,12,3),(26,'Tiene una resistencia optima','Aguanta bien el ejercicio',15,12,0),(27,'Tiempo por vueltas','Medimos el tiempo por vueltas',15,12,4),(28,'Series Sprints ','Tiempo en series',16,11,5),(29,'Esfuerzos grandes','Realiza grandes esfuerzos',16,11,0),(30,'Se desmarca al lugar correcto','Se descarma donde toca',17,10,2),(31,'Desmarques buenos','Numero de desmarques buenos',17,10,1),(32,'Se desmarca en buen momento','Se desmarca cuando toca',18,10,2),(33,'Desmarques con buen timing','Numero de desmarques buenos',18,10,1);
/*!40000 ALTER TABLE `variable` ENABLE KEYS */;
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
