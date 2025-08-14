export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { eyeColor, hairColor, physicalAbilities } = req.body;
    
    if (!eyeColor || !hairColor) {
      return res.status(400).json({
        error: "Eye color and hair color are required"
      });
    }
    
    const rarityPercentage = Math.max(0.01, 1.0 - (physicalAbilities?.length || 0) * 0.2);
    
    return res.json({
      rarityPercentage,
      rarityRatio: `1 in ${Math.round(100 / rarityPercentage)}`,
      description: rarityPercentage < 0.1 ? "Extremely Rare" : 
                   rarityPercentage < 0.5 ? "Very Rare" : 
                   rarityPercentage < 1.0 ? "Rare" : "Uncommon"
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
