CREATE DATABASE `wus2_be_user`
USE `wus2_be_user`;

CREATE TABLE `wus2_be_user`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `address` NVARCHAR(255) NOT NULL,
  `name` NVARCHAR(45) NOT NULL,
  `phone` VARCHAR(45) NOT NULL,
  `dob` DATE NOT NULL,
  `card_id` VARCHAR(45) NOT NULL,
  `gender` NVARCHAR(45) NOT NULL,
  `avatar` VARCHAR(45) NOT NULL,
  `role` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  UNIQUE INDEX `cardID_UNIQUE` (`card_id` ASC));
