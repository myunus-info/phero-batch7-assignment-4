/*
  Warnings:

  - A unique constraint covering the columns `[phone,email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_email_key" ON "users"("phone", "email");
