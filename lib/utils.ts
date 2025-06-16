import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const TASKS_KEY = "shenTasks";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getTasks() {
  const data = await redis.get(TASKS_KEY);
  try {
    if (!data) return [];
    if (typeof data === "string") {
      return JSON.parse(data);
    }
    // Si c'est déjà un objet/array (rare), retourne-le
    return data;
  } catch (e) {
    console.error("Erreur de parsing Upstash:", data, e);
    return [];
  }
}

export async function setTasks(tasks: any) {
  // Toujours stringifier un tableau, jamais un objet seul
  if (!Array.isArray(tasks)) {
    console.warn("setTasks: la donnée n'est pas un tableau, conversion forcée");
    tasks = [tasks];
  }
  await redis.set(TASKS_KEY, JSON.stringify(tasks));
}
