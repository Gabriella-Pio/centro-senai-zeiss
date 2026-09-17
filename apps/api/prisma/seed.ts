import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashSync } from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg(connectionString) });

const ADMIN_EMAIL = "admin@laboratorio.local";
const ADMIN_PASSWORD = "senai-zeiss";

async function main() {
  const passwordHash = hashSync(ADMIN_PASSWORD, 10);

  await prisma.user.deleteMany({
    where: { email: { not: ADMIN_EMAIL } },
  });

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: "Administrador",
      role: "ADMIN",
      active: true,
      mustChangePassword: false,
      passwordHash,
    },
    create: {
      email: ADMIN_EMAIL,
      name: "Administrador",
      role: "ADMIN",
      active: true,
      mustChangePassword: false,
      passwordHash,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
