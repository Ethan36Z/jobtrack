-- AlterTable
ALTER TABLE `application` ADD COLUMN `resumeVersionId` INTEGER NULL;

-- CreateTable
CREATE TABLE `ResumeVersion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `targetRole` VARCHAR(191) NULL,
    `fileUrl` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Application_resumeVersionId_idx` ON `Application`(`resumeVersionId`);

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_resumeVersionId_fkey` FOREIGN KEY (`resumeVersionId`) REFERENCES `ResumeVersion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
