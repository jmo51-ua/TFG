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
-- Table structure for table `actor_has_actortype`
--

DROP TABLE IF EXISTS `actor_has_actortype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actor_has_actortype` (
  `Actor_idActor` int NOT NULL,
  `ActorType_idActorType` int NOT NULL,
  `Organization_has_Category_Organization_idOrganization` int NOT NULL,
  `Organization_has_Category_Category_idCategory` int NOT NULL,
  `Organization_has_Category_type` varchar(10) NOT NULL,
  PRIMARY KEY (`Actor_idActor`,`ActorType_idActorType`),
  KEY `fk_Actor_has_ActorType_ActorType1_idx` (`ActorType_idActorType`),
  KEY `fk_Actor_has_ActorType_Actor1_idx` (`Actor_idActor`),
  KEY `fk_Actor_has_ActorType_Organization_has_Category1_idx` (`Organization_has_Category_Organization_idOrganization`,`Organization_has_Category_Category_idCategory`,`Organization_has_Category_type`),
  CONSTRAINT `fk_Actor_has_ActorType_Actor1` FOREIGN KEY (`Actor_idActor`) REFERENCES `actor` (`idActor`),
  CONSTRAINT `fk_Actor_has_ActorType_ActorType1` FOREIGN KEY (`ActorType_idActorType`) REFERENCES `actortype` (`idActorType`),
  CONSTRAINT `fk_Actor_has_ActorType_Organization_has_Category1` FOREIGN KEY (`Organization_has_Category_Organization_idOrganization`, `Organization_has_Category_Category_idCategory`, `Organization_has_Category_type`) REFERENCES `organization_has_category` (`Organization_idOrganization`, `Category_idCategory`, `type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actor_has_actortype`
--

LOCK TABLES `actor_has_actortype` WRITE;
/*!40000 ALTER TABLE `actor_has_actortype` DISABLE KEYS */;
INSERT INTO `actor_has_actortype` VALUES (3,1,9,1,'B'),(4,2,9,1,'B'),(5,2,9,1,'B'),(6,2,9,1,'B'),(7,2,9,1,'B'),(8,2,9,1,'B'),(9,2,9,1,'B'),(10,2,9,1,'B'),(11,2,9,1,'B'),(12,2,9,1,'B'),(2,1,10,1,'B'),(13,2,10,1,'B'),(14,2,10,1,'B'),(15,2,10,1,'B'),(16,2,10,1,'B'),(17,2,10,1,'B'),(18,2,10,1,'B'),(19,2,10,1,'B'),(20,2,10,1,'B'),(21,2,10,1,'B');
/*!40000 ALTER TABLE `actor_has_actortype` ENABLE KEYS */;
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
