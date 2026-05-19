import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Super Admin ──────────────────────────────────────────
  const superAdminEmail    = process.env.SUPER_ADMIN_EMAIL    ?? "super@glamhub.ng";
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD ?? "SuperAdmin@2024";
  const superAdminName     = process.env.SUPER_ADMIN_NAME     ?? "Glam Hub Admin";

  const existingSA = await prisma.user.findUnique({ where: { email: superAdminEmail } });
  if (!existingSA) {
    await prisma.user.create({
      data: {
        name:     superAdminName,
        email:    superAdminEmail,
        password: await bcrypt.hash(superAdminPassword, 12),
        role:     "SUPER_ADMIN",
      },
    });
    console.log(`✅ Super Admin created: ${superAdminEmail}`);
  } else {
    console.log(`⏭  Super Admin already exists: ${superAdminEmail}`);
  }

  // ── Subscription Plans ───────────────────────────────────
  const plans = [
    { name: "Starter",    description: "Perfect for small salons",          monthlyPrice: 15000, yearlyPrice: 150000, maxProducts: 20,  maxBookings: 50,    features: ["Up to 20 products","50 bookings/month","Basic analytics","Customer management","Email notifications"], isPopular: false },
    { name: "Growth",     description: "For growing salons",                monthlyPrice: 35000, yearlyPrice: 350000, maxProducts: 100, maxBookings: 200,   features: ["Up to 100 products","200 bookings/month","Advanced analytics","Customer management","Priority notifications","Custom promotions","Multiple staff accounts"], isPopular: true },
    { name: "Enterprise", description: "For large salons and multi-branch", monthlyPrice: 75000, yearlyPrice: 750000, maxProducts: 500, maxBookings: 99999, features: ["Unlimited products","Unlimited bookings","Full analytics","Dedicated account manager","API access","Custom branding","Multi-location support","Priority support"], isPopular: false },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where:  { id: plan.name.toLowerCase() },
      create: { id: plan.name.toLowerCase(), ...plan },
      update: plan,
    });
  }
  console.log("✅ Subscription plans seeded");

  // ── Global Categories ────────────────────────────────────
  const categories = [
    { name: "Hair Care",  slug: "hair-care"  },
    { name: "Skin Care",  slug: "skin-care"  },
    { name: "Nail Care",  slug: "nail-care"  },
    { name: "Makeup",     slug: "makeup"     },
    { name: "Fragrance",  slug: "fragrance"  },
    { name: "Body Care",  slug: "body-care"  },
    { name: "Lashes",     slug: "lashes"     },
    { name: "Wellness",   slug: "wellness"   },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where:  { slug_companyId: { slug: cat.slug, companyId: null as any } },
      create: { ...cat, isGlobal: true },
      update: {},
    }).catch(() => {});
  }
  console.log("✅ Global categories seeded");

  console.log("\n🎉 Seed complete!\n");
  console.log(`   Super Admin Login:`);
  console.log(`   Email:    ${superAdminEmail}`);
  console.log(`   Password: ${superAdminPassword}`);
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
