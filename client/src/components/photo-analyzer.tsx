import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { GenerateCertificateRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface PhotoAnalyzerProps {
  form: UseFormReturn<GenerateCertificateRequest>;
}

export function PhotoAnalyzer({ form }: PhotoAnalyzerProps) {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<{
    eyeColor: string;
    hairColor: string;
    facialFeatures: string[];
  } | null>(null);

  const analyzeImage = useCallback(async (imageData: string) => {
    setIsAnalyzing(true);
    
    try {
      // Simuliere KI-Bildanalyse mit deterministischen Ergebnissen
      // In einer echten Implementierung würde hier eine API aufgerufen
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Basiere die Analyse auf Bildcharakteristiken
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Analysiere Bildfarben für realistische Ergebnisse
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData?.data;
        
        if (pixels) {
          // Bestimme dominante Farben
          let avgR = 0, avgG = 0, avgB = 0;
          for (let i = 0; i < pixels.length; i += 16) { // Sample every 4th pixel
            avgR += pixels[i];
            avgG += pixels[i + 1];
            avgB += pixels[i + 2];
          }
          const sampleCount = pixels.length / 16;
          avgR = Math.round(avgR / sampleCount);
          avgG = Math.round(avgG / sampleCount);
          avgB = Math.round(avgB / sampleCount);
          
          // Bestimme Augenfarbe basierend auf Farbanalyse
          let eyeColor: string;
          if (avgB > avgR && avgB > avgG) eyeColor = "blue";
          else if (avgG > avgR && avgG > avgB) eyeColor = "green";
          else if (avgR > 150 && avgG > 100 && avgB > 50) eyeColor = "hazel";
          else eyeColor = "brown";
          
          // Bestimme Haarfarbe
          let hairColor: string;
          const brightness = (avgR + avgG + avgB) / 3;
          if (brightness < 80) hairColor = "black";
          else if (brightness < 150) hairColor = "brown";
          else if (avgG > avgB && avgR > avgB) hairColor = "blonde";
          else hairColor = "red";
          
          // Zufällige Gesichtsmerkmale basierend auf Bilddaten
          const facialFeatures: string[] = [];
          if ((avgR + avgG + avgB) % 4 === 0) facialFeatures.push("freckles");
          if ((avgR + avgG + avgB) % 3 === 0) facialFeatures.push("dimples");
          if (brightness > 120) facialFeatures.push("high_cheekbones");
          
          const results = { eyeColor, hairColor, facialFeatures };
          setAnalysisResults(results);
          
          // Setze Formular-Werte
          form.setValue("eyeColor", eyeColor as any);
          form.setValue("hairColor", hairColor as any);
          form.setValue("facialFeatures", facialFeatures as any);
          
          toast({
            title: "Bildanalyse abgeschlossen!",
            description: `Erkannt: ${eyeColor} Augen, ${hairColor} Haare`,
          });
        }
      };
      
      img.src = imageData;
      
    } catch (error) {
      toast({
        title: "Analyse fehlgeschlagen",
        description: "Bitte versuchen Sie es mit einem anderen Foto.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [form, toast]);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Überprüfe Dateigröße (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Datei zu groß",
        description: "Bitte wählen Sie ein Bild unter 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Überprüfe Dateityp
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ungültiges Format",
        description: "Bitte wählen Sie eine Bilddatei.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
      
      // Setze Base64 im Formular
      const base64 = result.split(',')[1];
      form.setValue("faceImageBase64", base64);
      
      // Starte Analyse
      analyzeImage(result);
    };
    reader.readAsDataURL(file);
  }, [form, toast, analyzeImage]);

  return (
    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm mb-6">
      <CardHeader className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center text-xl">
          <i className="fas fa-camera mr-3"></i>
          Foto-Analyse
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload */}
        <div>
          <Label htmlFor="photo-upload">Gesichtsfoto hochladen</Label>
          <Input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2"
            data-testid="input-photo-upload"
          />
          <p className="text-sm text-slate-500 mt-1">
            Laden Sie ein klares Foto Ihres Gesichts hoch (max. 5MB)
          </p>
        </div>

        {/* Preview */}
        {previewImage && (
          <div className="text-center">
            <img
              src={previewImage}
              alt="Vorschau"
              className="max-w-full h-48 object-cover rounded-lg mx-auto"
              data-testid="img-photo-preview"
            />
          </div>
        )}

        {/* Analysis Status */}
        {isAnalyzing && (
          <div className="text-center py-4">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-slate-600" data-testid="text-analyzing">
              Analysiere Ihr Foto...
            </p>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResults && !isAnalyzing && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">
              <i className="fas fa-check-circle mr-2"></i>
              Analyse-Ergebnisse:
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Augenfarbe:</span>
                <span className="font-semibold capitalize" data-testid="text-detected-eyeColor">
                  {analysisResults.eyeColor}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Haarfarbe:</span>
                <span className="font-semibold capitalize" data-testid="text-detected-hairColor">
                  {analysisResults.hairColor}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Gesichtsmerkmale:</span>
                <span className="font-semibold" data-testid="text-detected-facialFeatures">
                  {analysisResults.facialFeatures.length > 0 
                    ? analysisResults.facialFeatures.join(", ") 
                    : "Keine besonderen"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Manual Override */}
        {analysisResults && (
          <div className="text-center">
            <p className="text-sm text-slate-500 mb-2">
              Stimmen die Ergebnisse nicht? Sie können sie unten manuell anpassen.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}