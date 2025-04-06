
import React from "react";
import { SpeechToText } from "@/components/language/SpeechToText";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

const Speech = () => {
  const { language, t } = useLanguage();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">
        {language === "en" ? "Speech Recognition" : "Utambuzi wa Sauti"}
      </h1>
      
      <p className="text-muted-foreground">
        {language === "en" 
          ? "Speak in any language and get it translated automatically." 
          : "Ongea kwa lugha yoyote na upate tafsiri kiotomatiki."}
      </p>
      
      <Tabs defaultValue="english" className="w-full max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="english">English</TabsTrigger>
          <TabsTrigger value="swahili">Kiswahili</TabsTrigger>
        </TabsList>
        
        <TabsContent value="english" className="mt-6">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Speak in any language</h2>
            <p className="text-muted-foreground mb-6">
              Your speech will be translated to English
            </p>
            <SpeechToText 
              standalone={true} 
              targetLanguage="en"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="swahili" className="mt-6">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Ongea kwa lugha yoyote</h2>
            <p className="text-muted-foreground mb-6">
              Sauti yako itatafsiriwa kwa Kiswahili
            </p>
            <SpeechToText 
              standalone={true} 
              targetLanguage="sw"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Speech;
