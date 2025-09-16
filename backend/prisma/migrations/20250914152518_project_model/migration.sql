-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "homeownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "projectType" TEXT NOT NULL,
    "budgetMin" INTEGER,
    "budgetMax" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_homeownerId_fkey" FOREIGN KEY ("homeownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
