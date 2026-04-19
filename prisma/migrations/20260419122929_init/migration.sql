-- CreateTable
CREATE TABLE "PrayerProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Prayer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "notes" TEXT,
    CONSTRAINT "Prayer_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "PrayerProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "endDate" DATETIME,
    "location" TEXT,
    "lecturer" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrence" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HalachaOverride" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "sunrise" TEXT,
    "sunset" TEXT,
    "candleLighting" TEXT,
    "havdalah" TEXT,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HalachaCache" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "sunrise" TEXT,
    "sunset" TEXT,
    "candleLighting" TEXT,
    "havdalah" TEXT,
    "hebrewDate" TEXT,
    "parasha" TEXT,
    "holiday" TEXT,
    "fetchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "synagogueName" TEXT NOT NULL DEFAULT 'בית הכנסת הספרדי המרכזי היכל אשר ומשה',
    "address" TEXT DEFAULT 'רמת בית שמש ד׳, בית שמש',
    "latitude" REAL NOT NULL DEFAULT 31.7489,
    "longitude" REAL NOT NULL DEFAULT 34.9850,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Jerusalem',
    "donationUrl" TEXT,
    "adminPasscode" TEXT NOT NULL,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "aboutText" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PrayerProfile_type_key" ON "PrayerProfile"("type");

-- CreateIndex
CREATE INDEX "Prayer_profileId_idx" ON "Prayer"("profileId");

-- CreateIndex
CREATE INDEX "Event_date_idx" ON "Event"("date");

-- CreateIndex
CREATE INDEX "Event_type_idx" ON "Event"("type");

-- CreateIndex
CREATE UNIQUE INDEX "HalachaOverride_date_key" ON "HalachaOverride"("date");

-- CreateIndex
CREATE UNIQUE INDEX "HalachaCache_date_key" ON "HalachaCache"("date");
