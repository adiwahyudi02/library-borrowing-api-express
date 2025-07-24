/*
  Warnings:

  - Added the required column `guardId` to the `borrowings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `borrowings` ADD COLUMN `guardId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `borrowings` ADD CONSTRAINT `borrowings_guardId_fkey` FOREIGN KEY (`guardId`) REFERENCES `guards`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
