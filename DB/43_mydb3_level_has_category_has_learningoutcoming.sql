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
-- Table structure for table `level_has_category_has_learningoutcoming`
--

DROP TABLE IF EXISTS `level_has_category_has_learningoutcoming`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `level_has_category_has_learningoutcoming` (
  `Level_has_Category_Level_idLevel` int NOT NULL,
  `Level_has_Category_Category_idCategory` int NOT NULL,
  `LearningOutcoming_idLearningOutcoming` int NOT NULL,
  PRIMARY KEY (`Level_has_Category_Level_idLevel`,`Level_has_Category_Category_idCategory`,`LearningOutcoming_idLearningOutcoming`),
  KEY `fk_Level_has_Category_has_LearningOutcoming_LearningOutcomi_idx` (`LearningOutcoming_idLearningOutcoming`),
  KEY `fk_Level_has_Category_has_LearningOutcoming_Level_has_Categ_idx` (`Level_has_Category_Level_idLevel`,`Level_has_Category_Category_idCategory`),
  CONSTRAINT `fk_Level_has_Category_has_LearningOutcoming_LearningOutcoming1` FOREIGN KEY (`LearningOutcoming_idLearningOutcoming`) REFERENCES `learningoutcoming` (`idLearningOutcoming`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Level_has_Category_has_LearningOutcoming_Level_has_Category1` FOREIGN KEY (`Level_has_Category_Level_idLevel`, `Level_has_Category_Category_idCategory`) REFERENCES `level_has_category` (`Level_idLevel`, `Category_idCategory`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `level_has_category_has_learningoutcoming`
--

LOCK TABLES `level_has_category_has_learningoutcoming` WRITE;
/*!40000 ALTER TABLE `level_has_category_has_learningoutcoming` DISABLE KEYS */;
/*!40000 ALTER TABLE `level_has_category_has_learningoutcoming` ENABLE KEYS */;
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
