'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function logActivity(
  action: string,
  entity: string,
  userEmail: string,
  details?: string
) {
  try {
    await prisma.activityLog.create({
      data: { action, entity, userEmail, details },
    });
  } catch {
    // Ne pas faire échouer l'action principale si le log échoue
  }
}

export async function getRecentActivity(limit = 20) {
  return prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}
