
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Stethoscope, Pencil, Trash } from "lucide-react";
import { Child, HealthRecord } from "@/types";
import HealthRecordsList from "@/components/health/HealthRecordsList";
import { toast } from "@/hooks/use-toast";
import HealthRecordFormModal from "@/components/health/HealthRecordFormModal";
import ChildFormModal from "@/components/children/ChildFormModal";
import DeleteConfirmationDialog from "@/components/children/DeleteConfirmationDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Mock data
const mockChildren: Child[] = [
  {
    id: "1",
    firstName: "James",
    lastName: "Wilson",
    dateOfBirth: "2015-03-12",
    gender: "male",
    dateAdmitted: "2020-05-15",
    status: "active",
    guardianInfo: "No living relatives",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    dateOfBirth: "2017-07-23",
    gender: "female",
    dateAdmitted: "2019-11-30",
    status: "active",
    guardianInfo: "Aunt visits occasionally",
  },
  // ... other children
];

const mockHealthRecords: HealthRecord[] = [
  {
    id: "hr1",
    childId: "1",
    childFirstName: "James",
    childLastName: "Wilson",
    date: "2023-10-15",
    type: "illness",
    description: "Diagnosed with malaria",
    doctor: "Dr. Kimani",
    hospital: "City Hospital",
    disease: "Malaria",
    treatment: "Coartem - 3 day course, 2 tablets twice daily",
    cost: 3500,
    isPaid: true,
    notes: "Patient responded well to treatment",
  },
  {
    id: "hr2",
    childId: "1",
    childFirstName: "James",
    childLastName: "Wilson",
    date: "2023-12-05",
    type: "checkup",
    description: "Routine health checkup",
    doctor: "Dr. Omondi",
    hospital: "Community Clinic",
    cost: 1000,
    isPaid: true,
  },
  {
    id: "hr3",
    childId: "2",
    childFirstName: "Sarah",
    childLastName: "Johnson",
    date: "2024-01-20",
    type: "illness",
    description: "Admitted with pneumonia",
    doctor: "Dr. Wanjiku",
    hospital: "City Hospital",
    disease: "Pneumonia",
    treatment: "Amoxicillin 500mg every 8 hours, nebulizer treatments",
    cost: 15000,
    isPaid: false,
    debt: 5000,
    pendingMedicines: ["Inhaler", "Paracetamol"],
    notes: "Hospitalized for 3 days",
  },
  {
    id: "hr4",
    childId: "1",
    childFirstName: "James",
    childLastName: "Wilson",
    date: "2024-02-10",
    type: "vaccination",
    description: "MMR booster",
    doctor: "Dr. Kimani",
    hospital: "Vaccination Center",
    cost: 2000,
    isPaid: true,
    paymentReceipt: "RCT-2024-0123",
  },
];

const HealthRecords = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [children, setChildren] = useState<Child[]>(mockChildren);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(mockHealthRecords);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | undefined>(undefined);
  const [selectedChildForEdit, setSelectedChildForEdit] = useState<Child | null>(null);
  const [selectedChildForDelete, setSelectedChildForDelete] = useState<Child | null>(null);
  const [isDeleteRecordDialogOpen, setIsDeleteRecordDialogOpen] = useState(false);
  const [recordIdToDelete, setRecordIdToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredRecords = healthRecords.filter(record => {
    // Search in multiple fields
    const searchIn = [
      record.description,
      record.doctor,
      record.disease,
      record.treatment,
      record.notes,
      record.childFirstName,
      record.childLastName,
      record.hospital
    ].filter(Boolean).join(" ").toLowerCase();

    return searchQuery === "" || searchIn.includes(searchQuery.toLowerCase());
  });

  const handleAddRecord = () => {
    setSelectedRecord(undefined);
    setIsRecordModalOpen(true);
  };

  const handleEditRecord = (record: HealthRecord) => {
    setSelectedRecord(record);
    setIsRecordModalOpen(true);
  };

  const handleDeleteRecord = (recordId: string) => {
    setRecordIdToDelete(recordId);
    setIsDeleteRecordDialogOpen(true);
  };

  const confirmDeleteRecord = () => {
    if (recordIdToDelete) {
      const record = healthRecords.find(r => r.id === recordIdToDelete);
      setHealthRecords(prev => prev.filter(r => r.id !== recordIdToDelete));
      
      toast({
        title: "Record Deleted",
        description: record ? 
          `Health record for ${record.childFirstName || ''} ${record.childLastName || ''} has been deleted.` : 
          "Health record has been deleted.",
      });
      
      setRecordIdToDelete(null);
      setIsDeleteRecordDialogOpen(false);
    }
  };

  const handleSaveRecord = (record: HealthRecord) => {
    if (selectedRecord) {
      // Update existing record
      setHealthRecords(prev => prev.map(r => r.id === record.id ? record : r));
      toast({
        title: "Record Updated",
        description: "The health record has been updated successfully.",
      });
    } else {
      // Add new record
      setHealthRecords(prev => [...prev, record]);
      toast({
        title: "Record Added",
        description: "A new health record has been added successfully.",
      });
    }
    setIsRecordModalOpen(false);
  };

  const handleEditChild = (childId: string) => {
    const child = children.find(c => c.id === childId);
    if (child) {
      setSelectedChildForEdit(child);
      setIsChildModalOpen(true);
    }
  };

  const handleSaveChild = (child: Child) => {
    if (selectedChildForEdit) {
      // Update existing child
      setChildren(prev => prev.map(c => c.id === child.id ? child : c));
      // Also update child name in health records
      setHealthRecords(prev => prev.map(r => {
        if (r.childId === child.id) {
          return {
            ...r,
            childFirstName: child.firstName,
            childLastName: child.lastName
          };
        }
        return r;
      }));
      toast({
        title: "Child Updated",
        description: `${child.firstName} ${child.lastName}'s information has been updated.`,
      });
    } else {
      // Add new child
      setChildren(prev => [...prev, child]);
      toast({
        title: "Child Added",
        description: `${child.firstName} ${child.lastName} has been added.`,
      });
    }
    setIsChildModalOpen(false);
    setSelectedChildForEdit(null);
  };

  const handleDeleteChild = (childId: string) => {
    const child = children.find(c => c.id === childId);
    if (child) {
      setSelectedChildForDelete(child);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDeleteChild = () => {
    if (selectedChildForDelete) {
      setChildren(prev => prev.filter(c => c.id !== selectedChildForDelete.id));
      // Also remove all health records for this child
      setHealthRecords(prev => prev.filter(r => r.childId !== selectedChildForDelete.id));
      toast({
        title: "Child Deleted",
        description: `${selectedChildForDelete.firstName} ${selectedChildForDelete.lastName} and all related records have been deleted.`,
      });
      
      setSelectedChildForDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto animate-fade-in p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Health Records</h1>
          <p className="text-muted-foreground">Track medical history, treatments, and expenses</p>
        </div>
        <Button 
          className="mt-4 md:mt-0"
          onClick={handleAddRecord}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Record
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <CardTitle className="text-lg flex items-center">
              <Stethoscope className="mr-2 h-5 w-5 text-primary" />
              Medical History
            </CardTitle>
          </div>
          <CardDescription>
            Search for health records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search records..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Records</TabsTrigger>
              <TabsTrigger value="diseases">Diseases</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <HealthRecordsList 
                records={filteredRecords} 
                showChildName={true} 
                onEditRecord={handleEditRecord}
                onDeleteRecord={handleDeleteRecord}
              />
            </TabsContent>
            <TabsContent value="diseases">
              <HealthRecordsList 
                records={filteredRecords.filter(r => r.disease)} 
                showChildName={true} 
                onEditRecord={handleEditRecord}
                onDeleteRecord={handleDeleteRecord}
              />
            </TabsContent>
            <TabsContent value="expenses">
              <HealthRecordsList 
                records={filteredRecords.filter(r => r.cost && r.cost > 0)} 
                showChildName={true} 
                showFinancials
                onEditRecord={handleEditRecord}
                onDeleteRecord={handleDeleteRecord}
              />
            </TabsContent>
            <TabsContent value="pending">
              <HealthRecordsList 
                records={filteredRecords.filter(r => !r.isPaid || r.debt || (r.pendingMedicines && r.pendingMedicines.length > 0))} 
                showChildName={true} 
                showFinancials
                onEditRecord={handleEditRecord}
                onDeleteRecord={handleDeleteRecord}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Health Record Form Modal */}
      <HealthRecordFormModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSave={handleSaveRecord}
        children={children}
        record={selectedRecord}
      />

      {/* Child Form Modal */}
      <ChildFormModal
        isOpen={isChildModalOpen}
        onClose={() => {
          setIsChildModalOpen(false);
          setSelectedChildForEdit(null);
        }}
        onSave={handleSaveChild}
        child={selectedChildForEdit || undefined}
      />

      {/* Delete Child Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedChildForDelete(null);
        }}
        onConfirm={confirmDeleteChild}
        child={selectedChildForDelete}
      />

      {/* Delete Record Confirmation Dialog */}
      <AlertDialog open={isDeleteRecordDialogOpen} onOpenChange={setIsDeleteRecordDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Health Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this health record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteRecordDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRecord} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HealthRecords;
