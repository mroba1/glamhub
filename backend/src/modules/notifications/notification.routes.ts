import { Router, Response } from "express";
import { prisma } from "../../config/db";
import { ok, fail } from "../../utils";
import { authenticate, isSuperAdmin, Req } from "../../middleware/auth";

const router = Router();

router.get("/", authenticate, async (req: Req, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({ where: { userId: req.user!.userId }, orderBy: { createdAt: "desc" }, take: 50 });
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    ok(res, { notifications, unreadCount });
  } catch (e: any) { fail(res, e.message); }
});

router.patch("/:id/read", authenticate, async (req: Req, res: Response) => {
  try {
    await prisma.notification.updateMany({ where: { id: req.params.id, userId: req.user!.userId }, data: { isRead: true } });
    ok(res, null, "Marked as read");
  } catch (e: any) { fail(res, e.message); }
});

router.patch("/read-all", authenticate, async (req: Req, res: Response) => {
  try {
    await prisma.notification.updateMany({ where: { userId: req.user!.userId, isRead: false }, data: { isRead: true } });
    ok(res, null, "All marked as read");
  } catch (e: any) { fail(res, e.message); }
});

router.delete("/:id", authenticate, async (req: Req, res: Response) => {
  try {
    await prisma.notification.deleteMany({ where: { id: req.params.id, userId: req.user!.userId } });
    ok(res, null, "Deleted");
  } catch (e: any) { fail(res, e.message); }
});

router.post("/broadcast", authenticate, isSuperAdmin, async (req: Req, res: Response) => {
  try {
    const { title, message, targetRole } = req.body;
    const users = await prisma.user.findMany({ where: targetRole ? { role: targetRole } : {}, select: { id: true } });
    await prisma.notification.createMany({ data: users.map((u) => ({ userId: u.id, type: "system", title, message })) });
    ok(res, { sent: users.length }, `Sent to ${users.length} users`);
  } catch (e: any) { fail(res, e.message); }
});

export default router;
