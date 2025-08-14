import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GenerateCertificateRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";

interface RarityCalculatorProps {
  formData: GenerateCertificateRequest;
}

interface RarityData {
  rarityPercentage: number;
  rarityRatio: string;
  description: string;
}

export function RarityCalculator({ formData }: RarityCalculatorProps) {
  const [rarityData, setRarityData] = useState<RarityData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const calculateRarity = async () => {
      // Only calculate if we have required data including first and last name and face image
      if (!formData.eyeColor || !formData.hairColor || !formData.firstName || !formData.lastName || !formData.faceImageBase64) {
        setRarityData(null);
        return;
      }

      setIsCalculating(true);
      try {
        const response = await apiRequest("POST", "/api/rarity/calculate", formData);
        const data = await response.json();
        setRarityData(data);
      } catch (error) {
        console.error("Failed to calculate rarity:", error);
        setRarityData(null);
      } finally {
        setIsCalculating(false);
      }
    };

    // Debounce the calculation
    const timeoutId = setTimeout(calculateRarity, 300);
    return () => clearTimeout(timeoutId);
  }, [formData]);

  const getRarityColor = (rarity: number) => {
    if (rarity > 1) return "text-green-600";
    if (rarity > 0.1) return "text-yellow-600";
    if (rarity > 0.01) return "text-orange-600";
    return "text-red-600";
  };

  const getRarityIcon = (rarity: number) => {
    if (rarity > 1) return "fas fa-star";
    if (rarity > 0.1) return "fas fa-star-half-alt";
    if (rarity > 0.01) return "fas fa-certificate";
    return "fas fa-gem";
  };

  return (
    <Card className="sticky top-6 shadow-2xl border-0 bg-white/95 backdrop-blur-sm" data-testid="card-rarity-calculator">
      <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center text-xl">
          <i className="fas fa-calculator mr-3"></i>
          Your Rarity Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!formData.eyeColor || !formData.hairColor || !formData.firstName || !formData.lastName || !formData.faceImageBase64 ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 flex items-center justify-center">
              <i className="fas fa-calculator text-slate-400 text-2xl"></i>
            </div>
            <p className="text-slate-500 text-sm" data-testid="text-select-traits">
              Geben Sie Ihren Namen ein und laden Sie ein Foto hoch, um die Seltenheit zu berechnen
            </p>
          </div>
        ) : isCalculating ? (
          <div className="text-center py-8">
            <Skeleton className="w-24 h-12 mx-auto mb-4" />
            <Skeleton className="w-32 h-4 mx-auto mb-2" />
            <Skeleton className="w-28 h-4 mx-auto" />
          </div>
        ) : rarityData ? (
          <>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <i className={`${getRarityIcon(rarityData.rarityPercentage)} text-2xl mr-2 ${getRarityColor(rarityData.rarityPercentage)}`}></i>
                <div 
                  className={`text-4xl font-bold ${getRarityColor(rarityData.rarityPercentage)}`}
                  data-testid="text-rarity-percentage"
                >
                  {rarityData.rarityPercentage < 0.000001 
                    ? rarityData.rarityPercentage.toExponential(2) 
                    : rarityData.rarityPercentage.toFixed(6)}%
                </div>
              </div>
              <p className="text-slate-600 mb-2" data-testid="text-rarity-description">
                {rarityData.description}
              </p>
              <p 
                className="text-lg font-semibold text-secondary"
                data-testid="text-rarity-ratio"
              >
                {rarityData.rarityRatio} people
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-slate-800">Selected Traits:</h4>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-700">Eye Color</span>
                <span 
                  className="text-sm font-semibold text-secondary capitalize"
                  data-testid="text-selected-eyeColor"
                >
                  {formData.eyeColor}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-700">Hair Color</span>
                <span 
                  className="text-sm font-semibold text-secondary capitalize"
                  data-testid="text-selected-hairColor"
                >
                  {formData.hairColor}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-700">Körperliche Fähigkeiten</span>
                <span 
                  className="text-sm font-semibold text-secondary"
                  data-testid="text-selected-physicalAbilities-count"
                >
                  {formData.physicalAbilities?.length || 0} ausgewählt
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-700">Gesichtsmerkmale</span>
                <span 
                  className="text-sm font-semibold text-secondary"
                  data-testid="text-selected-facialFeatures-count"
                >
                  {formData.facialFeatures?.length || 0} erkannt
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-slate-700 font-medium">
                  🎉 {rarityData.rarityPercentage < 0.01 ? "Ultra Rare" : rarityData.rarityPercentage < 0.1 ? "Very Rare" : rarityData.rarityPercentage < 1 ? "Rare" : "Uncommon"} combination!
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-slate-400 text-2xl"></i>
            </div>
            <p className="text-slate-500 text-sm">Unable to calculate rarity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
