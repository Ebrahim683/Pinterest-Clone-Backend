-- CreateTable
CREATE TABLE "PinPostModel" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "PinPostModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PinPostModel" ADD CONSTRAINT "PinPostModel_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinPostModel" ADD CONSTRAINT "PinPostModel_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
