import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashSync } from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg(connectionString) });

const PASSWORD = "senai-zeiss";

const LAB_USERS = [
  { email: "matheus@laboratorio.local", name: "Matheus", role: "ADMIN" as const },
  { email: "sebastiao@laboratorio.local", name: "Sebastião", role: "VALIDADOR" as const },
  { email: "joao@laboratorio.local", name: "João", role: "TECNICO" as const },
  { email: "consulta@laboratorio.local", name: "Estagiário", role: "CONSULTA" as const },
  { email: "admin@laboratorio.local", name: "Administrador", role: "ADMIN" as const },
];

async function main() {
  const passwordHash = hashSync(PASSWORD, 10);

  for (const user of LAB_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        active: true,
        mustChangePassword: false,
        passwordHash,
      },
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        active: true,
        mustChangePassword: false,
        passwordHash,
      },
    });
  }
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
