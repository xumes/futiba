
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;

SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema Futiba
-- -----------------------------------------------------

CREATE SCHEMA IF NOT EXISTS `Futiba` DEFAULT CHARACTER SET utf8 ;

USE `Futiba` ;

-- -----------------------------------------------------
-- Table `Futiba`.`users`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `Futiba`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(245) NULL,
  `email` VARCHAR(245) NULL,
  `role` VARCHAR(245) NULL,
  `passwd` VARCHAR(245) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Futiba`.`groups`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `Futiba`.`groups` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(245) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Futiba`.`groups_users`
-- -----------------------------------------------------

/* User_id and group_id in code is named as groups_users.users and groups_users.groups */

CREATE TABLE IF NOT EXISTS `Futiba`.`groups_users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `group_id` INT NOT NULL,
  `role` VARCHAR(245) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_groups_users_users_idx` (`users` ASC),
  INDEX `fk_groups_users_groups1_idx` (`groups` ASC),
  CONSTRAINT `fk_groups_users_users`
    FOREIGN KEY (`users`)
    REFERENCES `Futiba`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_groups_users_groups1`
    FOREIGN KEY (`groups`)
    REFERENCES `Futiba`.`groups` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Futiba`.`games`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `Futiba`.`games` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `team_a` VARCHAR(245) NULL,
  `team_b` VARCHAR(245) NULL,
  `result_a` INT NULL,
  `result_b` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Futiba`.`guessings`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `Futiba`.`guessings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `result_a` INT NULL,
  `result_b` INT NULL,
  `score` INT NULL,
  `group_id` INT NOT NULL,
  `game_id` INT NOT NULL,
  `users_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_guessings_groups1_idx` (`group_id` ASC),
  INDEX `fk_guessings_games1_idx` (`game_id` ASC),
  INDEX `fk_guessings_users1_idx` (`users_id` ASC),
  CONSTRAINT `fk_guessings_groups1`
    FOREIGN KEY (`group_id`)
    REFERENCES `Futiba`.`groups` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_guessings_games1`
    FOREIGN KEY (`game_id`)
    REFERENCES `Futiba`.`games` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_guessings_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `Futiba`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `Futiba`.`comments`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `Futiba`.`comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `comment` TEXT NULL,
  `guessing_id` INT NOT NULL,
  `users_id` INT NOT NULL,
  PRIMARY KEY (`id`, `users_id`),
  INDEX `fk_comments_guessings1_idx` (`guessing_id` ASC),
  INDEX `fk_comments_users1_idx` (`users_id` ASC),
  CONSTRAINT `fk_comments_guessings1`
    FOREIGN KEY (`guessing_id`)
    REFERENCES `Futiba`.`guessings` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_comments_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `Futiba`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;

SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
