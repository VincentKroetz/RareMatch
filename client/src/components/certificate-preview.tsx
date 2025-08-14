import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Certificate } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface CertificatePreviewProps {
  certificate: Certificate;
}

export function CertificatePreview({ certificate }: CertificatePreviewProps) {
  const { toast } = useToast();

  const downloadCertificate = async () => {
    try {
      const response = await fetch(`/api/certificates/${certificate.id}/download/certificate`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${certificate.firstName}-${certificate.lastName}-certificate.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Your certificate is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download certificate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadPoster = async () => {
    try {
      const response = await fetch(`/api/certificates/${certificate.id}/download/poster`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${certificate.firstName}-${certificate.lastName}-poster.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Your poster is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download poster. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTraitDisplay = () => {
    const traits = [];
    
    if (certificate.eyeColor) {
      traits.push(`• ${certificate.eyeColor.charAt(0).toUpperCase() + certificate.eyeColor.slice(1)} Eyes`);
    }
    
    if (certificate.hairColor) {
      traits.push(`• ${certificate.hairColor.charAt(0).toUpperCase() + certificate.hairColor.slice(1)} Hair`);
    }
    
    if (certificate.specialTraits && Array.isArray(certificate.specialTraits)) {
      const traitNames: { [key: string]: string } = {
        freckles: "Freckles",
        tongueToNose: "Touch Nose with Tongue",
        independentToes: "Independent Toe Movement",
        wiggleEars: "Wiggle Ears",
        rollTongue: "Roll Tongue",
        dimples: "Dimples"
      };
      
      certificate.specialTraits.forEach((trait: string) => {
        if (traitNames[trait]) {
          traits.push(`• ${traitNames[trait]}`);
        }
      });
    }
    
    return traits;
  };

  return (
    <Card className="shadow-lg" data-testid="card-certificate-preview">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <i className="fas fa-eye text-secondary mr-2"></i>
            Certificate Preview
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-slate-600"
              data-testid="button-refresh-preview"
            >
              <i className="fas fa-refresh text-sm"></i>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Certificate Mockup */}
        <div className="aspect-[4/3] bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-secondary rounded-lg p-6 relative overflow-hidden mb-4">
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-12 h-12 border-2 border-secondary/20 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-2 border-secondary/20 rounded-full"></div>
          
          <div className="text-center h-full flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Rare Traits Certificate</h2>
              <div className="w-16 h-1 bg-secondary mx-auto mb-4"></div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-slate-700">This certifies that</p>
              <p 
                className="text-lg font-bold text-primary"
                data-testid="text-preview-name"
              >
                {certificate.firstName} {certificate.lastName}
              </p>
              <p className="text-sm text-slate-700">possesses an exceptionally rare combination</p>
              
              <div 
                className="text-xs text-slate-600 space-y-1 max-h-20 overflow-y-auto"
                data-testid="text-preview-traits"
              >
                {getTraitDisplay().map((trait, index) => (
                  <div key={index}>{trait}</div>
                ))}
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-inner mt-3">
                <div className="text-sm font-semibold text-slate-900">Estimated Rarity</div>
                <div 
                  className="text-xl font-bold text-secondary"
                  data-testid="text-preview-rarity"
                >
                  {certificate.rarityPercentage < 0.000001 
                    ? certificate.rarityPercentage.toExponential(2) 
                    : certificate.rarityPercentage.toFixed(6)}%
                </div>
                <div 
                  className="text-xs text-slate-600"
                  data-testid="text-preview-frequency"
                >
                  {certificate.rarityRatio} people worldwide
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Limited Edition</span>
              <span data-testid="text-preview-date">
                Generated {new Date(certificate.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        {/* Download Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={downloadCertificate}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700"
            data-testid="button-download-certificate"
          >
            <i className="fas fa-download mr-2"></i>
            Certificate
          </Button>
          <Button
            onClick={downloadPoster}
            className="bg-primary hover:bg-indigo-700 text-white"
            data-testid="button-download-poster"
          >
            <i className="fas fa-image mr-2"></i>
            Poster
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
