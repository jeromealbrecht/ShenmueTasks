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
  return data ? JSON.parse(data as string) : [];
}

export async function setTasks(tasks: any) {
  await redis.set(TASKS_KEY, JSON.stringify(tasks));
}
