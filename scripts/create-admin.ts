import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";

interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}

async function createAdmin() {
  const dataFilePath = path.join(process.cwd(), "data", "users.json");

  let users: User[] = [];

  try {
    const data = await fs.readFile(dataFilePath, "utf-8");
    users = JSON.parse(data);
  } catch (error) {
    console.log("Users file not found, will create new one");
  }

  // Admin credentials - CHANGE THESE!
  const adminEmail = "admin@nuage.fr";
  const adminPassword = "AdminNuage2026!"; // CHANGE THIS AFTER FIRST LOGIN!

  // Check if admin already exists
  const existingAdmin = users.find((u) => u.email === adminEmail);
  if (existingAdmin) {
    console.log("❌ Admin user already exists with email:", adminEmail);

    // Check if they have admin role
    if (!existingAdmin.isAdmin) {
      console.log("⚠️  User exists but is not admin. Updating role...");
      existingAdmin.isAdmin = true;
      existingAdmin.updatedAt = new Date().toISOString();

      // Ensure data directory exists
      const dataDir = path.dirname(dataFilePath);
      try {
        await fs.access(dataDir);
      } catch {
        await fs.mkdir(dataDir, { recursive: true });
      }

      await fs.writeFile(dataFilePath, JSON.stringify(users, null, 2));
      console.log("✅ User updated to admin successfully!");
    }

    return;
  }

  // Hash password
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  // Create admin user
  const adminUser: User = {
    id: crypto.randomUUID(),
    email: adminEmail,
    passwordHash,
    firstName: "Admin",
    lastName: "Nuage",
    isAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(adminUser);

  // Ensure data directory exists
  const dataDir = path.dirname(dataFilePath);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  // Write to file
  await fs.writeFile(dataFilePath, JSON.stringify(users, null, 2));

  console.log("\n✅ Admin user created successfully!");
  console.log("\n📧 Email:", adminEmail);
  console.log("🔑 Password:", adminPassword);
  console.log("\n⚠️  IMPORTANT: Change the password immediately after first login!");
  console.log("\n🔐 You can now access /admin routes with these credentials.\n");
}

createAdmin().catch((error) => {
  console.error("❌ Error creating admin user:", error);
  process.exit(1);
});
