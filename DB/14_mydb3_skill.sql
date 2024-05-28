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
-- Table structure for table `skill`
--

DROP TABLE IF EXISTS `skill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skill` (
  `idSkill` int NOT NULL AUTO_INCREMENT,
  `Level_idLevel` int NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idSkill`),
  KEY `fk_Skill_Level1_idx` (`Level_idLevel`),
  CONSTRAINT `fk_Skill_Level1` FOREIGN KEY (`Level_idLevel`) REFERENCES `level` (`idLevel`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3 COMMENT='Skill: Se trata de las competencias que de deben alcanzar por cada deportista una vez completado un nivel.\nEl grado de alcance de dichas competencias no tiene por qué ser el mismo para todos, y puede ser una referencia de la preparación de cada uno de los deportistas. \nLas competencias son generales y se  refiere a las capacidades que un deportista será capaz de hacer, afrontar, conocer dentro de un contexto global.\nLas competencias con compicadas de medir pero son fáciles de comprender para dar una visión de las caapcidades de un deportista.\nPor eso, dichas competencias serán divididas en otro concepto de negocio que definimos como Resultados de Aprendizaje.\nQué se entiende por competencia\n• “Se utiliza el término competencia exclusivamente en su acepción académica,\ny no en su acepción de atribución profesional. Las competencias son una combinación de conocimientos, habilidades (intelectuales, manuales, sociales, etc.),\nactitudes y valores que capacitarán a un titulado para afrontar con garantías la\nresolución de problemas o la intervención en un asunto en un contexto académico, profesional o social determinado” [Id., Apdo. 15] (subrayado nuestro).\n• “Una combinación de saberes técnicos, metodológicos, sociales y participativos que se actualizan en una situación y en un momento particulares” (Agència\nper a la Qualitat del Sistema Universitari de Catalunya, 2003: 43).\n• Capacidad para responder a las demandas y llevar a cabo tareas de forma\nadecuada. Cada competencia se construye a través de la combinación de habilidades cognitivas y prácticas, conocimiento (incluyendo el conocimiento tácito),\nmotivación, valores, actitudes, emociones y otros compone';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skill`
--

LOCK TABLES `skill` WRITE;
/*!40000 ALTER TABLE `skill` DISABLE KEYS */;
INSERT INTO `skill` VALUES (4,1,'Ola','jeje'),(6,1,'Prueba','je'),(8,1,'Competencia pierna derecha',NULL),(9,4,'Posicionamiento','Se posiciona correctamente'),(10,4,'Resistencia','Aguanta todo el partido'),(11,4,'Pases','Da pases con precision'),(12,4,'Tiros','Dispara con potencia'),(13,4,'Paradas','Para los disparos que son asequibles');
/*!40000 ALTER TABLE `skill` ENABLE KEYS */;
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
