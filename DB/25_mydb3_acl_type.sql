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
-- Table structure for table `acl_type`
--

DROP TABLE IF EXISTS `acl_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `acl_type` (
  `entity` int NOT NULL,
  `element` int NOT NULL,
  `type` int NOT NULL,
  `creator` int NOT NULL,
  `level` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`entity`,`element`,`type`,`creator`),
  KEY `fk_acl_type_element_type1_idx` (`type`),
  KEY `fk_acl_type_acl_level1_idx` (`level`),
  KEY `fk_acl_type_entity1_idx` (`creator`),
  KEY `fk_acl_type_entity2_idx` (`entity`),
  KEY `fk_acl_type_element` (`element`),
  CONSTRAINT `fk_acl_type_creator` FOREIGN KEY (`creator`) REFERENCES `entity` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_acl_type_element` FOREIGN KEY (`element`) REFERENCES `element` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_acl_type_entity` FOREIGN KEY (`entity`) REFERENCES `entity` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_acl_type_level` FOREIGN KEY (`level`) REFERENCES `acl_level` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_acl_type_type` FOREIGN KEY (`type`) REFERENCES `element_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Para la gestión de los permisos a sub-elementos de un tipo.\\nPermisos para los elementos (creados por creator) de la lista indicados en type\\n\\n';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acl_type`
--

LOCK TABLES `acl_type` WRITE;
/*!40000 ALTER TABLE `acl_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `acl_type` ENABLE KEYS */;
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
