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
-- Table structure for table `kpi`
--

DROP TABLE IF EXISTS `kpi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kpi` (
  `idKPI` int NOT NULL AUTO_INCREMENT,
  `LearningOutcoming_idLearningOutcoming` int NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `range` int DEFAULT NULL,
  PRIMARY KEY (`idKPI`,`LearningOutcoming_idLearningOutcoming`),
  KEY `fk_KPI_LearningOutcoming1_idx` (`LearningOutcoming_idLearningOutcoming`),
  CONSTRAINT `fk_KPI_LearningOutcoming1` FOREIGN KEY (`LearningOutcoming_idLearningOutcoming`) REFERENCES `learningoutcoming` (`idLearningOutcoming`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kpi`
--

LOCK TABLES `kpi` WRITE;
/*!40000 ALTER TABLE `kpi` DISABLE KEYS */;
INSERT INTO `kpi` VALUES (1,1,'PI 1','1',NULL),(2,3,'Precisión paradas largo alcance','2',50),(4,1,'PI 2','Hola',20),(5,3,'Precision paradas corto alcance','Hola',50),(6,7,'PD 1',NULL,50),(7,8,'Precision golpes pierna derecha',NULL,NULL),(8,9,'Posicionamiento en el terreno de juego','Se posiciona correctamente',50),(9,13,'Pases cortos pierna buena',NULL,50),(10,13,'Centros pierna buena',NULL,50),(11,13,'Pases largos pierna buena',NULL,50),(12,15,'Remates pierna buena',NULL,50),(13,15,'Definicion pierna buena',NULL,50),(14,15,'Tiros lejanos pierna buena',NULL,50),(15,12,'Resistencia aerobica',NULL,50),(16,11,'Resistencia anaerobica',NULL,50),(17,10,'Desmarques correctos',NULL,50),(18,10,'Desmarques con buen timing',NULL,50);
/*!40000 ALTER TABLE `kpi` ENABLE KEYS */;
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
