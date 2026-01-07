import { 
  type User, 
  type InsertUser,
  type UserProgress,
  type InsertUserProgress,
  type Bookmark,
  type InsertBookmark,
  type DhikrCounter,
  type InsertDhikrCounter,
  type QuizAttempt,
  type InsertQuizAttempt,
  users,
  userProgress,
  bookmarks,
  dhikrCounters,
  quizAttempts
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Progress methods
  getUserProgress(userId: string, module?: string): Promise<UserProgress[]>;
  getProgressByItem(userId: string, module: string, itemId: string): Promise<UserProgress | undefined>;
  createProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined>;
  
  // Bookmark methods
  getUserBookmarks(userId: string, type?: string): Promise<Bookmark[]>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(id: string): Promise<boolean>;
  
  // Dhikr counter methods
  getDhikrCounter(userId: string, dhikrId: string, date: string, session: string): Promise<DhikrCounter | undefined>;
  createDhikrCounter(counter: InsertDhikrCounter): Promise<DhikrCounter>;
  updateDhikrCounter(id: string, updates: Partial<DhikrCounter>): Promise<DhikrCounter | undefined>;
  getDhikrCountersForDate(userId: string, date: string): Promise<DhikrCounter[]>;
  
  // Quiz methods
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  getUserQuizAttempts(userId: string, category?: string): Promise<QuizAttempt[]>;
  getQuizStats(userId: string): Promise<{ category: string; bestScore: number; attempts: number }[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private userProgress: Map<string, UserProgress>;
  private bookmarks: Map<string, Bookmark>;
  private dhikrCounters: Map<string, DhikrCounter>;
  private quizAttempts: Map<string, QuizAttempt>;
  private currentIds: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.userProgress = new Map();
    this.bookmarks = new Map();
    this.dhikrCounters = new Map();
    this.quizAttempts = new Map();
    this.currentIds = {
      users: 1,
      userProgress: 1,
      bookmarks: 1,
      dhikrCounters: 1,
      quizAttempts: 1
    };
    this.initializeDefaultUser();
  }

  private initializeDefaultUser() {
    const user: User = {
      id: "default-user",
      username: "user",
      email: "user@example.com",
      streak: 7,
      dailyProgress: 3,
      lastActive: new Date(),
      preferences: { theme: "light", language: "id" }
    };
    this.users.set(user.id, user);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = (this.currentIds.users++).toString();
    const user: User = { 
      ...insertUser, 
      id, 
      streak: insertUser.streak ?? 0,
      dailyProgress: insertUser.dailyProgress ?? 0,
      lastActive: new Date(),
      preferences: insertUser.preferences || {} 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updates, lastActive: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Progress methods
  async getUserProgress(userId: string, module?: string): Promise<UserProgress[]> {
    const all = Array.from(this.userProgress.values()).filter(p => p.userId === userId);
    if (module) return all.filter(p => p.module === module);
    return all;
  }

  async getProgressByItem(userId: string, module: string, itemId: string): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(
      p => p.userId === userId && p.module === module && p.itemId === itemId
    );
  }

  async createProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const id = (this.currentIds.userProgress++).toString();
    const created: UserProgress = { 
      ...progress, 
      id, 
      progress: progress.progress ?? 0,
      completed: progress.completed ?? false,
      score: progress.score ?? 0,
      timeSpent: progress.timeSpent ?? 0,
      lastAccessed: new Date() 
    };
    this.userProgress.set(id, created);
    return created;
  }

  async updateProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const existing = this.userProgress.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, lastAccessed: new Date() };
    this.userProgress.set(id, updated);
    return updated;
  }

  // Bookmark methods
  async getUserBookmarks(userId: string, type?: string): Promise<Bookmark[]> {
    const all = Array.from(this.bookmarks.values()).filter(b => b.userId === userId);
    if (type) return all.filter(b => b.type === type);
    return all.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createBookmark(bookmark: InsertBookmark): Promise<Bookmark> {
    const id = (this.currentIds.bookmarks++).toString();
    const created: Bookmark = { 
      ...bookmark, 
      id, 
      note: bookmark.note ?? null,
      createdAt: new Date() 
    };
    this.bookmarks.set(id, created);
    return created;
  }

  async deleteBookmark(id: string): Promise<boolean> {
    return this.bookmarks.delete(id);
  }

  // Dhikr counter methods
  async getDhikrCounter(userId: string, dhikrId: string, date: string, session: string): Promise<DhikrCounter | undefined> {
    return Array.from(this.dhikrCounters.values()).find(
      c => c.userId === userId && c.dhikrId === dhikrId && c.date === date && c.session === session
    );
  }

  async createDhikrCounter(counter: InsertDhikrCounter): Promise<DhikrCounter> {
    const id = (this.currentIds.dhikrCounters++).toString();
    const created: DhikrCounter = { 
      ...counter, 
      id,
      count: counter.count ?? 0,
      target: counter.target ?? 33,
      completed: counter.completed ?? false
    };
    this.dhikrCounters.set(id, created);
    return created;
  }

  async updateDhikrCounter(id: string, updates: Partial<DhikrCounter>): Promise<DhikrCounter | undefined> {
    const existing = this.dhikrCounters.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.dhikrCounters.set(id, updated);
    return updated;
  }

  async getDhikrCountersForDate(userId: string, date: string): Promise<DhikrCounter[]> {
    return Array.from(this.dhikrCounters.values()).filter(c => c.userId === userId && c.date === date);
  }

  // Quiz methods
  async createQuizAttempt(insertAttempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const id = (this.currentIds.quizAttempts++).toString();
    const attempt: QuizAttempt = { 
      ...insertAttempt, 
      id, 
      completedAt: new Date() 
    };
    this.quizAttempts.set(id, attempt);
    return attempt;
  }

  async getUserQuizAttempts(userId: string, category?: string): Promise<QuizAttempt[]> {
    const all = Array.from(this.quizAttempts.values()).filter(a => a.userId === userId);
    if (category) return all.filter(a => a.category === category);
    return all.sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0));
  }

  async getQuizStats(userId: string): Promise<{ category: string; bestScore: number; attempts: number }[]> {
    const attempts = await this.getUserQuizAttempts(userId);
    const stats = new Map<string, { bestScore: number; attempts: number }>();
    
    attempts.forEach(attempt => {
      const existing = stats.get(attempt.category) || { bestScore: 0, attempts: 0 };
      stats.set(attempt.category, {
        bestScore: Math.max(existing.bestScore, attempt.score),
        attempts: existing.attempts + 1
      });
    });
    
    return Array.from(stats.entries()).map(([category, data]) => ({
      category,
      ...data
    }));
  }
}

export const storage = new MemStorage();