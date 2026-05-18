-- CreateTable
CREATE TABLE "MpesaPayment" (
    "id" TEXT NOT NULL,
    "transId" TEXT NOT NULL,
    "transAmount" TEXT NOT NULL,
    "msisdn" TEXT NOT NULL,
    "billRefNumber" TEXT NOT NULL,
    "transTime" TEXT NOT NULL,
    "firstName" TEXT,
    "middleName" TEXT,
    "lastName" TEXT,
    "rawCallback" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MpesaPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MpesaPayment_transId_key" ON "MpesaPayment"("transId");
