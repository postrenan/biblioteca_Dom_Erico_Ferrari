-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "availableCopies" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "totalCopies" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "contact1" TEXT,
ADD COLUMN     "contact2" TEXT,
ADD COLUMN     "observation" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
