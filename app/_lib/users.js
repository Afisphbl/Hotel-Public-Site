import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const USERS_FILE = path.join(process.cwd(), "users.json");

function readUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function createUser({ fullName, email, password }) {
  const users = readUsers();
  if (users.find((u) => u.email === email)) {
    throw new Error("A user with this email already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = {
    id: String(Date.now()),
    fullName,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function verifyCredentials(email, password) {
  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function getUserByEmail(email) {
  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return null;
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
