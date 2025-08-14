import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { UseFormReturn } from "react-hook-form";
import { GenerateCertificateRequest } from "@shared/schema";

interface AbilitySelectorProps {
  form: UseFormReturn<GenerateCertificateRequest>;
}

export function AbilitySelector({ form }: AbilitySelectorProps) {
  const physicalAbilities = [
    { 
      value: "rollTongueWave", 
      label: "Zunge wie eine Welle rollen", 
      description: "Zunge doppelt wie eine Welle formen können", 
      rarity: "25%",
      icon: "fas fa-wave-square"
    },
    { 
      value: "independentEye", 
      label: "Ein Auge unabhängig bewegen", 
      description: "Ein Auge unabhängig vom anderen bewegen", 
      rarity: "8%",
      icon: "fas fa-eye"
    },
    { 
      value: "wiggleEarsNoHands", 
      label: "Ohren ohne Hände wackeln", 
      description: "Ohne Verwendung der Hände mit den Ohren wackeln", 
      rarity: "15%",
      icon: "fas fa-deaf"
    },
    { 
      value: "tongueToElbow", 
      label: "Ellbogen mit Zunge berühren", 
      description: "Den eigenen Ellbogen mit der Zunge berühren", 
      rarity: "3%",
      icon: "fas fa-hand-point-up"
    },
    { 
      value: "thumbHypermobility", 
      label: "Daumen hyperflexibel", 
      description: "Daumen nach hinten bis zum Unterarm biegen", 
      rarity: "5%",
      icon: "fas fa-hand-paper"
    },
    { 
      value: "tongueCloverleaf", 
      label: "Zunge wie Kleeblatt", 
      description: "Zunge in eine Kleeblatt-Form bringen", 
      rarity: "2%",
      icon: "fas fa-leaf"
    },
    { 
      value: "independentToes", 
      label: "Zehen unabhängig bewegen", 
      description: "Zehen unabhängig voneinander bewegen (z.B. großer Zeh hoch, andere runter)", 
      rarity: "12%",
      icon: "fas fa-shoe-prints"
    },
    { 
      value: "tongueToNose", 
      label: "Nase mit Zunge berühren", 
      description: "Die eigene Nasenspitze mit der Zunge berühren", 
      rarity: "10%",
      icon: "fas fa-hand-point-up"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Physical Abilities */}
      <FormField
        control={form.control}
        name="physicalAbilities"
        render={() => (
          <FormItem className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 text-white p-6">
              <FormLabel className="text-xl font-semibold text-white flex items-center">
                <i className="fas fa-running mr-3"></i>
                Körperliche Fähigkeiten
              </FormLabel>
            </div>
            <div className="p-6">
            <p className="text-sm text-slate-600 mb-4">
              Welche dieser seltenen körperlichen Fähigkeiten können Sie?
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {physicalAbilities.map((ability) => (
                <FormField
                  key={ability.value}
                  control={form.control}
                  name="physicalAbilities"
                  render={({ field }) => (
                    <FormItem
                      className="flex items-start space-x-3 p-4 border-2 border-purple-200 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 hover:shadow-lg"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(ability.value as any)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, ability.value])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== ability.value
                                  )
                                );
                          }}
                          data-testid={`checkbox-physicalAbilities-${ability.value}`}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 mr-2">
                            <FormLabel className="text-sm font-medium text-slate-900 cursor-pointer flex items-center">
                              <i className={`${ability.icon} text-primary mr-2`}></i>
                              {ability.label}
                            </FormLabel>
                            <div className="text-xs text-slate-500 mt-1">
                              {ability.description}
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs shrink-0">
                            {ability.rarity}
                          </Badge>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormMessage />
            </div>
          </FormItem>
        )}
      />

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <i className="fas fa-info-circle text-blue-500 mt-1 mr-3"></i>
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Tipp:</h4>
            <p className="text-sm text-blue-700">
              Je mehr seltene Fähigkeiten Sie haben, desto einzigartiger wird Ihr Seltenheits-Zertifikat! 
              Seien Sie ehrlich - das macht Ihr Zertifikat authentisch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}