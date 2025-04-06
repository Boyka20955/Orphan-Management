import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Shirt, 
  ShoppingBag, 
  Plus, 
  Search, 
  User,
  Filter
} from "lucide-react";
import { ClothingItem, Child } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ClothingItemFormModal from "@/components/inventory/ClothingItemFormModal";
import ClothingItemsGrid from "@/components/inventory/ClothingItemsGrid";
import ClothingItemsTable from "@/components/inventory/ClothingItemsTable";
import AssignClothingModal from "@/components/inventory/AssignClothingModal";

// Mock data (replace with API call in production)
const mockChildren: Child[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "2015-05-15",
    gender: "male",
    dateAdmitted: "2020-01-10",
    status: "active"
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    dateOfBirth: "2018-02-20",
    gender: "female",
    dateAdmitted: "2020-03-15",
    status: "active"
  }
];

const mockClothingItems: ClothingItem[] = [
  {
    id: "1",
    name: "Blue T-Shirt",
    category: "shirt",
    type: "shirt",
    size: "M (8-10y)",
    quantity: 5,
    condition: "new",
    dateReceived: "2023-05-15",
    gender: "unisex",
    assignedTo: [],
    ageRange: "8-10"
  },
  {
    id: "2",
    name: "Black Shoes",
    category: "shoes",
    type: "shoes",
    size: "32 EU",
    quantity: 3,
    condition: "good",
    dateReceived: "2023-02-10",
    gender: "unisex",
    assignedTo: ["1"],
    ageRange: "6-8"
  }
];

const ClothingInventory = () => {
  const { toast } = useToast();
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>(mockClothingItems);
  const [children, setChildren] = useState<Child[]>(mockChildren);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [activeView, setActiveView] = useState("grid");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredItems = clothingItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.type && item.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.size.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = !activeFilter || 
                         (item.type && item.type === activeFilter) || 
                         item.category === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleAddItem = (newItem: ClothingItem) => {
    // Ensure assignedTo is an array
    const assignedTo = Array.isArray(newItem.assignedTo) ? newItem.assignedTo : [];
    
    setClothingItems(prev => [
      ...prev, 
      { 
        ...newItem, 
        id: Date.now().toString(),
        assignedTo
      }
    ]);
    
    toast({
      title: "Success",
      description: "Clothing item has been added.",
    });
    setShowAddModal(false);
  };

  const handleUpdateItem = (updatedItem: ClothingItem) => {
    // Ensure assignedTo is an array
    const assignedTo = Array.isArray(updatedItem.assignedTo) ? updatedItem.assignedTo : [];
    
    setClothingItems(prev => 
      prev.map(item => item.id === updatedItem.id ? { ...updatedItem, assignedTo } : item)
    );
    
    toast({
      title: "Success",
      description: "Clothing item has been updated.",
    });
    setShowAddModal(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    setClothingItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Success",
      description: "Clothing item has been deleted.",
    });
  };

  const handleEditClick = (item: ClothingItem) => {
    setSelectedItem(item);
    setShowAddModal(true);
  };

  const handleAssignClick = (item: ClothingItem) => {
    setSelectedItem(item);
    setShowAssignModal(true);
  };

  const handleAssignToChildren = (itemId: string, childIds: string[]) => {
    setClothingItems(prev => 
      prev.map(item => {
        if (item.id === itemId) {
          return { 
            ...item, 
            assignedTo: childIds, 
            quantity: Math.max(item.quantity - childIds.length, 0) 
          };
        }
        return item;
      })
    );
    
    toast({
      title: "Success",
      description: `Clothing item has been assigned to ${childIds.length} children.`,
    });
    
    setShowAssignModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <ShoppingBag className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Clothing Inventory</h1>
        </div>
        <Button onClick={() => { setSelectedItem(null); setShowAddModal(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clothingItems.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clothingItems.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Items Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clothingItems.reduce((sum, item) => {
                const assignedCount = Array.isArray(item.assignedTo) ? item.assignedTo.length : 0;
                return sum + assignedCount;
              }, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              {activeFilter ? `Filter: ${activeFilter}` : "Filter by type"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setActiveFilter(null)}>
              All Items
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter("shirt")}>
              Shirts
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter("pants")}>
              Pants
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter("shoes")}>
              Shoes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveFilter("jacket")}>
              Jackets
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Tabs value={activeView} onValueChange={setActiveView} className="w-[200px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-6">
        {activeView === "grid" ? (
          <ClothingItemsGrid 
            items={filteredItems} 
            onEdit={handleEditClick} 
            onDelete={handleDeleteItem} 
            onAssign={handleAssignClick}
            children={children}
          />
        ) : (
          <ClothingItemsTable 
            items={filteredItems} 
            onEdit={handleEditClick} 
            onDelete={handleDeleteItem} 
            onAssign={handleAssignClick}
            children={children}
          />
        )}
      </div>

      {showAddModal && (
        <ClothingItemFormModal
          isOpen={showAddModal}
          onClose={() => { setShowAddModal(false); setSelectedItem(null); }}
          onSave={selectedItem ? handleUpdateItem : handleAddItem}
          item={selectedItem}
        />
      )}

      {showAssignModal && selectedItem && (
        <AssignClothingModal
          isOpen={showAssignModal}
          onClose={() => { setShowAssignModal(false); setSelectedItem(null); }}
          onAssign={(childIds) => handleAssignToChildren(selectedItem.id, childIds)}
          item={selectedItem}
          children={children}
          alreadyAssignedTo={Array.isArray(selectedItem.assignedTo) ? selectedItem.assignedTo : []}
        />
      )}
    </div>
  );
};

export default ClothingInventory;
