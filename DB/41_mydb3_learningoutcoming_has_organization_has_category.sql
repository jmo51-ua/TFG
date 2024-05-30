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
-- Table structure for table `learningoutcoming_has_organization_has_category`
--

DROP TABLE IF EXISTS `learningoutcoming_has_organization_has_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `learningoutcoming_has_organization_has_category` (
  `LearningOutcoming_idLearningOutcoming` int NOT NULL,
  `Organization_has_Category_Organization_idOrganization` int NOT NULL,
  `Organization_has_Category_Category_idCategory` int NOT NULL,
  `Organization_has_Category_type` varchar(10) NOT NULL,
  PRIMARY KEY (`LearningOutcoming_idLearningOutcoming`,`Organization_has_Category_Organization_idOrganization`,`Organization_has_Category_Category_idCategory`,`Organization_has_Category_type`),
  KEY `fk_LearningOutcoming_has_Organization_has_Category_Organiza_idx` (`Organization_has_Category_Organization_idOrganization`,`Organization_has_Category_Category_idCategory`,`Organization_has_Category_type`),
  KEY `fk_LearningOutcoming_has_Organization_has_Category_Learning_idx` (`LearningOutcoming_idLearningOutcoming`),
  CONSTRAINT `fk_LearningOutcoming_has_Organization_has_Category_LearningOu1` FOREIGN KEY (`LearningOutcoming_idLearningOutcoming`) REFERENCES `learningoutcoming` (`idLearningOutcoming`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_LearningOutcoming_has_Organization_has_Category_Organizati1` FOREIGN KEY (`Organization_has_Category_Organization_idOrganization`, `Organization_has_Category_Category_idCategory`, `Organization_has_Category_type`) REFERENCES `organization_has_category` (`Organization_idOrganization`, `Category_idCategory`, `type`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learningoutcoming_has_organization_has_category`
--

LOCK TABLES `learningoutcoming_has_organization_has_category` WRITE;
/*!40000 ALTER TABLE `learningoutcoming_has_organization_has_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `learningoutcoming_has_organization_has_category` ENABLE KEYS */;
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
