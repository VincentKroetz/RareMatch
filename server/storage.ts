import { type Certificate, type InsertCertificate } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getCertificate(id: string): Promise<Certificate | undefined>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  updateCertificateImages(id: string, certificatePath: string, posterPath: string): Promise<Certificate | undefined>;
}

export class MemStorage implements IStorage {
  private certificates: Map<string, Certificate>;

  constructor() {
    this.certificates = new Map();
  }

  async getCertificate(id: string): Promise<Certificate | undefined> {
    return this.certificates.get(id);
  }

  async createCertificate(insertCertificate: InsertCertificate): Promise<Certificate> {
    const id = randomUUID();
    const certificate: Certificate = { 
      ...insertCertificate,
      id,
      eyeColor: insertCertificate.eyeColor || null,
      hairColor: insertCertificate.hairColor || null,
      faceImagePath: insertCertificate.faceImagePath || null,
      certificateImagePath: null,
      posterImagePath: null,
      createdAt: new Date()
    };
    this.certificates.set(id, certificate);
    return certificate;
  }

  async updateCertificateImages(id: string, certificatePath: string, posterPath: string): Promise<Certificate | undefined> {
    const certificate = this.certificates.get(id);
    if (!certificate) return undefined;
    
    certificate.certificateImagePath = certificatePath;
    certificate.posterImagePath = posterPath;
    this.certificates.set(id, certificate);
    return certificate;
  }
}

export const storage = new MemStorage();
