-- CreateTable
CREATE TABLE `Application` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyName` VARCHAR(191) NOT NULL,
    `jobTitle` VARCHAR(191) NOT NULL,
    `jobUrl` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `status` ENUM('SAVED', 'APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED', 'ARCHIVED') NOT NULL DEFAULT 'SAVED',
    `source` VARCHAR(191) NULL,
    `appliedDate` DATETIME(3) NULL,
    `nextAction` VARCHAR(191) NULL,
    `followUpDate` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Application_status_idx`(`status`),
    INDEX `Application_followUpDate_idx`(`followUpDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
