import { Router } from "express";
import { Response } from "express";
import { prisma } from "../../config/database";
import { authenticate } from "../../middleware/auth.middleware";
import { requireSuperAdmin } from "../../middleware/role.middleware";
import { sendSuccess, sendError } from "../../utils/response";
import { AuthRequest } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      where:   { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
      take:    50,
    });
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    sendSuccess(res, { notifications, unreadCount });
  } catch (err: any) { sendError(res, err.message); }
});

router.patch("/:id/read", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user!.userId },
      data:  { isRead: true },
    });
    sendSuccess(res, null, "Marked as read");
  } catch (err: any) { sendError(res, err.message); }
});

router.patch("/read-all", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.userId, isRead: false },
      data:  { isRead: true },
    });
    sendSuccess(res, null, "All marked as read");
  } catch (err: any) { sendError(res, err.message); }
});

router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.notification.deleteMany({ where: { id: req.params.id, userId: req.user!.userId } });
    sendSuccess(res, null, "Notification deleted");
  } catch (err: any) { sendError(res, err.message); }
});

// Super admin — broadcast to all users of a role
router.post("/broadcast", authenticate, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { title, message, targetRole } = req.body;
    const users = await prisma.user.findMany({
      where: targetRole ? { role: targetRole } : {},
      select: { id: true },
    });
    await prisma.notification.createMany({
      data: users.map((u) => ({ userId: u.id, type: "system", title, message })),
    });
    sendSuccess(res, { sent: users.length }, `Notification sent to ${users.length} users`);
  } catch (err: any) { sendError(res, err.message); }
});

export default router;
