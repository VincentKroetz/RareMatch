import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateCertificateRequestSchema } from "@shared/schema";
import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Generate certificate endpoint
  app.post("/api/certificates/generate", async (req, res) => {
    try {
      const validatedData = generateCertificateRequestSchema.parse(req.body);
      
      // Calculate rarity percentage
      const rarityPercentage = calculateRarity(validatedData);
      const rarityRatio = `1 in ${Math.round(100 / rarityPercentage).toLocaleString()}`;
      
      // Save uploaded face image
      let faceImagePath = "";
      if (validatedData.faceImageBase64) {
        const outputDir = path.join(process.cwd(), "generated");
        await fs.mkdir(outputDir, { recursive: true });
        
        faceImagePath = `generated/face-${Date.now()}.jpg`;
        const fullPath = path.join(process.cwd(), faceImagePath);
        await fs.writeFile(fullPath, validatedData.faceImageBase64, 'base64');
      }

      // Create certificate record
      const certificate = await storage.createCertificate({
        ...validatedData,
        faceImagePath,
        rarityPercentage,
        rarityRatio,
      });
      
      // Generate images using Python script
      const { certificatePath, posterPath } = await generateImages(certificate);
      
      // Update certificate with image paths
      const updatedCertificate = await storage.updateCertificateImages(
        certificate.id,
        certificatePath,
        posterPath
      );
      
      res.json(updatedCertificate);
    } catch (error: any) {
      console.error("Certificate generation error:", error);
      res.status(400).json({ 
        message: error.message || "Failed to generate certificate",
        details: error.issues || []
      });
    }
  });

  // Get certificate by ID
  app.get("/api/certificates/:id", async (req, res) => {
    try {
      const certificate = await storage.getCertificate(req.params.id);
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }
      res.json(certificate);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch certificate" });
    }
  });

  // Download certificate image
  app.get("/api/certificates/:id/download/:type", async (req, res) => {
    try {
      const { id, type } = req.params;
      const certificate = await storage.getCertificate(id);
      
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }

      const imagePath = type === "poster" ? certificate.posterImagePath : certificate.certificateImagePath;
      
      if (!imagePath) {
        return res.status(404).json({ message: "Image not found" });
      }

      const fullPath = path.join(process.cwd(), imagePath);
      
      try {
        await fs.access(fullPath);
        res.download(fullPath, `${certificate.firstName}-${certificate.lastName}-${type}.png`);
      } catch {
        res.status(404).json({ message: "Image file not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to download image" });
    }
  });

  // Calculate rarity endpoint (for real-time updates)
  app.post("/api/rarity/calculate", async (req, res) => {
    try {
      const validatedData = generateCertificateRequestSchema.parse(req.body);
      const rarityPercentage = calculateRarity(validatedData);
      const rarityRatio = `1 in ${Math.round(100 / rarityPercentage).toLocaleString()}`;
      
      res.json({
        rarityPercentage,
        rarityRatio,
        description: getRarityDescription(rarityPercentage)
      });
    } catch (error: any) {
      res.status(400).json({ 
        message: error.message || "Failed to calculate rarity",
        details: error.issues || []
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function calculateRarity(data: any): number {
  const rarityData = {
    eyeColors: { brown: 79, blue: 8, green: 2, hazel: 5 },
    hairColors: { black: 75, brown: 11, blonde: 6, red: 2 },
    facialFeatures: {
      freckles: 4,
      dimples: 20,
      cleft_chin: 15,
      high_cheekbones: 12
    },
    physicalAbilities: {
      rollTongueWave: 25,
      independentEye: 8,
      wiggleEarsNoHands: 15,
      tongueToElbow: 3,
      thumbHypermobility: 5,
      tongueCloverleaf: 2,
      independentToes: 12,
      tongueToNose: 10
    }
  };

  let totalRarity = 1;
  
  // Eye color rarity
  if (data.eyeColor && rarityData.eyeColors[data.eyeColor as keyof typeof rarityData.eyeColors]) {
    totalRarity *= (rarityData.eyeColors[data.eyeColor as keyof typeof rarityData.eyeColors] / 100);
  }
  
  // Hair color rarity
  if (data.hairColor && rarityData.hairColors[data.hairColor as keyof typeof rarityData.hairColors]) {
    totalRarity *= (rarityData.hairColors[data.hairColor as keyof typeof rarityData.hairColors] / 100);
  }
  
  // Facial features rarity
  if (data.facialFeatures && Array.isArray(data.facialFeatures)) {
    data.facialFeatures.forEach((feature: string) => {
      if (rarityData.facialFeatures[feature as keyof typeof rarityData.facialFeatures]) {
        totalRarity *= (rarityData.facialFeatures[feature as keyof typeof rarityData.facialFeatures] / 100);
      }
    });
  }
  
  // Physical abilities rarity
  if (data.physicalAbilities && Array.isArray(data.physicalAbilities)) {
    data.physicalAbilities.forEach((ability: string) => {
      if (rarityData.physicalAbilities[ability as keyof typeof rarityData.physicalAbilities]) {
        totalRarity *= (rarityData.physicalAbilities[ability as keyof typeof rarityData.physicalAbilities] / 100);
      }
    });
  }
  
  return totalRarity * 100; // Convert to percentage
}

function getRarityDescription(rarity: number): string {
  if (rarity > 1) return "Uncommon combination";
  if (rarity > 0.1) return "Rare combination";
  if (rarity > 0.01) return "Very rare combination";
  return "Ultra rare combination!";
}

async function generateImages(certificate: any): Promise<{certificatePath: string, posterPath: string}> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), "server", "certificate-generator.py");
    const outputDir = path.join(process.cwd(), "generated");
    
    // Ensure output directory exists
    fs.mkdir(outputDir, { recursive: true }).catch(() => {});
    
    const pythonProcess = spawn("python3", [
      scriptPath,
      JSON.stringify({
        id: certificate.id,
        firstName: certificate.firstName,
        lastName: certificate.lastName,
        eyeColor: certificate.eyeColor,
        hairColor: certificate.hairColor,
        facialFeatures: certificate.facialFeatures,
        physicalAbilities: certificate.physicalAbilities,
        rarityPercentage: certificate.rarityPercentage,
        rarityRatio: certificate.rarityRatio,
        outputDir
      })
    ]);

    let output = "";
    let error = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output.trim());
          resolve({
            certificatePath: result.certificatePath,
            posterPath: result.posterPath
          });
        } catch (parseError) {
          reject(new Error(`Failed to parse Python script output: ${parseError}`));
        }
      } else {
        reject(new Error(`Python script failed with code ${code}: ${error}`));
      }
    });
  });
}
