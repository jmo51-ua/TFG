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
-- Table structure for table `specialty_has_level_has_category_has_actor`
--

DROP TABLE IF EXISTS `specialty_has_level_has_category_has_actor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `specialty_has_level_has_category_has_actor` (
  `Specialty_idSpecialty` int NOT NULL,
  `Level_has_Category_has_Actor_Level_has_Category_Level_idLevel` int NOT NULL,
  `Level_has_Category_has_Actor_Level_has_Category_Cat_idCat` int NOT NULL,
  `Level_has_Category_has_Actor_Actor_idActor` int NOT NULL,
  PRIMARY KEY (`Specialty_idSpecialty`,`Level_has_Category_has_Actor_Level_has_Category_Level_idLevel`,`Level_has_Category_has_Actor_Level_has_Category_Cat_idCat`,`Level_has_Category_has_Actor_Actor_idActor`),
  KEY `fk_Specialty_has_Level_has_Category_has_Actor_Level_has_Cat_idx` (`Level_has_Category_has_Actor_Level_has_Category_Level_idLevel`,`Level_has_Category_has_Actor_Level_has_Category_Cat_idCat`,`Level_has_Category_has_Actor_Actor_idActor`),
  KEY `fk_Specialty_has_Level_has_Category_has_Actor_Specialty1_idx` (`Specialty_idSpecialty`),
  CONSTRAINT `fk_Specialty_has_Level_has_Category_has_Actor_Level_has_Categ1` FOREIGN KEY (`Level_has_Category_has_Actor_Level_has_Category_Level_idLevel`, `Level_has_Category_has_Actor_Level_has_Category_Cat_idCat`, `Level_has_Category_has_Actor_Actor_idActor`) REFERENCES `level_has_category_has_actor` (`Level_has_Category_Level_idLevel`, `Level_has_Category_Category_idCategory`, `Actor_idActor`),
  CONSTRAINT `fk_Specialty_has_Level_has_Category_has_Actor_Specialty1` FOREIGN KEY (`Specialty_idSpecialty`) REFERENCES `specialty` (`idSpecialty`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specialty_has_level_has_category_has_actor`
--

LOCK TABLES `specialty_has_level_has_category_has_actor` WRITE;
/*!40000 ALTER TABLE `specialty_has_level_has_category_has_actor` DISABLE KEYS */;
/*!40000 ALTER TABLE `specialty_has_level_has_category_has_actor` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-22 17:50:00
