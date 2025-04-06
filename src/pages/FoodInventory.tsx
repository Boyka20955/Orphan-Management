
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { FoodItem } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import FoodItemsTable from "@/components/inventory/FoodItemsTable";
import FoodItemFormModal from "@/components/inventory/FoodItemFormModal";
import { Plus, Search, ShoppingCart, AlertTriangle } from "lucide-react";

// Sample data - In a real app, this would come from an API or database
const sampleFoodItems: FoodItem[] = [
  {
    id: "1",
    name: "Rice",
    category: "grain",
    quantity: 25,
    unit: "kg",
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dateReceived: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    supplier: "Local Market",
  },
  {
    id: "2",
    name: "Beans",
    category: "protein",
    quantity: 15,
    unit: "kg",
    expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dateReceived: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    supplier: "Wholesale Supplier",
  },
  {
    id: "3",
    name: "Milk",
    category: "dairy",
    quantity: 3,
    unit: "ltr",
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dateReceived: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    supplier: "Dairy Farm",
  },
  {
    id: "4",
    name: "Wheat Flour",
    category: "grain",
    quantity: 10,
    unit: "kg",
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dateReceived: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    supplier: "Local Mill",
  },
  {
    id: "5",
    name: "Sugar",
    category: "other",
    quantity: 4,
    unit: "kg",
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dateReceived: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    supplier: "Wholesale Supplier",
  },
  {
    id: "6",
    name: "Maize Meal",
    category: "grain",
    quantity: 2,
    unit: "bale",
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dateReceived: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    supplier: "Local Mill",
  },
];

const FoodInventory = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(sampleFoodItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Filter food items based on search query
  const filteredItems = foodItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Count low stock items
  const lowStockItems = foodItems.filter(item => item.quantity < 5).length;

  // Handle adding or updating a food item
  const handleSaveItem = (item: FoodItem) => {
    const isEditing = foodItems.some(i => i.id === item.id);
    
    if (isEditing) {
      setFoodItems(prev => prev.map(i => i.id === item.id ? item : i));
      toast({
        title: "Item Updated",
        description: `${item.name} has been updated in the inventory.`,
      });
    } else {
      setFoodItems(prev => [...prev, item]);
      toast({
        title: "Item Added",
        description: `${item.name} has been added to the inventory.`,
      });
    }
    
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Handle editing a food item
  const handleEditItem = (item: FoodItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Handle deleting a food item
  const handleDeleteItem = (id: string) => {
    setItemToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (itemToDelete) {
      const itemName = foodItems.find(item => item.id === itemToDelete)?.name || "Item";
      setFoodItems(prev => prev.filter(item => item.id !== itemToDelete));
      
      toast({
        title: "Item Deleted",
        description: `${itemName} has been removed from the inventory.`,
      });
      
      setItemToDelete(null);
      setIsConfirmDialogOpen(false);
    }
  };

  // Open modal to add a new item
  const handleAddItem = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Food Inventory</h1>
          <p className="text-muted-foreground">
            Manage food items in the orphanage inventory.
          </p>
        </div>
        
        <div className="flex gap-2">
          {lowStockItems > 0 && (
            <div className="bg-amber-100 text-amber-800 px-3 py-2 rounded-md flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>{lowStockItems} items low in stock</span>
            </div>
          )}
          <Button onClick={handleAddItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add Food Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Items</CardTitle>
            <CardDescription>Current food inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{foodItems.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Low Stock</CardTitle>
            <CardDescription>Items that need replenishing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{lowStockItems}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Categories</CardTitle>
            <CardDescription>Types of food in stock</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {new Set(foodItems.map(item => item.category)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-md p-6 shadow-sm border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Food Items</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <FoodItemsTable 
          items={filteredItems} 
          onEdit={handleEditItem} 
          onDelete={handleDeleteItem} 
        />
      </div>

      {/* Add/Edit Food Item Modal */}
      <FoodItemFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSaveItem}
        item={selectedItem}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              selected food item from the inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FoodInventory;
