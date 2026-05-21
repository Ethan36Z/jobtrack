-- CreateTable
CREATE TABLE `InterviewNote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `applicationId` INTEGER NOT NULL,
    `roundName` VARCHAR(191) NULL,
    `interviewDate` DATETIME(3) NULL,
    `interviewer` VARCHAR(191) NULL,
    `format` VARCHAR(191) NULL,
    `summary` TEXT NULL,
    `questions` TEXT NULL,
    `nextSteps` TEXT NULL,
    `result` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `InterviewNote_applicationId_idx`(`applicationId`),
    INDEX `InterviewNote_interviewDate_idx`(`interviewDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InterviewNote` ADD CONSTRAINT `InterviewNote_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
