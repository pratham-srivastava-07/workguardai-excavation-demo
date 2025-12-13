/*
  Warnings:

  - The values [CONTRACTOR] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."PostType" AS ENUM ('MATERIAL', 'SERVICE', 'SPACE');

-- CreateEnum
CREATE TYPE "public"."PostStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD', 'DELETED');

-- CreateEnum
CREATE TYPE "public"."OfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."Role_new" AS ENUM ('HOMEOWNER', 'COMPANY', 'CITY');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."User" ALTER COLUMN "role" TYPE "public"."Role_new" USING ("role"::text::"public"."Role_new");
ALTER TYPE "public"."Role" RENAME TO "Role_old";
ALTER TYPE "public"."Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "public"."User" ALTER COLUMN "role" SET DEFAULT 'HOMEOWNER';
COMMIT;

-- CreateTable
CREATE TABLE "public"."CompanyProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CityProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cityName" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CityProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Post" (
    "id" TEXT NOT NULL,
    "type" "public"."PostType" NOT NULL,
    "status" "public"."PostStatus" NOT NULL DEFAULT 'AVAILABLE',
    "userId" TEXT NOT NULL,
    "companyId" TEXT,
    "cityId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "images" JSONB,
    "subtype" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION,
    "unit" TEXT,
    "price" INTEGER,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "availabilityDate" TIMESTAMP(3),
    "condition" TEXT,
    "rentalDuration" TEXT,
    "hourlyRate" INTEGER,
    "dailyRate" INTEGER,
    "pickupAllowed" BOOLEAN NOT NULL DEFAULT false,
    "transportNeeded" BOOLEAN NOT NULL DEFAULT false,
    "canCompanyCollect" BOOLEAN NOT NULL DEFAULT false,
    "permitForReuse" BOOLEAN NOT NULL DEFAULT false,
    "hazardousMaterials" BOOLEAN NOT NULL DEFAULT false,
    "structuralItems" BOOLEAN NOT NULL DEFAULT false,
    "socialLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Offer" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT,
    "amount" INTEGER,
    "message" TEXT,
    "status" "public"."OfferStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PostAuditLog" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "fieldName" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_userId_key" ON "public"."CompanyProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CityProfile_userId_key" ON "public"."CityProfile"("userId");

-- CreateIndex
CREATE INDEX "Post_latitude_longitude_idx" ON "public"."Post"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "Post_type_status_idx" ON "public"."Post"("type", "status");

-- CreateIndex
CREATE INDEX "Post_userId_idx" ON "public"."Post"("userId");

-- CreateIndex
CREATE INDEX "PostAuditLog_postId_idx" ON "public"."PostAuditLog"("postId");

-- CreateIndex
CREATE INDEX "PostAuditLog_userId_idx" ON "public"."PostAuditLog"("userId");

-- AddForeignKey
ALTER TABLE "public"."CompanyProfile" ADD CONSTRAINT "CompanyProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CityProfile" ADD CONSTRAINT "CityProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."CompanyProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."CityProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Offer" ADD CONSTRAINT "Offer_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Offer" ADD CONSTRAINT "Offer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Offer" ADD CONSTRAINT "Offer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."CompanyProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PostAuditLog" ADD CONSTRAINT "PostAuditLog_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
