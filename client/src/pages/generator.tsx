import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Certificate, generateCertificateRequestSchema, type GenerateCertificateRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PhotoAnalyzer } from "@/components/photo-analyzer";
import { AbilitySelector } from "@/components/ability-selector";
import { RarityCalculator } from "@/components/rarity-calculator";
import { CertificatePreview } from "@/components/certificate-preview";
import { Logo } from "@/components/logo";
import { Link } from "wouter";

export default function Generator() {
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
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-4 cursor-pointer">
                <Logo size={80} />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">RareMatch</h1>
                  <p className="text-gray-600 text-sm">Discover how unique you really are</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Generator Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
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
          
          {/* Certificate Preview Section */}
          {generatedCertificate && (
            <div className="mt-8">
              <CertificatePreview certificate={generatedCertificate} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
