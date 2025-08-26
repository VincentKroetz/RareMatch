import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Certificate, generateCertificateRequestSchema, type GenerateCertificateRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PhotoAnalyzer } from "@/components/photo-analyzer";
import { AbilitySelector } from "@/components/ability-selector";
import { RarityCalculator } from "@/components/rarity-calculator";
import { CertificatePreview } from "@/components/certificate-preview";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";

export default function Home() {
  const { toast } = useToast();
  const [generatedCertificate, setGeneratedCertificate] = useState<Certificate | null>(null);

  const form = useForm<GenerateCertificateRequest>({
    resolver: zodResolver(generateCertificateRequestSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      faceImageBase64: "",
      eyeColor: undefined,
      hairColor: undefined,
      facialFeatures: [],
      physicalAbilities: [],
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateCertificateRequest) => {
      const response = await apiRequest("POST", "/api/certificates/generate", data);
      return response.json() as Promise<Certificate>;
    },
    onSuccess: (certificate) => {
      setGeneratedCertificate(certificate);
      toast({
        title: "Certificate Generated!",
        description: "Your rarity certificate has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate certificate",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GenerateCertificateRequest) => {
    generateMutation.mutate(data);
  };

  const watchedValues = form.watch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Logo size={28} />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">RareMatch</h1>
                <p className="text-gray-600 text-xs">Discover how unique you really are</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-purple-700 bg-purple-100 px-4 py-2 rounded-full">
              <i className="fas fa-users text-purple-600"></i>
              <span>Professional rarity analysis</span>
            </div>
          </div>
        </div>
      </header>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Discover Your Rarity</h2>
          <p className="text-xl md:text-2xl mb-8 text-purple-100">
            Calculate how unique your combination of traits makes you and generate a personalized certificate
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-xl transform hover:scale-105 transition-all duration-200"
              onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-start-creating"
            >
              <i className="fas fa-magic mr-2"></i>Start Creating
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">1 in 10K+</div>
              <div className="text-purple-700">Rarest combinations possible</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-pink-600 mb-2">25+</div>
              <div className="text-pink-700">Unique traits tracked</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl shadow-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-2 text-left">Scientific</div>
              <div className="text-yellow-700">Research-based calculations</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">Instant</div>
              <div className="text-blue-700">Certificate generation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Generator Section */}
      <section id="generator" className="py-20 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">Erstellen Sie Ihr Seltenheits-Zertifikat</h3>
            <p className="text-lg text-gray-700">Laden Sie ein Foto hoch und wählen Sie Ihre besonderen Fähigkeiten</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center text-xl">
                    <i className="fas fa-user mr-3"></i>
                    Persönliche Informationen
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      {/* Personal Information */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vorname</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Geben Sie Ihren Vornamen ein" 
                                  data-testid="input-firstName"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nachname</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Geben Sie Ihren Nachnamen ein" 
                                  data-testid="input-lastName"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Photo Analyzer */}
                      <PhotoAnalyzer form={form} />

                      {/* Physical Abilities */}
                      <AbilitySelector form={form} />

                      {/* Generate Button */}
                      <div className="text-center">
                        <Button
                          type="submit"
                          size="lg"
                          disabled={generateMutation.isPending}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-xl transform hover:scale-105 transition-all duration-200 px-8 py-4"
                          data-testid="button-generate-certificate"
                        >
                          {generateMutation.isPending ? (
                            <>
                              <i className="fas fa-spinner fa-spin mr-3"></i>
                              Generating...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-certificate mr-3"></i>
                              Mein Zertifikat generieren
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <RarityCalculator formData={watchedValues} />
            </div>
          </div>
          
          {/* Certificate Preview Section - Below the form and rarity score */}
          {generatedCertificate && (
            <div className="mt-8">
              <CertificatePreview certificate={generatedCertificate} />
            </div>
          )}
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Example Certificates</h3>
            <p className="text-lg text-slate-600">See what others have discovered about their uniqueness</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Example Certificate 1 */}
            <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-4 border-secondary shadow-lg">
              <CardContent className="p-6 text-center">
                <h4 className="text-xl font-bold text-slate-900 mb-2">Ultra Rare Certificate</h4>
                <div className="text-lg text-primary font-semibold mb-2">Vincent M.</div>
                <div className="text-sm text-slate-600 mb-4 space-y-1">
                  <div>• Hazel Eyes <Badge variant="secondary">5%</Badge></div>
                  <div>• Freckles <Badge variant="secondary">4%</Badge></div>
                  <div>• Blonde Hair <Badge variant="secondary">6%</Badge></div>
                  <div>• Touch Nose w/ Tongue <Badge variant="secondary">10%</Badge></div>
                  <div>• Independent Toe Movement <Badge variant="secondary">1%</Badge></div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">0.000012%</div>
                  <div className="text-sm text-slate-600">1 in 8.3 million people</div>
                </div>
              </CardContent>
            </Card>

            {/* Example Certificate 2 */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-4 border-primary shadow-lg">
              <CardContent className="p-6 text-center">
                <h4 className="text-xl font-bold text-slate-900 mb-2">Rare Certificate</h4>
                <div className="text-lg text-primary font-semibold mb-2">Sarah K.</div>
                <div className="text-sm text-slate-600 mb-4 space-y-1">
                  <div>• Green Eyes <Badge variant="secondary">2%</Badge></div>
                  <div>• Red Hair <Badge variant="secondary">2%</Badge></div>
                  <div>• Dimples <Badge variant="secondary">20%</Badge></div>
                  <div>• Wiggle Ears <Badge variant="secondary">15%</Badge></div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">0.012%</div>
                  <div className="text-sm text-slate-600">1 in 8,333 people</div>
                </div>
              </CardContent>
            </Card>

            {/* Example Certificate 3 */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-4 border-emerald-500 shadow-lg">
              <CardContent className="p-6 text-center">
                <h4 className="text-xl font-bold text-slate-900 mb-2">Uncommon Certificate</h4>
                <div className="text-lg text-primary font-semibold mb-2">Mike R.</div>
                <div className="text-sm text-slate-600 mb-4 space-y-1">
                  <div>• Blue Eyes <Badge variant="secondary">8%</Badge></div>
                  <div>• Blonde Hair <Badge variant="secondary">6%</Badge></div>
                  <div>• Roll Tongue <Badge variant="secondary">65%</Badge></div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">3.12%</div>
                  <div className="text-sm text-slate-600">1 in 32 people</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <i className="fas fa-certificate text-secondary text-2xl mr-3"></i>
              <h4 className="text-xl font-bold">Rarity Certificate Generator</h4>
            </div>
            <p className="text-slate-400 mb-4">
              Discover and celebrate what makes you unique with scientifically-backed rarity calculations.
            </p>
            <div className="border-t border-slate-800 mt-8 pt-8 text-slate-400">
              <p>&copy; 2024 Rarity Certificate Generator. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
