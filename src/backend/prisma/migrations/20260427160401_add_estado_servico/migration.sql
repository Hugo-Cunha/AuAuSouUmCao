-- CreateEnum
CREATE TYPE "EstadoServico" AS ENUM ('Feito', 'Pendente', 'Finalizado');

-- AlterTable
ALTER TABLE "Servico" ADD COLUMN     "estado" "EstadoServico" NOT NULL DEFAULT 'Pendente';
