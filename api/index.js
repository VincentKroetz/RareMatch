// Vercel Serverless Function für RareMatch API
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Storage Interface (simplified for serverless)
class MemoryStorage {
  constructor() {
    this.certificates = new Map();
  }

  async saveCertificate(certificate) {
    this.certificates.set(certificate.id, certificate);
    return certificate;
  }

  async getCertificate(id) {
    return this.certificates.get(id) || null;
  }
}

const storage = new MemoryStorage();

// API Routes
app.post('/api/certificates/generate', async (req, res) => {
  try {
    const { firstName, lastName, eyeColor, hairColor, facialFeatures, physicalAbilities } = req.body;
    
    // Generate certificate ID
    const certificateId = Math.random().toString(36).substring(2, 15);
    
    // Calculate rarity (simplified)
    const baseRarity = 0.5;
    const abilityMultiplier = physicalAbilities?.length * 0.1 || 0;
    const rarityPercentage = Math.max(0.01, baseRarity - abilityMultiplier);
    
    const certificate = {
      id: certificateId,
      firstName,
      lastName,
      eyeColor,
      hairColor,
      facialFeatures: facialFeatures || [],
      physicalAbilities: physicalAbilities || [],
      rarityPercentage,
      rarityRatio: `1 in ${Math.round(100 / rarityPercentage)}`,
      createdAt: new Date().toISOString(),
      certificateUrl: `https://via.placeholder.com/800x600/6366f1/ffffff?text=${firstName}+${lastName}+Certificate`,
      posterUrl: `https://via.placeholder.com/600x800/ec4899/ffffff?text=${firstName}+${lastName}+Poster`
    };

    await storage.saveCertificate(certificate);
    
    res.json({
      success: true,
      certificate,
      message: "Certificate generated successfully!"
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to generate certificate"
    });
  }
});

app.post('/api/rarity/calculate', async (req, res) => {
  try {
    const { eyeColor, hairColor, physicalAbilities } = req.body;
    
    if (!eyeColor || !hairColor) {
      return res.status(400).json({
        error: "Eye color and hair color are required"
      });
    }
    
    const baseRarity = 1.0;
    const abilityMultiplier = physicalAbilities?.length * 0.2 || 0;
    const rarityPercentage = Math.max(0.01, baseRarity - abilityMultiplier);
    
    res.json({
      rarityPercentage,
      rarityRatio: `1 in ${Math.round(100 / rarityPercentage)}`,
      description: rarityPercentage < 0.1 ? "Extremely Rare" : 
                   rarityPercentage < 0.5 ? "Very Rare" : 
                   rarityPercentage < 1.0 ? "Rare" : "Uncommon"
    });
  } catch (error) {
    console.error('Rarity calculation error:', error);
    res.status(500).json({
      error: "Failed to calculate rarity"
    });
  }
});

app.get('/api/certificates/:id', async (req, res) => {
  try {
    const certificate = await storage.getCertificate(req.params.id);
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found"
      });
    }
    
    res.json({
      success: true,
      certificate
    });
  } catch (error) {
    console.error('Certificate retrieval error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve certificate"
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Export for Vercel
module.exports = app;