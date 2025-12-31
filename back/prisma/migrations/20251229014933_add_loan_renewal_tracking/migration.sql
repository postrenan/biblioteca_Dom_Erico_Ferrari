-- CreateTable
CREATE TABLE "LoanRenewal" (
    "id" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "renewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoanRenewal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoanRenewal" ADD CONSTRAINT "LoanRenewal_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanRenewal" ADD CONSTRAINT "LoanRenewal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
