/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80019 (8.0.19)
 Source Host           : localhost:3306
 Source Schema         : breaking_dance_competition_v2

 Target Server Type    : MySQL
 Target Server Version : 80019 (8.0.19)
 File Encoding         : 65001

 Date: 20/04/2025 15:52:08
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for competition_stages
-- ----------------------------
DROP TABLE IF EXISTS `competition_stages`;
CREATE TABLE `competition_stages`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `competition_id` int NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('group','knockout') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `order` int NOT NULL,
  `status` enum('pending','in_progress','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `competition_id`(`competition_id` ASC) USING BTREE,
  CONSTRAINT `competition_stages_ibfk_1` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of competition_stages
-- ----------------------------
INSERT INTO `competition_stages` VALUES (1, 1, '小组赛', 'group', 1, 'in_progress', '2025-04-19 07:37:14', '2025-04-19 16:02:24');
INSERT INTO `competition_stages` VALUES (2, 1, '淘汰赛', 'knockout', 2, 'pending', '2025-04-19 07:37:14', '2025-04-19 07:37:14');
INSERT INTO `competition_stages` VALUES (3, 503, '资格赛', 'group', 1, 'completed', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `competition_stages` VALUES (4, 503, '16强赛', 'knockout', 2, 'pending', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `competition_stages` VALUES (5, 504, '资格赛', 'group', 1, 'completed', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `competition_stages` VALUES (6, 504, '16强赛', 'knockout', 2, 'pending', '2025-04-20 07:34:49', '2025-04-20 07:34:49');

-- ----------------------------
-- Table structure for competitions
-- ----------------------------
DROP TABLE IF EXISTS `competitions`;
CREATE TABLE `competitions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `status` enum('draft','registration','in_progress','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'draft',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 505 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of competitions
-- ----------------------------
INSERT INTO `competitions` VALUES (1, '2024年第一季度霹雳舞比赛', '这是一个测试用的霹雳舞比赛，包含小组赛和淘汰赛阶段。', '2024-01-15 00:00:00', '2024-03-31 00:00:00', 'registration', '2025-04-19 07:37:14', '2025-04-19 07:37:14');
INSERT INTO `competitions` VALUES (501, '2024全国霹雳舞锦标赛', '全国32强选手争夺霹雳舞最高荣誉', '2025-04-20 07:24:40', '2025-05-04 07:24:40', 'in_progress', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `competitions` VALUES (502, '2024全国霹雳舞锦标赛_140054', '全国32强选手争夺霹雳舞最高荣誉', '2025-04-20 07:29:00', '2025-05-04 07:29:00', 'in_progress', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `competitions` VALUES (503, '霹雳舞锦标赛_34386708', '全国32强选手争夺霹雳舞最高荣誉', '2025-04-20 07:33:06', '2025-05-04 07:33:06', 'in_progress', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `competitions` VALUES (504, '霹雳舞锦标赛_34489526', '全国32强选手争夺霹雳舞最高荣誉', '2025-04-20 07:34:49', '2025-05-04 07:34:49', 'in_progress', '2025-04-20 07:34:49', '2025-04-20 07:34:49');

-- ----------------------------
-- Table structure for group_players
-- ----------------------------
DROP TABLE IF EXISTS `group_players`;
CREATE TABLE `group_players`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `player_id` int NOT NULL,
  `points` int NOT NULL DEFAULT 0,
  `rank` int NULL DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `group_id`(`group_id` ASC) USING BTREE,
  INDEX `player_id`(`player_id` ASC) USING BTREE,
  CONSTRAINT `group_players_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `group_players_ibfk_2` FOREIGN KEY (`player_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 37 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of group_players
-- ----------------------------
INSERT INTO `group_players` VALUES (29, 11, 1, 0, NULL, '2025-04-19 16:02:25', '2025-04-19 16:02:25');
INSERT INTO `group_players` VALUES (30, 11, 2, 0, NULL, '2025-04-19 16:02:25', '2025-04-19 16:02:25');
INSERT INTO `group_players` VALUES (31, 12, 3, 0, NULL, '2025-04-19 16:02:25', '2025-04-19 16:02:25');
INSERT INTO `group_players` VALUES (32, 12, 4, 0, NULL, '2025-04-19 16:02:25', '2025-04-19 16:02:25');
INSERT INTO `group_players` VALUES (33, 13, 5, 0, NULL, '2025-04-19 16:02:25', '2025-04-19 16:02:25');
INSERT INTO `group_players` VALUES (34, 13, 6, 0, NULL, '2025-04-19 16:02:25', '2025-04-19 16:02:25');
INSERT INTO `group_players` VALUES (35, 14, 7, 0, NULL, '2025-04-19 16:02:25', '2025-04-19 16:02:25');
INSERT INTO `group_players` VALUES (36, 14, 8, 0, NULL, '2025-04-19 16:02:25', '2025-04-19 16:02:25');

-- ----------------------------
-- Table structure for groups
-- ----------------------------
DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `competition_id` int NOT NULL,
  `stage_id` int NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('pending','in_progress','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `competition_id`(`competition_id` ASC) USING BTREE,
  INDEX `stage_id`(`stage_id` ASC) USING BTREE,
  CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `groups_ibfk_2` FOREIGN KEY (`stage_id`) REFERENCES `competition_stages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of groups
-- ----------------------------
INSERT INTO `groups` VALUES (1, 1, 1, 'A组', 'pending', '2025-04-19 07:37:14', '2025-04-19 07:37:14');
INSERT INTO `groups` VALUES (2, 1, 1, 'B组', 'pending', '2025-04-19 07:37:14', '2025-04-19 07:37:14');
INSERT INTO `groups` VALUES (11, 1, 1, 'A组', 'pending', '2025-04-19 16:02:25', '2025-04-19 16:02:25');
INSERT INTO `groups` VALUES (12, 1, 1, 'B组', 'pending', '2025-04-19 16:02:25', '2025-04-19 16:02:25');
INSERT INTO `groups` VALUES (13, 1, 1, 'C组', 'pending', '2025-04-19 16:02:25', '2025-04-19 16:02:25');
INSERT INTO `groups` VALUES (14, 1, 1, 'D组', 'pending', '2025-04-19 16:02:25', '2025-04-19 16:02:25');

-- ----------------------------
-- Table structure for matches
-- ----------------------------
DROP TABLE IF EXISTS `matches`;
CREATE TABLE `matches`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `competition_id` int NOT NULL,
  `stage_id` int NOT NULL,
  `group_id` int NULL DEFAULT NULL,
  `player1_id` int NOT NULL,
  `player2_id` int NOT NULL,
  `player1_score` int NOT NULL DEFAULT 0,
  `player2_score` int NOT NULL DEFAULT 0,
  `status` enum('pending','in_progress','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `scheduled_time` datetime NULL DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `winner_id` int NULL DEFAULT NULL COMMENT '获胜者ID',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `competition_id`(`competition_id` ASC) USING BTREE,
  INDEX `stage_id`(`stage_id` ASC) USING BTREE,
  INDEX `group_id`(`group_id` ASC) USING BTREE,
  INDEX `player1_id`(`player1_id` ASC) USING BTREE,
  INDEX `player2_id`(`player2_id` ASC) USING BTREE,
  INDEX `matches_winner_id_foreign_idx`(`winner_id` ASC) USING BTREE,
  CONSTRAINT `matches_ibfk_1` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `matches_ibfk_2` FOREIGN KEY (`stage_id`) REFERENCES `competition_stages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `matches_ibfk_3` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `matches_ibfk_4` FOREIGN KEY (`player1_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `matches_ibfk_5` FOREIGN KEY (`player2_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `matches_winner_id_foreign_idx` FOREIGN KEY (`winner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 35 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of matches
-- ----------------------------
INSERT INTO `matches` VALUES (14, 1, 1, 11, 1, 2, 0, 0, 'pending', NULL, '2025-04-19 16:02:25', '2025-04-19 16:02:25', NULL);
INSERT INTO `matches` VALUES (15, 1, 1, 12, 3, 4, 0, 0, 'in_progress', NULL, '2025-04-19 16:02:25', '2025-04-19 16:02:25', NULL);
INSERT INTO `matches` VALUES (16, 1, 1, 13, 5, 6, 0, 0, 'in_progress', NULL, '2025-04-19 16:02:25', '2025-04-19 16:02:25', NULL);
INSERT INTO `matches` VALUES (17, 1, 1, 14, 7, 8, 0, 0, 'completed', NULL, '2025-04-19 16:02:25', '2025-04-19 16:02:25', NULL);
INSERT INTO `matches` VALUES (18, 504, 5, NULL, 634, 635, 0, 0, 'completed', '2025-04-18 07:34:49', '2025-04-20 07:34:49', '2025-04-20 07:34:49', NULL);
INSERT INTO `matches` VALUES (19, 504, 6, NULL, 641, 659, 0, 0, 'pending', '2025-04-20 07:34:49', '2025-04-20 07:34:49', '2025-04-20 07:34:49', NULL);
INSERT INTO `matches` VALUES (20, 504, 6, NULL, 654, 638, 0, 0, 'pending', '2025-04-20 08:04:49', '2025-04-20 07:34:49', '2025-04-20 07:34:49', NULL);
INSERT INTO `matches` VALUES (21, 504, 6, NULL, 653, 656, 0, 0, 'pending', '2025-04-20 08:34:49', '2025-04-20 07:34:49', '2025-04-20 07:34:49', NULL);
INSERT INTO `matches` VALUES (22, 504, 6, NULL, 651, 662, 0, 0, 'pending', '2025-04-20 09:04:49', '2025-04-20 07:34:49', '2025-04-20 07:34:49', NULL);
INSERT INTO `matches` VALUES (23, 504, 6, NULL, 650, 644, 0, 0, 'pending', '2025-04-20 09:34:49', '2025-04-20 07:34:49', '2025-04-20 07:34:49', NULL);
INSERT INTO `matches` VALUES (24, 504, 6, NULL, 658, 636, 0, 0, 'pending', '2025-04-20 10:04:49', '2025-04-20 07:34:49', '2025-04-20 07:34:49', NULL);
INSERT INTO `matches` VALUES (25, 504, 6, NULL, 634, 652, 0, 0, 'pending', '2025-04-20 10:34:49', '2025-04-20 07:34:49', '2025-04-20 07:34:49', NULL);
INSERT INTO `matches` VALUES (26, 504, 6, NULL, 648, 649, 0, 0, 'pending', '2025-04-20 11:04:49', '2025-04-20 07:34:49', '2025-04-20 07:34:49', NULL);
INSERT INTO `matches` VALUES (27, 504, 6, NULL, 660, 642, 0, 0, 'pending', '2025-04-20 11:34:49', '2025-04-20 07:34:49', '2025-04-20 07:34:49', NULL);
INSERT INTO `matches` VALUES (28, 504, 6, NULL, 647, 663, 0, 0, 'pending', '2025-04-20 12:04:49', '2025-04-20 07:34:49', '2025-04-20 07:34:49', NULL);
INSERT INTO `matches` VALUES (29, 504, 6, NULL, 639, 645, 0, 0, 'pending', '2025-04-20 12:34:49', '2025-04-20 07:34:49', '2025-04-20 07:34:49', NULL);
INSERT INTO `matches` VALUES (30, 504, 6, NULL, 655, 637, 0, 0, 'pending', '2025-04-20 13:04:49', '2025-04-20 07:34:49', '2025-04-20 07:34:49', NULL);
INSERT INTO `matches` VALUES (31, 504, 6, NULL, 643, 664, 0, 0, 'pending', '2025-04-20 13:34:49', '2025-04-20 07:34:49', '2025-04-20 07:34:49', NULL);
INSERT INTO `matches` VALUES (32, 504, 6, NULL, 646, 661, 0, 0, 'pending', '2025-04-20 14:04:49', '2025-04-20 07:34:49', '2025-04-20 07:34:49', NULL);
INSERT INTO `matches` VALUES (33, 504, 6, NULL, 665, 657, 0, 0, 'pending', '2025-04-20 14:34:49', '2025-04-20 07:34:49', '2025-04-20 07:34:49', NULL);
INSERT INTO `matches` VALUES (34, 504, 6, NULL, 635, 640, 0, 0, 'pending', '2025-04-20 15:04:49', '2025-04-20 07:34:49', '2025-04-20 07:34:49', NULL);

-- ----------------------------
-- Table structure for registrations
-- ----------------------------
DROP TABLE IF EXISTS `registrations`;
CREATE TABLE `registrations`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `competition_id` int NOT NULL,
  `player_id` int NOT NULL,
  `status` enum('pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `competition_id`(`competition_id` ASC) USING BTREE,
  INDEX `player_id`(`player_id` ASC) USING BTREE,
  CONSTRAINT `registrations_ibfk_1` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `registrations_ibfk_2` FOREIGN KEY (`player_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 49 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of registrations
-- ----------------------------
INSERT INTO `registrations` VALUES (5, 1, 1, 'approved', '2025-04-19 09:45:48', '2025-04-19 09:45:48');
INSERT INTO `registrations` VALUES (6, 1, 2, 'approved', '2025-04-19 09:45:48', '2025-04-19 09:45:48');
INSERT INTO `registrations` VALUES (7, 1, 3, 'approved', '2025-04-19 15:48:38', '2025-04-19 15:48:38');
INSERT INTO `registrations` VALUES (8, 1, 4, 'approved', '2025-04-19 15:48:38', '2025-04-19 15:48:38');
INSERT INTO `registrations` VALUES (9, 1, 5, 'approved', '2025-04-19 15:48:38', '2025-04-19 15:48:38');
INSERT INTO `registrations` VALUES (10, 1, 6, 'approved', '2025-04-19 15:48:38', '2025-04-19 15:48:38');
INSERT INTO `registrations` VALUES (11, 1, 7, 'approved', '2025-04-19 15:48:38', '2025-04-19 15:48:38');
INSERT INTO `registrations` VALUES (12, 1, 8, 'approved', '2025-04-19 15:48:38', '2025-04-19 15:48:38');
INSERT INTO `registrations` VALUES (13, 1, 9, 'approved', '2025-04-19 15:48:38', '2025-04-19 15:48:38');
INSERT INTO `registrations` VALUES (14, 1, 10, 'approved', '2025-04-19 15:48:38', '2025-04-19 15:48:38');
INSERT INTO `registrations` VALUES (15, 1, 11, 'approved', '2025-04-19 15:48:38', '2025-04-19 15:48:38');
INSERT INTO `registrations` VALUES (16, 1, 12, 'approved', '2025-04-19 15:48:38', '2025-04-19 15:48:38');
INSERT INTO `registrations` VALUES (17, 504, 634, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (18, 504, 635, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (19, 504, 636, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (20, 504, 637, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (21, 504, 638, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (22, 504, 639, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (23, 504, 640, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (24, 504, 641, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (25, 504, 642, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (26, 504, 643, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (27, 504, 644, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (28, 504, 645, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (29, 504, 646, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (30, 504, 647, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (31, 504, 648, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (32, 504, 649, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (33, 504, 650, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (34, 504, 651, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (35, 504, 652, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (36, 504, 653, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (37, 504, 654, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (38, 504, 655, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (39, 504, 656, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (40, 504, 657, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (41, 504, 658, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (42, 504, 659, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (43, 504, 660, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (44, 504, 661, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (45, 504, 662, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (46, 504, 663, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (47, 504, 664, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `registrations` VALUES (48, 504, 665, 'approved', '2025-04-20 07:34:49', '2025-04-20 07:34:49');

-- ----------------------------
-- Table structure for scores
-- ----------------------------
DROP TABLE IF EXISTS `scores`;
CREATE TABLE `scores`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `match_id` int NOT NULL,
  `player_id` int NOT NULL,
  `judge_id` int NOT NULL,
  `score` decimal(5, 2) NOT NULL DEFAULT 0.00,
  `comments` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `match_id`(`match_id` ASC) USING BTREE,
  INDEX `player_id`(`player_id` ASC) USING BTREE,
  INDEX `judge_id`(`judge_id` ASC) USING BTREE,
  CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `scores_ibfk_2` FOREIGN KEY (`player_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `scores_ibfk_3` FOREIGN KEY (`judge_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 41 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of scores
-- ----------------------------
INSERT INTO `scores` VALUES (7, 15, 3, 2, 45.00, NULL, '2025-04-20 06:46:02', '2025-04-20 06:46:02');
INSERT INTO `scores` VALUES (8, 15, 4, 2, 56.00, NULL, '2025-04-20 06:46:05', '2025-04-20 06:46:05');
INSERT INTO `scores` VALUES (9, 18, 634, 633, 93.10, '选手表现出色', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (10, 18, 635, 633, 82.80, '选手表现出色', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (11, 18, 636, 633, 67.80, '选手表现良好', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (12, 18, 637, 633, 76.80, '选手表现优秀', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (13, 18, 638, 633, 66.40, '选手表现良好', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (14, 18, 639, 633, 91.60, '选手表现出色', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (15, 18, 640, 633, 81.30, '选手表现出色', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (16, 18, 641, 633, 99.50, '选手表现出色', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (17, 18, 642, 633, 74.30, '选手表现优秀', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (18, 18, 643, 633, 86.00, '选手表现出色', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (19, 18, 644, 633, 67.50, '选手表现良好', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (20, 18, 645, 633, 74.60, '选手表现优秀', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (21, 18, 646, 633, 85.30, '选手表现出色', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (22, 18, 647, 633, 92.00, '选手表现出色', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (23, 18, 648, 633, 92.60, '选手表现出色', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (24, 18, 649, 633, 71.70, '选手表现优秀', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (25, 18, 650, 633, 95.20, '选手表现出色', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (26, 18, 651, 633, 95.30, '选手表现出色', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (27, 18, 652, 633, 68.90, '选手表现良好', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (28, 18, 653, 633, 95.60, '选手表现出色', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (29, 18, 654, 633, 97.60, '选手表现出色', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (30, 18, 655, 633, 87.90, '选手表现出色', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (31, 18, 656, 633, 66.60, '选手表现良好', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (32, 18, 657, 633, 81.20, '选手表现出色', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (33, 18, 658, 633, 93.30, '选手表现出色', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (34, 18, 659, 633, 65.90, '选手表现良好', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (35, 18, 660, 633, 92.50, '选手表现出色', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (36, 18, 661, 633, 78.40, '选手表现优秀', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (37, 18, 662, 633, 66.80, '选手表现良好', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (38, 18, 663, 633, 74.50, '选手表现优秀', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (39, 18, 664, 633, 77.60, '选手表现优秀', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `scores` VALUES (40, 18, 665, 633, 84.80, '选手表现出色', '2025-04-20 07:34:49', '2025-04-20 07:34:49');

-- ----------------------------
-- Table structure for sequelizemeta
-- ----------------------------
DROP TABLE IF EXISTS `sequelizemeta`;
CREATE TABLE `sequelizemeta`  (
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sequelizemeta
-- ----------------------------
INSERT INTO `sequelizemeta` VALUES ('20240101000000-create-users.js');
INSERT INTO `sequelizemeta` VALUES ('20240101000001-create-competitions.js');
INSERT INTO `sequelizemeta` VALUES ('20240101000002-create-registrations.js');
INSERT INTO `sequelizemeta` VALUES ('20240101000003-create-competition-stages.js');
INSERT INTO `sequelizemeta` VALUES ('20240101000004-create-groups.js');
INSERT INTO `sequelizemeta` VALUES ('20240101000005-create-group-players.js');
INSERT INTO `sequelizemeta` VALUES ('20240101000006-create-matches.js');
INSERT INTO `sequelizemeta` VALUES ('20240101000007-create-scores.js');
INSERT INTO `sequelizemeta` VALUES ('20250420005211-add-winner-id-to-matches.js');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('admin','player','judge') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 666 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'admin', '系统管理员', '12345', 'admin@example.com', '2025-04-19 07:37:14', '2025-04-20 03:28:31');
INSERT INTO `users` VALUES (2, 'judge1', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'judge', '裁判一', NULL, 'judge1@example.com', '2025-04-19 07:37:14', '2025-04-19 07:37:14');
INSERT INTO `users` VALUES (3, 'player1', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手一', NULL, 'player1@example.com', '2025-04-19 07:37:14', '2025-04-19 07:37:14');
INSERT INTO `users` VALUES (4, 'player2', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手二', NULL, 'player2@example.com', '2025-04-19 07:37:14', '2025-04-19 07:37:14');
INSERT INTO `users` VALUES (5, 'user1', '$2a$10$E4CqAUduiNMWI8A16tQj.ODu8wgPp6oyNn81GVB0AsgC4HFl3rAEi', 'player', 'user1', '13800138000', 'user1@example.com', '2025-04-19 15:12:10', '2025-04-19 15:12:10');
INSERT INTO `users` VALUES (6, 'player3', '$2a$10$YinNbwcaMLcS3svztdyi5.JYIAABJ4oORMsDUMoMM7q5f75SVJyKm', 'player', '选手3', '13800000003', 'player3@example.com', '2025-04-19 15:48:24', '2025-04-19 15:48:24');
INSERT INTO `users` VALUES (7, 'player4', '$2a$10$YinNbwcaMLcS3svztdyi5.JYIAABJ4oORMsDUMoMM7q5f75SVJyKm', 'player', '选手4', '13800000004', 'player4@example.com', '2025-04-19 15:48:24', '2025-04-19 15:48:24');
INSERT INTO `users` VALUES (8, 'player5', '$2a$10$YinNbwcaMLcS3svztdyi5.JYIAABJ4oORMsDUMoMM7q5f75SVJyKm', 'player', '选手5', '13800000005', 'player5@example.com', '2025-04-19 15:48:24', '2025-04-19 15:48:24');
INSERT INTO `users` VALUES (9, 'player6', '$2a$10$YinNbwcaMLcS3svztdyi5.JYIAABJ4oORMsDUMoMM7q5f75SVJyKm', 'player', '选手6', '13800000006', 'player6@example.com', '2025-04-19 15:48:24', '2025-04-19 15:48:24');
INSERT INTO `users` VALUES (10, 'player7', '$2a$10$YinNbwcaMLcS3svztdyi5.JYIAABJ4oORMsDUMoMM7q5f75SVJyKm', 'player', '选手7', '13800000007', 'player7@example.com', '2025-04-19 15:48:24', '2025-04-19 15:48:24');
INSERT INTO `users` VALUES (11, 'player8', '$2a$10$YinNbwcaMLcS3svztdyi5.JYIAABJ4oORMsDUMoMM7q5f75SVJyKm', 'player', '选手8', '13800000008', 'player8@example.com', '2025-04-19 15:48:24', '2025-04-19 15:48:24');
INSERT INTO `users` VALUES (12, 'player9', '$2a$10$YinNbwcaMLcS3svztdyi5.JYIAABJ4oORMsDUMoMM7q5f75SVJyKm', 'player', '选手9', '13800000009', 'player9@example.com', '2025-04-19 15:48:24', '2025-04-19 15:48:24');
INSERT INTO `users` VALUES (13, 'player10', '$2a$10$YinNbwcaMLcS3svztdyi5.JYIAABJ4oORMsDUMoMM7q5f75SVJyKm', 'player', '选手10', '13800000010', 'player10@example.com', '2025-04-19 15:48:24', '2025-04-19 15:48:24');
INSERT INTO `users` VALUES (14, 'player11', '$2a$10$YinNbwcaMLcS3svztdyi5.JYIAABJ4oORMsDUMoMM7q5f75SVJyKm', 'player', '选手11', '13800000011', 'player11@example.com', '2025-04-19 15:48:24', '2025-04-19 15:48:24');
INSERT INTO `users` VALUES (100, 'judge100', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'judge', '评委100号', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (101, 'player21', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手21', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (102, 'player22', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手22', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (103, 'player23', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手23', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (104, 'player24', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手24', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (105, 'player25', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手25', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (106, 'player26', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手26', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (107, 'player27', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手27', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (108, 'player28', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手28', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (109, 'player29', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手29', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (110, 'player30', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手30', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (111, 'player31', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手31', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (112, 'player32', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手32', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (113, 'player33', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手33', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (114, 'player34', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手34', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (115, 'player35', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手35', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (116, 'player36', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手36', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (117, 'player37', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手37', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (118, 'player38', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手38', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (119, 'player39', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手39', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (120, 'player40', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手40', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (121, 'player41', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手41', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (122, 'player42', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手42', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (123, 'player43', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手43', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (124, 'player44', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手44', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (125, 'player45', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手45', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (126, 'player46', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手46', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (127, 'player47', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手47', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (128, 'player48', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手48', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (129, 'player49', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手49', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (130, 'player50', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手50', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (131, 'player51', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手51', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (132, 'player52', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手52', NULL, NULL, '2025-04-20 07:03:16', '2025-04-20 07:03:16');
INSERT INTO `users` VALUES (500, 'judge500', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'judge', '评委500号', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (501, 'player501', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手1', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (502, 'player502', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手2', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (503, 'player503', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手3', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (504, 'player504', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手4', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (505, 'player505', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手5', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (506, 'player506', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手6', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (507, 'player507', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手7', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (508, 'player508', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手8', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (509, 'player509', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手9', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (510, 'player510', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手10', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (511, 'player511', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手11', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (512, 'player512', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手12', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (513, 'player513', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手13', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (514, 'player514', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手14', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (515, 'player515', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手15', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (516, 'player516', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手16', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (517, 'player517', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手17', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (518, 'player518', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手18', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (519, 'player519', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手19', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (520, 'player520', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手20', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (521, 'player521', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手21', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (522, 'player522', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手22', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (523, 'player523', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手23', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (524, 'player524', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手24', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (525, 'player525', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手25', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (526, 'player526', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手26', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (527, 'player527', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手27', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (528, 'player528', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手28', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (529, 'player529', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手29', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (530, 'player530', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手30', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (531, 'player531', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手31', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (532, 'player532', '$2a$10$H2rpwTp1rWBttFbQ4pisROd0L1iEpzCZiCNpE5dxCh6QzgFw/9BLK', 'player', '选手32', NULL, NULL, '2025-04-20 07:15:12', '2025-04-20 07:15:12');
INSERT INTO `users` VALUES (533, 'breakjudge1', '$2a$10$Lw8JTDUX4gW9cA57ctOWLeD91qpseGATSSqEbXrr5NcZaAJ7yj6t.', 'judge', '霹雳舞评委', NULL, 'breakjudge1@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (534, 'bboy1', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手1', '13900000001', 'bboy1@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (535, 'bboy2', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手2', '13900000002', 'bboy2@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (536, 'bboy3', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手3', '13900000003', 'bboy3@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (537, 'bboy4', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手4', '13900000004', 'bboy4@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (538, 'bboy5', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手5', '13900000005', 'bboy5@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (539, 'bboy6', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手6', '13900000006', 'bboy6@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (540, 'bboy7', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手7', '13900000007', 'bboy7@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (541, 'bboy8', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手8', '13900000008', 'bboy8@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (542, 'bboy9', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手9', '13900000009', 'bboy9@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (543, 'bboy10', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手10', '13900000010', 'bboy10@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (544, 'bboy11', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手11', '13900000011', 'bboy11@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (545, 'bboy12', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手12', '13900000012', 'bboy12@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (546, 'bboy13', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手13', '13900000013', 'bboy13@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (547, 'bboy14', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手14', '13900000014', 'bboy14@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (548, 'bboy15', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手15', '13900000015', 'bboy15@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (549, 'bboy16', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手16', '13900000016', 'bboy16@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (550, 'bboy17', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手17', '13900000017', 'bboy17@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (551, 'bboy18', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手18', '13900000018', 'bboy18@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (552, 'bboy19', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手19', '13900000019', 'bboy19@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (553, 'bboy20', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手20', '13900000020', 'bboy20@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (554, 'bboy21', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手21', '13900000021', 'bboy21@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (555, 'bboy22', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手22', '13900000022', 'bboy22@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (556, 'bboy23', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手23', '13900000023', 'bboy23@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (557, 'bboy24', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手24', '13900000024', 'bboy24@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (558, 'bboy25', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手25', '13900000025', 'bboy25@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (559, 'bboy26', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手26', '13900000026', 'bboy26@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (560, 'bboy27', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手27', '13900000027', 'bboy27@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (561, 'bboy28', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手28', '13900000028', 'bboy28@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (562, 'bboy29', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手29', '13900000029', 'bboy29@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (563, 'bboy30', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手30', '13900000030', 'bboy30@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (564, 'bboy31', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手31', '13900000031', 'bboy31@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (565, 'bboy32', '$2a$10$JjshQkrsbop9lsKkc7s.YOtrj2XZtZYHfdl7iDt/3xDzTX0HC/RuG', 'player', '霹雳舞选手32', '13900000032', 'bboy32@example.com', '2025-04-20 07:24:40', '2025-04-20 07:24:40');
INSERT INTO `users` VALUES (566, 'tournament_judge_140054', '$2a$10$O.uXRWsIl2LLsWbHGnrayO6UTofcbWAkrlL.GF8axnutKosHJisei', 'judge', '霹雳舞评委', NULL, 'tournament_judge_140054@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (567, 'tournament_player1', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手1', '13900000001', 'tournament_player1@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (568, 'tournament_player2', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手2', '13900000002', 'tournament_player2@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (569, 'tournament_player3', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手3', '13900000003', 'tournament_player3@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (570, 'tournament_player4', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手4', '13900000004', 'tournament_player4@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (571, 'tournament_player5', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手5', '13900000005', 'tournament_player5@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (572, 'tournament_player6', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手6', '13900000006', 'tournament_player6@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (573, 'tournament_player7', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手7', '13900000007', 'tournament_player7@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (574, 'tournament_player8', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手8', '13900000008', 'tournament_player8@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (575, 'tournament_player9', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手9', '13900000009', 'tournament_player9@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (576, 'tournament_player10', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手10', '13900000010', 'tournament_player10@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (577, 'tournament_player11', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手11', '13900000011', 'tournament_player11@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (578, 'tournament_player12', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手12', '13900000012', 'tournament_player12@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (579, 'tournament_player13', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手13', '13900000013', 'tournament_player13@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (580, 'tournament_player14', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手14', '13900000014', 'tournament_player14@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (581, 'tournament_player15', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手15', '13900000015', 'tournament_player15@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (582, 'tournament_player16', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手16', '13900000016', 'tournament_player16@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (583, 'tournament_player17', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手17', '13900000017', 'tournament_player17@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (584, 'tournament_player18', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手18', '13900000018', 'tournament_player18@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (585, 'tournament_player19', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手19', '13900000019', 'tournament_player19@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (586, 'tournament_player20', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手20', '13900000020', 'tournament_player20@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (587, 'tournament_player21', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手21', '13900000021', 'tournament_player21@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (588, 'tournament_player22', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手22', '13900000022', 'tournament_player22@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (589, 'tournament_player23', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手23', '13900000023', 'tournament_player23@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (590, 'tournament_player24', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手24', '13900000024', 'tournament_player24@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (591, 'tournament_player25', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手25', '13900000025', 'tournament_player25@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (592, 'tournament_player26', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手26', '13900000026', 'tournament_player26@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (593, 'tournament_player27', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手27', '13900000027', 'tournament_player27@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (594, 'tournament_player28', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手28', '13900000028', 'tournament_player28@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (595, 'tournament_player29', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手29', '13900000029', 'tournament_player29@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (596, 'tournament_player30', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手30', '13900000030', 'tournament_player30@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (597, 'tournament_player31', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手31', '13900000031', 'tournament_player31@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (598, 'tournament_player32', '$2a$10$TGFLTli/LMebPDPu0jb9feZKpwUyhItO854T9LGtkNBuMr9qVTMPi', 'player', '霹雳舞选手32', '13900000032', 'tournament_player32@example.com', '2025-04-20 07:29:00', '2025-04-20 07:29:00');
INSERT INTO `users` VALUES (599, 'tournament_judge_274491', '$2a$10$STK5x2adLl2gMwTabZCyXu6HwzKflQ9PAAKyti2POSpme20/oam0u', 'judge', '霹雳舞评委', NULL, 'tournament_judge_274491@example.com', '2025-04-20 07:31:14', '2025-04-20 07:31:14');
INSERT INTO `users` VALUES (600, 'judge_34386708', '$2a$10$oqP.aucaP8/pH4X79rwmZOCna991Lebg5PLnIR49WZMqfvUnM4S4O', 'judge', '霹雳舞评委', NULL, 'judge_34386708@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (601, 'player_34386708_1', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手1', '13900000001', 'player_34386708_1@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (602, 'player_34386708_2', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手2', '13900000002', 'player_34386708_2@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (603, 'player_34386708_3', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手3', '13900000003', 'player_34386708_3@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (604, 'player_34386708_4', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手4', '13900000004', 'player_34386708_4@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (605, 'player_34386708_5', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手5', '13900000005', 'player_34386708_5@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (606, 'player_34386708_6', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手6', '13900000006', 'player_34386708_6@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (607, 'player_34386708_7', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手7', '13900000007', 'player_34386708_7@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (608, 'player_34386708_8', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手8', '13900000008', 'player_34386708_8@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (609, 'player_34386708_9', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手9', '13900000009', 'player_34386708_9@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (610, 'player_34386708_10', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手10', '13900000010', 'player_34386708_10@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (611, 'player_34386708_11', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手11', '13900000011', 'player_34386708_11@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (612, 'player_34386708_12', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手12', '13900000012', 'player_34386708_12@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (613, 'player_34386708_13', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手13', '13900000013', 'player_34386708_13@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (614, 'player_34386708_14', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手14', '13900000014', 'player_34386708_14@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (615, 'player_34386708_15', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手15', '13900000015', 'player_34386708_15@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (616, 'player_34386708_16', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手16', '13900000016', 'player_34386708_16@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (617, 'player_34386708_17', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手17', '13900000017', 'player_34386708_17@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (618, 'player_34386708_18', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手18', '13900000018', 'player_34386708_18@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (619, 'player_34386708_19', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手19', '13900000019', 'player_34386708_19@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (620, 'player_34386708_20', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手20', '13900000020', 'player_34386708_20@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (621, 'player_34386708_21', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手21', '13900000021', 'player_34386708_21@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (622, 'player_34386708_22', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手22', '13900000022', 'player_34386708_22@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (623, 'player_34386708_23', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手23', '13900000023', 'player_34386708_23@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (624, 'player_34386708_24', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手24', '13900000024', 'player_34386708_24@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (625, 'player_34386708_25', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手25', '13900000025', 'player_34386708_25@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (626, 'player_34386708_26', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手26', '13900000026', 'player_34386708_26@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (627, 'player_34386708_27', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手27', '13900000027', 'player_34386708_27@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (628, 'player_34386708_28', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手28', '13900000028', 'player_34386708_28@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (629, 'player_34386708_29', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手29', '13900000029', 'player_34386708_29@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (630, 'player_34386708_30', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手30', '13900000030', 'player_34386708_30@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (631, 'player_34386708_31', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手31', '13900000031', 'player_34386708_31@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (632, 'player_34386708_32', '$2a$10$a4GS8QSpGUthTPbh0jL8h.hjjoLIrscx63WZ1pLOpYR4o6aJZWUHa', 'player', '霹雳舞选手32', '13900000032', 'player_34386708_32@example.com', '2025-04-20 07:33:06', '2025-04-20 07:33:06');
INSERT INTO `users` VALUES (633, 'judge_34489526', '$2a$10$SqVea4IQqRVVLQQnCN5mW.2pqJgTXP3srsiDYdfeqB9PBiTZyZ5Yq', 'judge', '霹雳舞评委', NULL, 'judge_34489526@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (634, 'player_34489526_1', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手1', '13900000001', 'player_34489526_1@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (635, 'player_34489526_2', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手2', '13900000002', 'player_34489526_2@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (636, 'player_34489526_3', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手3', '13900000003', 'player_34489526_3@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (637, 'player_34489526_4', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手4', '13900000004', 'player_34489526_4@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (638, 'player_34489526_5', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手5', '13900000005', 'player_34489526_5@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (639, 'player_34489526_6', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手6', '13900000006', 'player_34489526_6@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (640, 'player_34489526_7', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手7', '13900000007', 'player_34489526_7@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (641, 'player_34489526_8', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手8', '13900000008', 'player_34489526_8@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (642, 'player_34489526_9', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手9', '13900000009', 'player_34489526_9@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (643, 'player_34489526_10', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手10', '13900000010', 'player_34489526_10@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (644, 'player_34489526_11', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手11', '13900000011', 'player_34489526_11@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (645, 'player_34489526_12', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手12', '13900000012', 'player_34489526_12@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (646, 'player_34489526_13', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手13', '13900000013', 'player_34489526_13@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (647, 'player_34489526_14', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手14', '13900000014', 'player_34489526_14@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (648, 'player_34489526_15', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手15', '13900000015', 'player_34489526_15@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (649, 'player_34489526_16', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手16', '13900000016', 'player_34489526_16@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (650, 'player_34489526_17', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手17', '13900000017', 'player_34489526_17@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (651, 'player_34489526_18', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手18', '13900000018', 'player_34489526_18@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (652, 'player_34489526_19', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手19', '13900000019', 'player_34489526_19@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (653, 'player_34489526_20', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手20', '13900000020', 'player_34489526_20@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (654, 'player_34489526_21', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手21', '13900000021', 'player_34489526_21@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (655, 'player_34489526_22', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手22', '13900000022', 'player_34489526_22@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (656, 'player_34489526_23', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手23', '13900000023', 'player_34489526_23@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (657, 'player_34489526_24', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手24', '13900000024', 'player_34489526_24@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (658, 'player_34489526_25', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手25', '13900000025', 'player_34489526_25@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (659, 'player_34489526_26', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手26', '13900000026', 'player_34489526_26@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (660, 'player_34489526_27', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手27', '13900000027', 'player_34489526_27@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (661, 'player_34489526_28', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手28', '13900000028', 'player_34489526_28@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (662, 'player_34489526_29', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手29', '13900000029', 'player_34489526_29@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (663, 'player_34489526_30', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手30', '13900000030', 'player_34489526_30@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (664, 'player_34489526_31', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手31', '13900000031', 'player_34489526_31@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');
INSERT INTO `users` VALUES (665, 'player_34489526_32', '$2a$10$G5Hn15IMza6ohCd/81fkEu.ifQiVvh604KPDYb7FpH4gOrvuSPL5W', 'player', '霹雳舞选手32', '13900000032', 'player_34489526_32@example.com', '2025-04-20 07:34:49', '2025-04-20 07:34:49');

SET FOREIGN_KEY_CHECKS = 1;
