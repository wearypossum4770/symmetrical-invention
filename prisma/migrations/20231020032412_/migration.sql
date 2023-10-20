/*
  Warnings:

  - You are about to drop the column `countryId` on the `User` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Country` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "phoneNumber", "updatedAt", "username") SELECT "createdAt", "email", "id", "phoneNumber", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE TABLE "new_Country" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "countryName" TEXT NOT NULL,
    "countryCodeAlpha2" TEXT NOT NULL,
    "countryCodeAlpha3" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Country_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Country" ("countryCodeAlpha2", "countryCodeAlpha3", "countryId", "countryName", "id") SELECT "countryCodeAlpha2", "countryCodeAlpha3", "countryId", "countryName", "id" FROM "Country";
DROP TABLE "Country";
ALTER TABLE "new_Country" RENAME TO "Country";
CREATE UNIQUE INDEX "Country_countryCodeAlpha2_key" ON "Country"("countryCodeAlpha2");
CREATE UNIQUE INDEX "Country_countryCodeAlpha3_key" ON "Country"("countryCodeAlpha3");
CREATE UNIQUE INDEX "Country_countryId_key" ON "Country"("countryId");
CREATE UNIQUE INDEX "Country_userId_key" ON "Country"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
