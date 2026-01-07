import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserProgressSchema, insertBookmarkSchema, insertDhikrCounterSchema, insertQuizAttemptSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const DEFAULT_USER_ID = "default-user";

  // User routes
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(DEFAULT_USER_ID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.patch("/api/user", async (req, res) => {
    try {
      const updatedUser = await storage.updateUser(DEFAULT_USER_ID, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Progress routes
  app.get("/api/progress", async (req, res) => {
    try {
      const { module } = req.query;
      const progress = await storage.getUserProgress(DEFAULT_USER_ID, module as string);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get progress" });
    }
  });

  app.get("/api/progress/:module/:itemId", async (req, res) => {
    try {
      const { module, itemId } = req.params;
      const progress = await storage.getProgressByItem(DEFAULT_USER_ID, module, itemId);
      res.json(progress || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to get progress item" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const validatedData = insertUserProgressSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID
      });
      
      // Check if progress already exists
      const existing = await storage.getProgressByItem(
        DEFAULT_USER_ID,
        validatedData.module,
        validatedData.itemId
      );
      
      if (existing) {
        const updated = await storage.updateProgress(existing.id, validatedData);
        res.json(updated);
      } else {
        const progress = await storage.createProgress(validatedData);
        res.json(progress);
      }
    } catch (error) {
      res.status(400).json({ message: "Failed to create/update progress" });
    }
  });

  // Bookmark routes
  app.get("/api/bookmarks", async (req, res) => {
    try {
      const { type } = req.query;
      const bookmarks = await storage.getUserBookmarks(DEFAULT_USER_ID, type as string);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bookmarks" });
    }
  });

  app.post("/api/bookmarks", async (req, res) => {
    try {
      const validatedData = insertBookmarkSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID
      });
      const bookmark = await storage.createBookmark(validatedData);
      res.json(bookmark);
    } catch (error) {
      res.status(400).json({ message: "Failed to create bookmark" });
    }
  });

  app.delete("/api/bookmarks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteBookmark(id);
      if (!deleted) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete bookmark" });
    }
  });

  // Dhikr counter routes
  app.get("/api/dhikr/counters", async (req, res) => {
    try {
      const { date } = req.query;
      const today = date as string || new Date().toISOString().split('T')[0];
      const counters = await storage.getDhikrCountersForDate(DEFAULT_USER_ID, today);
      res.json(counters);
    } catch (error) {
      res.status(500).json({ message: "Failed to get dhikr counters" });
    }
  });

  app.post("/api/dhikr/counters", async (req, res) => {
    try {
      const validatedData = insertDhikrCounterSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID
      });
      
      // Check if counter already exists for this dhikr/date/session
      const existing = await storage.getDhikrCounter(
        DEFAULT_USER_ID,
        validatedData.dhikrId,
        validatedData.date,
        validatedData.session
      );
      
      if (existing) {
        const updated = await storage.updateDhikrCounter(existing.id, {
          count: validatedData.count ?? 0,
          completed: (validatedData.count ?? 0) >= (validatedData.target ?? 33)
        });
        res.json(updated);
      } else {
        const counter = await storage.createDhikrCounter(validatedData);
        res.json(counter);
      }
    } catch (error) {
      res.status(400).json({ message: "Failed to create/update dhikr counter" });
    }
  });

  // Quiz routes
  app.get("/api/quiz/attempts", async (req, res) => {
    try {
      const { category } = req.query;
      const attempts = await storage.getUserQuizAttempts(DEFAULT_USER_ID, category as string);
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get quiz attempts" });
    }
  });

  app.post("/api/quiz/attempts", async (req, res) => {
    try {
      const validatedData = insertQuizAttemptSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID
      });
      const attempt = await storage.createQuizAttempt(validatedData);
      res.json(attempt);
    } catch (error) {
      res.status(400).json({ message: "Failed to create quiz attempt" });
    }
  });

  app.get("/api/quiz/stats", async (req, res) => {
    try {
      const stats = await storage.getQuizStats(DEFAULT_USER_ID);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get quiz stats" });
    }
  });

  // Audio proxy to solve CORS issues with Al Quran Cloud CDN
  app.get("/api/audio-proxy", async (req, res) => {
    try {
      const { url } = req.query;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ message: "Audio URL is required" });
      }

      // Validate that it's from the trusted CDN
      if (!url.startsWith('https://cdn.islamic.network/quran/audio')) {
        return res.status(400).json({ message: "Invalid audio URL" });
      }

      // Fetch the audio from the CDN
      const response = await fetch(url);
      
      if (!response.ok) {
        return res.status(response.status).json({ message: "Failed to fetch audio" });
      }

      // Set proper CORS headers and content type
      res.set({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000', // 1 year cache
        'Accept-Ranges': 'bytes'
      });

      // Stream the audio response
      if (response.body) {
        const reader = response.body.getReader();
        const pump = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        };
        await pump();
      } else {
        res.end();
      }
    } catch (error) {
      console.error('Audio proxy error:', error);
      res.status(500).json({ message: "Failed to proxy audio" });
    }
  });

  // Prayer times (mock API for demo)
  app.get("/api/prayer-times", async (req, res) => {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      // Mock prayer times for Jakarta
      const prayerTimes = {
        date: today,
        location: "Jakarta",
        times: {
          fajr: "04:30",
          dhuhr: "12:00",
          asr: "15:15",
          maghrib: "18:30",
          isha: "19:45"
        }
      };
      
      res.json(prayerTimes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get prayer times" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
