-- CreateEnum
CREATE TYPE "Phase" AS ENUM ('requirements-definition', 'design', 'development', 'unit-test-document-creation', 'unit-test', 'integration-test-internal-document-creation', 'integration-test-internal', 'integration-test-external-document-creation', 'integration-test-external', 'performance-test-document-creation', 'performance-test');

-- CreateTable
CREATE TABLE "ScheduleState" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Untitled schedule',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduleState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleConfiguration" (
    "id" UUID NOT NULL,
    "scheduleStateId" UUID NOT NULL,
    "firstDate" TIMESTAMP(3) NOT NULL,
    "lastDate" TIMESTAMP(3) NOT NULL,
    "additionalHolidays" TIMESTAMP(3)[],
    "isShowHoliday" BOOLEAN NOT NULL,

    CONSTRAINT "ScheduleConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "dbId" UUID NOT NULL,
    "id" UUID NOT NULL,
    "scheduleStateId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("dbId")
);

-- CreateTable
CREATE TABLE "TicketPhase" (
    "dbId" UUID NOT NULL,
    "scheduleStateId" UUID NOT NULL,
    "ticketId" UUID NOT NULL,
    "phase" "Phase" NOT NULL,
    "duration" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TicketPhase_pkey" PRIMARY KEY ("dbId")
);

-- CreateTable
CREATE TABLE "Task" (
    "dbId" UUID NOT NULL,
    "id" UUID NOT NULL,
    "scheduleStateId" UUID NOT NULL,
    "ticketId" UUID NOT NULL,
    "ticketTitle" TEXT NOT NULL,
    "phase" "Phase" NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("dbId")
);

-- CreateTable
CREATE TABLE "TaskInformation" (
    "dbId" UUID NOT NULL,
    "id" UUID NOT NULL,
    "scheduleStateId" UUID NOT NULL,
    "taskId" UUID NOT NULL,
    "taskName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "groupTaskId" TEXT,

    CONSTRAINT "TaskInformation_pkey" PRIMARY KEY ("dbId")
);

-- CreateTable
CREATE TABLE "TaskDependency" (
    "scheduleStateId" UUID NOT NULL,
    "taskId" UUID NOT NULL,
    "premiseTaskId" UUID NOT NULL,

    CONSTRAINT "TaskDependency_pkey" PRIMARY KEY ("scheduleStateId","taskId","premiseTaskId")
);

-- CreateTable
CREATE TABLE "AssignedTask" (
    "dbId" UUID NOT NULL,
    "id" UUID NOT NULL,
    "scheduleStateId" UUID NOT NULL,
    "ticketId" UUID NOT NULL,
    "taskId" UUID NOT NULL,
    "memberId" UUID NOT NULL,
    "startDay" TIMESTAMP(3) NOT NULL,
    "endDay" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssignedTask_pkey" PRIMARY KEY ("dbId")
);

-- CreateTable
CREATE TABLE "Member" (
    "dbId" UUID NOT NULL,
    "id" UUID NOT NULL,
    "scheduleStateId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "disableDates" TIMESTAMP(3)[],
    "isAvailable" BOOLEAN NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("dbId")
);

-- CreateTable
CREATE TABLE "MileStone" (
    "dbId" UUID NOT NULL,
    "id" UUID NOT NULL,
    "scheduleStateId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "day" TIMESTAMP(3),
    "prePhases" "Phase"[],
    "postPhases" "Phase"[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MileStone_pkey" PRIMARY KEY ("dbId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleConfiguration_scheduleStateId_key" ON "ScheduleConfiguration"("scheduleStateId");

-- CreateIndex
CREATE INDEX "Ticket_scheduleStateId_idx" ON "Ticket"("scheduleStateId");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_scheduleStateId_id_key" ON "Ticket"("scheduleStateId", "id");

-- CreateIndex
CREATE INDEX "TicketPhase_scheduleStateId_ticketId_idx" ON "TicketPhase"("scheduleStateId", "ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "TicketPhase_scheduleStateId_ticketId_phase_key" ON "TicketPhase"("scheduleStateId", "ticketId", "phase");

-- CreateIndex
CREATE INDEX "Task_scheduleStateId_idx" ON "Task"("scheduleStateId");

-- CreateIndex
CREATE INDEX "Task_scheduleStateId_ticketId_idx" ON "Task"("scheduleStateId", "ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "Task_scheduleStateId_id_key" ON "Task"("scheduleStateId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "TaskInformation_scheduleStateId_id_key" ON "TaskInformation"("scheduleStateId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "TaskInformation_scheduleStateId_taskId_key" ON "TaskInformation"("scheduleStateId", "taskId");

-- CreateIndex
CREATE INDEX "TaskDependency_scheduleStateId_premiseTaskId_idx" ON "TaskDependency"("scheduleStateId", "premiseTaskId");

-- CreateIndex
CREATE INDEX "AssignedTask_scheduleStateId_idx" ON "AssignedTask"("scheduleStateId");

-- CreateIndex
CREATE INDEX "AssignedTask_scheduleStateId_ticketId_idx" ON "AssignedTask"("scheduleStateId", "ticketId");

-- CreateIndex
CREATE INDEX "AssignedTask_scheduleStateId_taskId_idx" ON "AssignedTask"("scheduleStateId", "taskId");

-- CreateIndex
CREATE INDEX "AssignedTask_scheduleStateId_memberId_idx" ON "AssignedTask"("scheduleStateId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "AssignedTask_scheduleStateId_id_key" ON "AssignedTask"("scheduleStateId", "id");

-- CreateIndex
CREATE INDEX "Member_scheduleStateId_idx" ON "Member"("scheduleStateId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_scheduleStateId_id_key" ON "Member"("scheduleStateId", "id");

-- CreateIndex
CREATE INDEX "MileStone_scheduleStateId_idx" ON "MileStone"("scheduleStateId");

-- CreateIndex
CREATE UNIQUE INDEX "MileStone_scheduleStateId_id_key" ON "MileStone"("scheduleStateId", "id");

-- AddForeignKey
ALTER TABLE "ScheduleConfiguration" ADD CONSTRAINT "ScheduleConfiguration_scheduleStateId_fkey" FOREIGN KEY ("scheduleStateId") REFERENCES "ScheduleState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_scheduleStateId_fkey" FOREIGN KEY ("scheduleStateId") REFERENCES "ScheduleState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketPhase" ADD CONSTRAINT "TicketPhase_scheduleStateId_ticketId_fkey" FOREIGN KEY ("scheduleStateId", "ticketId") REFERENCES "Ticket"("scheduleStateId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_scheduleStateId_fkey" FOREIGN KEY ("scheduleStateId") REFERENCES "ScheduleState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_scheduleStateId_ticketId_fkey" FOREIGN KEY ("scheduleStateId", "ticketId") REFERENCES "Ticket"("scheduleStateId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskInformation" ADD CONSTRAINT "TaskInformation_scheduleStateId_taskId_fkey" FOREIGN KEY ("scheduleStateId", "taskId") REFERENCES "Task"("scheduleStateId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_scheduleStateId_taskId_fkey" FOREIGN KEY ("scheduleStateId", "taskId") REFERENCES "Task"("scheduleStateId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_scheduleStateId_premiseTaskId_fkey" FOREIGN KEY ("scheduleStateId", "premiseTaskId") REFERENCES "Task"("scheduleStateId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedTask" ADD CONSTRAINT "AssignedTask_scheduleStateId_fkey" FOREIGN KEY ("scheduleStateId") REFERENCES "ScheduleState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedTask" ADD CONSTRAINT "AssignedTask_scheduleStateId_ticketId_fkey" FOREIGN KEY ("scheduleStateId", "ticketId") REFERENCES "Ticket"("scheduleStateId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedTask" ADD CONSTRAINT "AssignedTask_scheduleStateId_taskId_fkey" FOREIGN KEY ("scheduleStateId", "taskId") REFERENCES "Task"("scheduleStateId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedTask" ADD CONSTRAINT "AssignedTask_scheduleStateId_memberId_fkey" FOREIGN KEY ("scheduleStateId", "memberId") REFERENCES "Member"("scheduleStateId", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_scheduleStateId_fkey" FOREIGN KEY ("scheduleStateId") REFERENCES "ScheduleState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MileStone" ADD CONSTRAINT "MileStone_scheduleStateId_fkey" FOREIGN KEY ("scheduleStateId") REFERENCES "ScheduleState"("id") ON DELETE CASCADE ON UPDATE CASCADE;
