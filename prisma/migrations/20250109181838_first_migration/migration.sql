-- CreateTable
CREATE TABLE "Url" (
    "id" TEXT NOT NULL,
    "OrignalUrl" TEXT NOT NULL,
    "ShortCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visits" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);
