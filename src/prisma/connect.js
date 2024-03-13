import { PrismaClient } from "@prisma/client";

const prismaClient = global.prisma || new PrismaClient({ log: ["info"] });
if (process.env.NODE_ENV !== "production") {
  global.prisma = prismaClient;
}

export default prismaClient;
