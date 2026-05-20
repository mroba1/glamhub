import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");

  // Super Admin
  const email = process.env.SUPER_ADMIN_EMAIL || "super@glamhub.ng";
  const pass  = process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin@2024";
  const name  = process.env.SUPER_ADMIN_NAME || "Glam Hub Admin";

  const exists = await prisma.user.findUnique({ where: { email } });
  if (!exists) {
    await prisma.user.create({ data: { name, email, password: await bcrypt.hash(pass, 12), role: "SUPER_ADMIN" } });
    console.log(`✅ Super Admin: ${email}`);
  } else {
    console.log(`⏭  Super Admin exists: ${email}`);
  }

  // Subscription Plans
  const plans = [
    { id: "starter",    name: "Starter",    monthlyPrice: 15000, yearlyPrice: 150000, maxProducts: 20,  maxBookings: 50,    isPopular: false, features: ["Your own website URL", "Up to 20 products", "50 bookings/month", "Basic analytics"] },
    { id: "growth",     name: "Growth",     monthlyPrice: 35000, yearlyPrice: 350000, maxProducts: 100, maxBookings: 200,   isPopular: true,  features: ["Your own website URL", "Up to 100 products", "200 bookings/month", "Advanced analytics", "Custom promotions"] },
    { id: "enterprise", name: "Enterprise", monthlyPrice: 75000, yearlyPrice: 750000, maxProducts: 500, maxBookings: 99999, isPopular: false, features: ["Unlimited products", "Unlimited bookings", "Full analytics", "Dedicated manager", "Priority support"] },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { id: plan.id }, create: plan, update: plan,
    });
  }
  console.log("✅ Subscription plans seeded");

  // Global Categories
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
    const existing = await prisma.category.findFirst({ where: { slug: cat.slug, isGlobal: true } });
    if (!existing) await prisma.category.create({ data: { ...cat, isGlobal: true } });
  }
  console.log("✅ Global categories seeded");

  console.log("\n🎉 Done!\n");
  console.log(`   Login: ${email} / ${pass}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
