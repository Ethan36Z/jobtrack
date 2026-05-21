-- CreateTable
CREATE TABLE `CompanyResearch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `applicationId` INTEGER NOT NULL,
    `companyWebsite` VARCHAR(191) NULL,
    `companySize` VARCHAR(191) NULL,
    `industry` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `mission` TEXT NULL,
    `products` TEXT NULL,
    `techStack` TEXT NULL,
    `cultureNotes` TEXT NULL,
    `interviewTips` TEXT NULL,
    `redFlags` TEXT NULL,
    `whyInterested` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CompanyResearch_applicationId_key`(`applicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CompanyResearch` ADD CONSTRAINT `CompanyResearch_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
