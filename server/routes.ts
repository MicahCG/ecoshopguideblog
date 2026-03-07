import type { Express } from "express";
import { createServer, type Server } from "http";
import { db, requireDb } from "./db";
import { blogs, newsletterSubscribers } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { Resend } from "resend";

// Initialize Resend for email
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || null;

// Simple in-memory rate limiter for newsletter signups
const newsletterRateLimit = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // max 5 attempts per IP per hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const attempts = newsletterRateLimit.get(ip) || [];
  const recent = attempts.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  newsletterRateLimit.set(ip, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  newsletterRateLimit.set(ip, recent);
  return false;
}

export async function registerRoutes(app: Express): Promise<Server> {

  // Get all blog posts
  app.get("/api/blogs", async (req, res) => {
    try {
      const database = requireDb();
      const allBlogs = await database
        .select()
        .from(blogs)
        .orderBy(desc(blogs.createdAt));

      res.json(allBlogs);
    } catch (error: any) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({ error: 'Failed to fetch blogs', message: error.message });
    }
  });

  // Get single blog post by slug
  app.get("/api/blogs/:slug", async (req, res) => {
    try {
      const database = requireDb();
      const { slug } = req.params;

      const [blog] = await database
        .select()
        .from(blogs)
        .where(eq(blogs.slug, slug))
        .limit(1);

      if (!blog) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      res.json(blog);
    } catch (error: any) {
      console.error('Error fetching blog:', error);
      res.status(500).json({ error: 'Failed to fetch blog', message: error.message });
    }
  });

  // Newsletter subscribe endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      // Rate limiting
      const clientIp = req.ip || req.socket.remoteAddress || "unknown";
      if (isRateLimited(clientIp)) {
        return res.status(429).json({ error: "Too many requests. Please try again later." });
      }

      const database = requireDb();
      const { email, source } = req.body;

      // Validate email
      const trimmedEmail = email?.trim()?.toLowerCase();
      if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        return res.status(400).json({ error: "Please enter a valid email address" });
      }

      // Validate source
      const validSources = ["homepage_section", "exit_intent_popup"];
      if (!source || !validSources.includes(source)) {
        return res.status(400).json({ error: "Invalid source" });
      }

      let emailSent = false;

      // Check if email already exists
      const existing = await database.query.newsletterSubscribers.findFirst({
        where: eq(newsletterSubscribers.email, trimmedEmail),
      });

      if (existing) {
        emailSent = await sendWelcomeEmail(trimmedEmail);
        return res.json({ success: true, emailSent });
      }

      // Save to database
      await database.insert(newsletterSubscribers).values({
        email: trimmedEmail,
        source,
        status: "active",
      });

      // Send welcome email via Resend
      emailSent = await sendWelcomeEmail(trimmedEmail);

      // Add contact to Resend Audience for future campaigns
      if (resend && RESEND_AUDIENCE_ID) {
        try {
          await resend.contacts.create({
            audienceId: RESEND_AUDIENCE_ID,
            email: trimmedEmail,
            firstName: "",
            lastName: "",
            unsubscribed: false,
          });
        } catch (contactError: any) {
          console.error("Failed to add contact to Resend audience:", contactError.message);
        }
      }

      res.json({ success: true, emailSent });
    } catch (error: any) {
      console.error("Newsletter subscribe error:", error);
      res.status(500).json({ error: "Something went wrong. Please try again." });
    }
  });

  // Helper: send welcome email via Resend
  async function sendWelcomeEmail(email: string): Promise<boolean> {
    if (!resend) return false;
    try {
      await resend.emails.send({
        from: "EcoShopGuide <livebambana@gmail.com>",
        to: email,
        subject: "Welcome to EcoShopGuide — sustainable living, simplified",
        html: `
          <div style="font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #2a2520;">
            <h1 style="font-family: 'Georgia', serif; font-size: 28px; margin-bottom: 16px; color: #1a3409;">Welcome to EcoShopGuide</h1>
            <p style="font-size: 16px; line-height: 1.6;">Thanks for joining! We share guides, tips, and ideas for sustainable living — once a week. No spam, just good stuff.</p>
            <a href="https://ecoshopguide.com/blog" style="display: inline-block; background-color: #1a3409; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: 500; margin-top: 16px;">Read the Blog →</a>
            <p style="font-size: 13px; color: #999; margin-top: 32px;">You're receiving this because you signed up at ecoshopguide.com.</p>
          </div>
        `,
      });
      return true;
    } catch (emailError: any) {
      console.error("Failed to send welcome email:", emailError.message);
      return false;
    }
  }

  const httpServer = createServer(app);

  return httpServer;
}
