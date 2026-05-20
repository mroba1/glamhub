import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "../config/env";
import { Request } from "express";

const ensure = (dir: string) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

export const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      const dir = path.join(process.cwd(), env.UPLOAD_DIR);
      ensure(dir);
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      cb(null, `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${path.extname(file.originalname)}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error("Only images allowed"));
  },
  limits: { fileSize: env.MAX_FILE_SIZE },
});

export const fileUrl = (req: Request, filename: string) =>
  `${req.protocol}://${req.get("host")}/uploads/${filename}`;
