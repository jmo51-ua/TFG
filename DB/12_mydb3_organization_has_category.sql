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
-- Table structure for table `organization_has_category`
--

DROP TABLE IF EXISTS `organization_has_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organization_has_category` (
  `Organization_idOrganization` int NOT NULL,
  `Category_idCategory` int NOT NULL,
  `type` varchar(10) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Organization_idOrganization`,`Category_idCategory`,`type`),
  KEY `fk_Organization_has_Category_Category1_idx` (`Category_idCategory`),
  KEY `fk_Organization_has_Category_Organization1_idx` (`Organization_idOrganization`),
  CONSTRAINT `fk_Organization_has_Category_Category1` FOREIGN KEY (`Category_idCategory`) REFERENCES `category` (`idCategory`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Organization_has_Category_Organization1` FOREIGN KEY (`Organization_idOrganization`) REFERENCES `organization` (`idOrganization`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organization_has_category`
--

LOCK TABLES `organization_has_category` WRITE;
/*!40000 ALTER TABLE `organization_has_category` DISABLE KEYS */;
INSERT INTO `organization_has_category` VALUES (1,1,'A','Equipo'),(1,2,'B','Equipo'),(4,1,'A','My Team'),(4,3,'1','Nuevo'),(9,1,'B','Benjamin A'),(9,2,'A','Alevin B'),(10,1,'B','Benjamin C'),(10,2,'A','Alevin A');
/*!40000 ALTER TABLE `organization_has_category` ENABLE KEYS */;
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
