export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { firstName, lastName, eyeColor, hairColor, physicalAbilities } = req.body;
    
    const rarityPercentage = Math.max(0.01, 1.0 - (physicalAbilities?.length || 0) * 0.2);
    
    const certificate = {
      id: Math.random().toString(36).substring(2, 15),
      firstName,
      lastName,
      eyeColor,
      hairColor,
      physicalAbilities: physicalAbilities || [],
      rarityPercentage,
      rarityRatio: `1 in ${Math.round(100 / rarityPercentage)}`,
      createdAt: new Date().toISOString(),
      certificateUrl: `https://via.placeholder.com/800x600/6366f1/ffffff?text=${firstName}+${lastName}+Certificate`,
      posterUrl: `https://via.placeholder.com/600x800/ec4899/ffffff?text=${firstName}+${lastName}+Poster`
    };

    return res.json({
      success: true,
      certificate,
      message: "Certificate generated successfully!"
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
