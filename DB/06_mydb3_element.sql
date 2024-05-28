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
-- Table structure for table `element`
--

DROP TABLE IF EXISTS `element`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `element` (
  `id` int NOT NULL AUTO_INCREMENT,
  `creator` int DEFAULT NULL COMMENT 'Creador del elemento',
  `creation_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
  `owner` int DEFAULT NULL COMMENT 'Propietario del elemento. El propietario siempre tiene acceso al recurso',
  PRIMARY KEY (`id`),
  KEY `fk_element_user1_idx` (`creator`),
  KEY `fk_element_owner_idx` (`owner`),
  CONSTRAINT `fk_element_creator` FOREIGN KEY (`creator`) REFERENCES `user` (`userId`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_element_owner` FOREIGN KEY (`owner`) REFERENCES `entity` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Una entidad es una generalización de los actores del sistema (usuarios / grupos / organizaciones). Permite condensar en una tabla el acceso (permisos) a un recurso\\n\\nLas primeras entidades son los codigos de los element_type. Permite dar acceso general a los tipos (organizaciones, mapas, usuarios...)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `element`
--

LOCK TABLES `element` WRITE;
/*!40000 ALTER TABLE `element` DISABLE KEYS */;
INSERT INTO `element` VALUES (1,NULL,'2020-10-27 09:57:06',NULL),(2,NULL,'2020-10-27 10:30:07',NULL),(4,NULL,'2024-03-08 11:47:24',NULL),(5,NULL,'2024-03-13 15:24:35',NULL);
/*!40000 ALTER TABLE `element` ENABLE KEYS */;
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
