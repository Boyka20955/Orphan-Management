import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { Child } from "@/types";
import { toast } from "@/hooks/use-toast";
import ChildProfileModal from "@/components/children/ChildProfileModal";
import ChildFormModal from "@/components/children/ChildFormModal";
import DeleteConfirmationDialog from "@/components/children/DeleteConfirmationDialog";
import ChildrenSearch from "@/components/children/ChildrenSearch";
import ChildrenGrid from "@/components/children/ChildrenGrid";
import ChildrenList from "@/components/children/ChildrenList";

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
    childPresent: true,
    childUpdated: true,
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
    childPresent: true,
    childUpdated: false,
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Brown",
    dateOfBirth: "2014-01-05",
    gender: "male",
    dateAdmitted: "2018-09-10",
    status: "active",
    childPresent: false,
    childUpdated: false,
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Davis",
    dateOfBirth: "2016-11-18",
    gender: "female",
    dateAdmitted: "2021-02-28",
    status: "active",
    childPresent: false,
    childUpdated: true,
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Thompson",
    dateOfBirth: "2013-08-07",
    gender: "male",
    dateAdmitted: "2019-06-14",
    status: "adopted",
    guardianInfo: "Adopted by the Smith family on 2023-01-10",
    childPresent: true,
    childUpdated: false,
  },
];

const ChildrenRecords = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [children, setChildren] = useState<Child[]>(mockChildren);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const filteredChildren = children.filter((child) => {
    const matchesSearch = 
      child.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      child.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || child.status === statusFilter;
    const matchesGender = genderFilter === "all" || child.gender === genderFilter;
    
    return matchesSearch && matchesStatus && matchesGender;
  });

  const handleViewProfile = (child: Child) => {
    setSelectedChild(child);
    setIsProfileModalOpen(true);
  };

  const handleAddChild = () => {
    setSelectedChild(null);
    setIsEditing(false);
    setIsFormModalOpen(true);
  };

  const handleEditChild = (child: Child) => {
    setSelectedChild(child);
    setIsEditing(true);
    setIsFormModalOpen(true);
  };

  const handleDeleteChild = (child: Child) => {
    setSelectedChild(child);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteChild = () => {
    if (selectedChild) {
      setChildren(children.filter(child => child.id !== selectedChild.id));
      toast({
        title: "Child Deleted",
        description: `${selectedChild.firstName} ${selectedChild.lastName}'s record has been deleted.`,
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSaveChild = (childData: Child) => {
    if (isEditing && selectedChild) {
      setChildren(
        children.map(child => 
          child.id === selectedChild.id ? { ...childData } : child
        )
      );
      toast({
        title: "Child Updated",
        description: `${childData.firstName} ${childData.lastName}'s information has been updated.`
      });
    } else {
      setChildren([...children, { ...childData }]);
      toast({
        title: "Child Added",
        description: `${childData.firstName} ${childData.lastName} has been added to the records.`
      });
    }
    setIsFormModalOpen(false);
  };

  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'adopted':
        return 'bg-blue-100 text-blue-800';
      case 'transferred':
        return 'bg-amber-100 text-amber-800';
      case 'graduated':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-orphan-blue">Children Records</h1>
          <p className="text-muted-foreground">Manage and view detailed information for each child</p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-orphan-blue hover:bg-orphan-lightBlue"
          onClick={handleAddChild}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Child
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <ChildrenSearch
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            genderFilter={genderFilter}
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
            onGenderChange={setGenderFilter}
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="grid" className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <p className="text-sm text-muted-foreground">
            Showing {filteredChildren.length} of {children.length} children
          </p>
        </div>

        <TabsContent value="grid">
          <ChildrenGrid 
            children={filteredChildren}
            onViewProfile={handleViewProfile}
            onEditChild={handleEditChild}
            onDeleteChild={handleDeleteChild}
          />
        </TabsContent>

        <TabsContent value="list">
          <ChildrenList 
            children={filteredChildren}
            onViewProfile={handleViewProfile}
            onEditChild={handleEditChild}
            onDeleteChild={handleDeleteChild}
          />
        </TabsContent>
      </Tabs>

      <ChildProfileModal 
        child={selectedChild}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      
      <ChildFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveChild}
        child={isEditing ? selectedChild || undefined : undefined}
      />
      
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteChild}
        child={selectedChild}
      />
    </div>
  );
};

export default ChildrenRecords;
