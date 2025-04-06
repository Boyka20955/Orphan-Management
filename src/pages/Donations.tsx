
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DonationList from "@/components/donations/DonationList";
import SponsoredChildrenList from "@/components/donations/SponsoredChildrenList";
import DonationFormModal from "@/components/donations/DonationFormModal";
import SponsorshipFormModal from "@/components/donations/SponsorshipFormModal";
import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Donation } from "@/types";
import { toast } from "@/hooks/use-toast";

const Donations = () => {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isSponsorshipModalOpen, setIsSponsorshipModalOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState<any>(null);
  const [editingSponsorship, setEditingSponsorship] = useState<any>(null);
  const { t } = useLanguage();
  
  // State to track donations and sponsorships
  const [donations, setDonations] = useState<any[]>([]);
  const [sponsorships, setSponsorships] = useState<any[]>([]);

  const handleEditDonation = (donation: any) => {
    setEditingDonation(donation);
    setIsDonationModalOpen(true);
  };

  const handleEditSponsorship = (sponsorship: any) => {
    setEditingSponsorship(sponsorship);
    setIsSponsorshipModalOpen(true);
  };
  
  const handleSaveDonation = (donation: any) => {
    if (editingDonation) {
      // Update existing donation
      setDonations(prev => prev.map(d => d.id === donation.id ? donation : d));
      toast({
        title: "Donation Updated",
        description: "The donation has been successfully updated.",
      });
    } else {
      // Add new donation
      setDonations(prev => [...prev, donation]);
      toast({
        title: "Donation Added",
        description: "A new donation has been successfully recorded.",
      });
    }
    setIsDonationModalOpen(false);
    setEditingDonation(null);
  };
  
  const handleSaveSponsorship = (sponsorship: any) => {
    if (editingSponsorship) {
      // Update existing sponsorship
      setSponsorships(prev => prev.map(s => s.id === sponsorship.id ? sponsorship : s));
      toast({
        title: "Sponsorship Updated",
        description: "The sponsorship has been successfully updated.",
      });
    } else {
      // Add new sponsorship
      setSponsorships(prev => [...prev, sponsorship]);
      toast({
        title: "Sponsorship Added",
        description: "A new sponsorship has been successfully recorded.",
      });
    }
    setIsSponsorshipModalOpen(false);
    setEditingSponsorship(null);
  };
  
  const handleDeleteDonation = (id: string) => {
    setDonations(prev => prev.filter(d => d.id !== id));
    toast({
      title: "Donation Deleted",
      description: "The donation has been successfully deleted.",
    });
  };
  
  const handleDeleteSponsorship = (id: string) => {
    setSponsorships(prev => prev.filter(s => s.id !== id));
    toast({
      title: "Sponsorship Deleted",
      description: "The sponsorship has been successfully deleted.",
    });
  };

  const translations = {
    en: {
      donations: "Donations",
      monetaryDonations: "Monetary Donations",
      sponsoredChildren: "Sponsored Children",
      addDonation: "Add Donation",
      addSponsorship: "Add Sponsorship"
    },
    sw: {
      donations: "Michango",
      monetaryDonations: "Michango ya Kifedha",
      sponsoredChildren: "Watoto Waliodhaminiwa",
      addDonation: "Ongeza Mchango",
      addSponsorship: "Ongeza Udhamini"
    }
  };

  const { language } = useLanguage();
  const text = translations[language as keyof typeof translations];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{text.donations}</h1>
      </div>

      <Tabs defaultValue="donations" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="donations">{text.monetaryDonations}</TabsTrigger>
            <TabsTrigger value="sponsorships">{text.sponsoredChildren}</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <TabsContent value="donations" className="mt-0">
              <Button 
                onClick={() => {
                  setEditingDonation(null);
                  setIsDonationModalOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> {text.addDonation}
              </Button>
            </TabsContent>
            
            <TabsContent value="sponsorships" className="mt-0">
              <Button 
                onClick={() => {
                  setEditingSponsorship(null);
                  setIsSponsorshipModalOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> {text.addSponsorship}
              </Button>
            </TabsContent>
          </div>
        </div>

        <TabsContent value="donations">
          <DonationList 
            onEdit={handleEditDonation} 
            onDelete={handleDeleteDonation}
            customDonations={donations}
          />
        </TabsContent>
        
        <TabsContent value="sponsorships">
          <SponsoredChildrenList 
            onEdit={handleEditSponsorship} 
            onDelete={handleDeleteSponsorship}
            customSponsorships={sponsorships}
          />
        </TabsContent>
      </Tabs>

      <DonationFormModal 
        open={isDonationModalOpen} 
        onOpenChange={setIsDonationModalOpen}
        donation={editingDonation}
        onSave={handleSaveDonation}
      />
      
      <SponsorshipFormModal 
        open={isSponsorshipModalOpen} 
        onOpenChange={setIsSponsorshipModalOpen}
        sponsorship={editingSponsorship}
        onSave={handleSaveSponsorship}
      />
    </div>
  );
};

export default Donations;
