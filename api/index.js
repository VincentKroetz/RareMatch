// Vercel Serverless Function für RareMatch API

// In-Memory Storage
const certificates = new Map();

// Helper Functions
function generateCertificateId() {
  return Math.random().toString(36).substring(2, 15);
}

function calculateRarity(eyeColor, hairColor, physicalAbilities) {
  const baseRarity = 1.0;
  const abilityMultiplier = (physicalAbilities?.length || 0) * 0.2;
  return Math.max(0.01, baseRarity - abilityMultiplier);
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
}

// Main Handler
export default function handler(req, res) {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method } = req;

  // Route to certificate generation
  if (url.includes('/api/certificates/generate') && method === 'POST') {
    try {
      const { firstName, lastName, eyeColor, hairColor, facialFeatures, physicalAbilities } = req.body;
      
      const certificateId = generateCertificateId();
      const rarityPercentage = calculateRarity(eyeColor, hairColor, physicalAbilities);
      
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

      certificates.set(certificateId, certificate);
      
      return res.json({
        success: true,
        certificate,
        message: "Certificate generated successfully!"
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate certificate"
      });
    }
  }

  // Route to rarity calculation
  if (url.includes('/api/rarity/calculate') && method === 'POST') {
    try {
      const { eyeColor, hairColor, physicalAbilities } = req.body;
      
      if (!eyeColor || !hairColor) {
        return res.status(400).json({
          error: "Eye color and hair color are required"
        });
      }
      
      const rarityPercentage = calculateRarity(eyeColor, hairColor, physicalAbilities);
      
      return res.json({
        rarityPercentage,
        rarityRatio: `1 in ${Math.round(100 / rarityPercentage)}`,
        description: rarityPercentage < 0.1 ? "Extremely Rare" : 
                     rarityPercentage < 0.5 ? "Very Rare" : 
                     rarityPercentage < 1.0 ? "Rare" : "Uncommon"
      });
    } catch (error) {
      return res.status(500).json({
        error: "Failed to calculate rarity"
      });
    }
  }

  // Route to get certificate by ID
  if (url.includes('/api/certificates/') && method === 'GET') {
    try {
      const id = url.split('/api/certificates/')[1];
      const certificate = certificates.get(id);
      
      if (!certificate) {
        return res.status(404).json({
          success: false,
          message: "Certificate not found"
        });
      }
      
      return res.json({
        success: true,
        certificate
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve certificate"
      });
    }
  }

  // Health check
  if (url.includes('/api/health') && method === 'GET') {
    return res.json({ status: 'OK', timestamp: new Date().toISOString() });
  }

  // Default response
  return res.status(404).json({ error: 'Route not found' });
}
