import { pgTable, text, varchar, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const certificates = pgTable("certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  eyeColor: text("eye_color"),
  hairColor: text("hair_color"),
  facialFeatures: jsonb("facial_features").notNull().default('[]'),
  physicalAbilities: jsonb("physical_abilities").notNull().default('[]'),
  faceImagePath: text("face_image_path"),
  rarityPercentage: real("rarity_percentage").notNull(),
  rarityRatio: text("rarity_ratio").notNull(),
  certificateImagePath: text("certificate_image_path"),
  posterImagePath: text("poster_image_path"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCertificateSchema = createInsertSchema(certificates).pick({
  firstName: true,
  lastName: true,
  eyeColor: true,
  hairColor: true,
  facialFeatures: true,
  physicalAbilities: true,
  faceImagePath: true,
  rarityPercentage: true,
  rarityRatio: true,
});

export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Certificate = typeof certificates.$inferSelect;

export const generateCertificateRequestSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  faceImageBase64: z.string().default(""),
  eyeColor: z.enum(["brown", "blue", "green", "hazel"]).optional(),
  hairColor: z.enum(["black", "brown", "blonde", "red"]).optional(),
  facialFeatures: z.array(z.enum([
    "freckles",
    "dimples",
    "cleft_chin",
    "high_cheekbones"
  ])).default([]),
  physicalAbilities: z.array(z.enum([
    "rollTongueWave", // Zunge doppelt wie eine Welle rollen
    "independentEye", // Ein Auge, unabhängig vom anderen bewegen
    "wiggleEarsNoHands", // Ohne Hände mit den Ohren wackeln
    "tongueToElbow", // Den Ellbogen mit der Zunge berühren
    "thumbHypermobility", // Hyperbeweglichkeit - Daumen nach hinten biegen
    "tongueCloverleaf", // Zunge wie ein Kleeblatt formen
    "independentToes", // Zehen unabhängig bewegen
    "tongueToNose" // Nase mit der Zunge berühren
  ])).default([]),
});

export type GenerateCertificateRequest = z.infer<typeof generateCertificateRequestSchema>;
