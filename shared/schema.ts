import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  streak: integer("streak").default(0),
  dailyProgress: integer("daily_progress").default(0),
  lastActive: timestamp("last_active").defaultNow(),
  preferences: jsonb("preferences").default({}),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  module: text("module").notNull(), // 'hijaiyah', 'quran', 'dhikr', 'quiz'
  itemId: text("item_id").notNull(), // letter id, surah id, dhikr id, quiz category
  progress: integer("progress").default(0), // 0-100
  completed: boolean("completed").default(false),
  score: integer("score").default(0),
  timeSpent: integer("time_spent").default(0), // in seconds
  lastAccessed: timestamp("last_accessed").defaultNow(),
});

export const bookmarks = pgTable("bookmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // 'quran', 'dhikr'
  contentId: text("content_id").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dhikrCounters = pgTable("dhikr_counters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  dhikrId: text("dhikr_id").notNull(),
  count: integer("count").default(0),
  target: integer("target").default(33),
  date: text("date").notNull(), // YYYY-MM-DD format
  session: text("session").notNull(), // 'morning' or 'evening'
  completed: boolean("completed").default(false),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  category: text("category").notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  timeSpent: integer("time_spent").notNull(),
  answers: jsonb("answers").notNull(), // array of answer objects
  completedAt: timestamp("completed_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  lastActive: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  lastAccessed: true,
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true,
});

export const insertDhikrCounterSchema = createInsertSchema(dhikrCounters).omit({
  id: true,
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  completedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type DhikrCounter = typeof dhikrCounters.$inferSelect;
export type InsertDhikrCounter = z.infer<typeof insertDhikrCounterSchema>;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
