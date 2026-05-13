import { Phase as PrismaPhase } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Phase, phaseNameMap } from "@/app/common/PhaseEnum";
import { prisma } from "@/lib/prisma";

const prismaPhaseNameMap: Record<PrismaPhase, string> = {
  [PrismaPhase.REQUIREMENTS_DEFINITION]:
    phaseNameMap[Phase.REQUIREMENTS_DEFINITION],
  [PrismaPhase.DESIGN]: phaseNameMap[Phase.DESIGN],
  [PrismaPhase.DEVELOPMENT]: phaseNameMap[Phase.DEVELOPMENT],
  [PrismaPhase.UNIT_TEST_DOCUMENT_CREATION]:
    phaseNameMap[Phase.UNIT_TEST_DOCUMENT_CREATION],
  [PrismaPhase.UNIT_TEST]: phaseNameMap[Phase.UNIT_TEST],
  [PrismaPhase.INTEGRATION_TEST_INTERNAL_DOCUMENT_CREATION]:
    phaseNameMap[Phase.INTEGRATION_TEST_INTERNAL_DOCUMENT_CREATION],
  [PrismaPhase.INTEGRATION_TEST_INTERNAL]:
    phaseNameMap[Phase.INTEGRATION_TEST_INTERNAL],
  [PrismaPhase.INTEGRATION_TEST_EXTERNAL_DOCUMENT_CREATION]:
    phaseNameMap[Phase.INTEGRATION_TEST_EXTERNAL_DOCUMENT_CREATION],
  [PrismaPhase.INTEGRATION_TEST_EXTERNAL]:
    phaseNameMap[Phase.INTEGRATION_TEST_EXTERNAL],
  [PrismaPhase.PERFORMANCE_TEST_DOCUMENT_CREATION]:
    phaseNameMap[Phase.PERFORMANCE_TEST_DOCUMENT_CREATION],
  [PrismaPhase.PERFORMANCE_TEST]: phaseNameMap[Phase.PERFORMANCE_TEST],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scheduleStateId = searchParams.get("scheduleStateId") ?? searchParams.get("id");

  if (!scheduleStateId) {
    return NextResponse.json(
      { error: "scheduleStateId is required." },
      { status: 400 },
    );
  }

  try {
    const assignedTasks = await prisma.assignedTask.findMany({
      where: {
        scheduleStateId,
      },
      include: {
        ticket: {
          select: {
            title: true,
          },
        },
        member: {
          select: {
            id: true,
            name: true,
          },
        },
        task: {
          select: {
            duration: true,
            phase: true,
          },
        },
      },
      orderBy: {
        startDay: "asc",
      },
    });

    return NextResponse.json(
      assignedTasks.map(({ ticket, member, task, ...assignedTask }) => ({
        startDay: assignedTask.startDay.toISOString(),
        endDay: assignedTask.endDay.toISOString(),
        ticketTitle: ticket.title,
        memberName: member.name,
        taskDuration: task.duration,
        phase: prismaPhaseNameMap[task.phase],
      })),
    );
  } catch (error) {
    console.error("Failed to get assigned tasks.", error);

    return NextResponse.json(
      { error: "Failed to get assigned tasks." },
      { status: 500 },
    );
  }
}
