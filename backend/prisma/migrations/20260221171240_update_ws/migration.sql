-- AlterEnum
ALTER TYPE "public"."PostType" ADD VALUE 'VEHICLE';

-- DropIndex
DROP INDEX "public"."PostAuditLog_postId_idx";

-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "buyUrl" TEXT,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "gearbox" TEXT,
ADD COLUMN     "inspectionPassed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "km" INTEGER,
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "vin" TEXT,
ADD COLUMN     "year" INTEGER;

-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "city" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "images" JSONB,
ADD COLUMN     "materialsNeeded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "streetAddress" TEXT,
ADD COLUMN     "transportNeeded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "videoUrl" TEXT;

-- CreateTable
CREATE TABLE "public"."ChatRoom" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Assignment" (
    "id" TEXT NOT NULL,
    "homeownerId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderRole" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_homeownerId_key" ON "public"."Assignment"("homeownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_roomId_key" ON "public"."Assignment"("roomId");

-- CreateIndex
CREATE INDEX "Assignment_companyId_idx" ON "public"."Assignment"("companyId");

-- CreateIndex
CREATE INDEX "Message_roomId_idx" ON "public"."Message"("roomId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "public"."Message"("senderId");

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_homeownerId_fkey" FOREIGN KEY ("homeownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
