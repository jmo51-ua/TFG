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
-- Table structure for table `learningoutcoming`
--

DROP TABLE IF EXISTS `learningoutcoming`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `learningoutcoming` (
  `idLearningOutcoming` int NOT NULL AUTO_INCREMENT,
  `LearninngType_idLearninngType` int NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idLearningOutcoming`),
  KEY `fk_LearningOutcoming_LearninngType1_idx` (`LearninngType_idLearninngType`),
  CONSTRAINT `fk_LearningOutcoming_LearninngType1` FOREIGN KEY (`LearninngType_idLearninngType`) REFERENCES `learninngtype` (`idLearninngType`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3 COMMENT='Los resultados de aprendizaje son enunciados a cerca de lo que se espera que el estudiante sea capaz de hacer, comprender y/o sea capaz de demostrar una vez terminado un proceso de aprendizaje.\nComo las competencias son complicadas de medir, se dividen en estos enunciados más sencillos que permiten alcanzar las competencias.\nSus características son:\n\nLos resultados de aprendizaje promueven el enfoque centrado en el estudiante en la planificación del currículo académico, favoreciendo el cambio de los modelos de enseñanza basados exclusivamente en inputs (centrados en lo que el profesor enseñaba en el aula) hacia aquellos fundamentados más en outputs (basados en el estudiante y su aprendizaje), remitiendo a un enfoque sistémico más equilibrado que atiende tanto a inputs como a outputs.\nAportan claridad y transparencia en el sistema de educación superior, fomentando la coherencia entre formación, evaluación y resultados, promoviendo la integración y la consistencia de las diferentes asignaturas con los resultados globales que se pretende que alcancen los estudiantes.\nOfrecen mejor información tanto a profesores y estudiantes como a empleadores en la  medida en que los estudiantes conocen lo que se espera exactamente de ellos, y los empleadores pueden conocer lo que los egresados conocen y son capaces de hacer a la hora de incorporarse a un nuevo puesto de trabajo.\nContribuyen tanto a fomentar la movilidad de estudiantes como a mejorar la comparación  de las cualiﬁcaciones en términos internacionales, puesto que se alinean con los marcos de cualiﬁcaciones de los diferentes países.\n\nEjemplos:\n\nSaber golpear con la dos piernas\nSer capaz de decidir cuando regatear';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learningoutcoming`
--

LOCK TABLES `learningoutcoming` WRITE;
/*!40000 ALTER TABLE `learningoutcoming` DISABLE KEYS */;
INSERT INTO `learningoutcoming` VALUES (1,2,'Golpeos pierna izquierda','Dominar golpeos con la pierna izquierda'),(3,3,'Paradas mano izquierda','cambia'),(7,2,'Paradas mano derecha',NULL),(8,1,'Golpeos pierna derecha',NULL),(9,3,'Posicionamiento general','Se posiciona correctamente '),(10,3,'Desmarques dentro del campo','Se desmarca correctamente '),(11,1,'Resistencia anaeróbica','Es capaz de hacer esfuerzos muy intensos'),(12,1,'Resistencia aeróbica','Aguanta todo el partido sin problemas'),(13,2,'Pases pierna buena','Da pases correctos con su pierna más hábil'),(14,2,'Pases pierna mala','Da pases correctos con su pierna menos habil'),(15,2,'Tiros pierna buena','Chuta correctamente con su pierna más hábil'),(16,2,'Tiros pierna mala','Chuta correctamente con su pierna menos hábil'),(17,2,'Paradas disparos lejanos','Para los tiros lejanos que son posibles'),(18,2,'Paradas uno contra uno','Para los uno contra uno que son posibles');
/*!40000 ALTER TABLE `learningoutcoming` ENABLE KEYS */;
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
