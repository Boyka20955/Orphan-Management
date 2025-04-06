
import { Child } from "@/types";

interface ChildSelectorProps {
  children: Child[];
  selectedChildId: string | null;
  onSelectChild: (childId: string) => void;
}

const ChildSelector = ({ children, selectedChildId, onSelectChild }: ChildSelectorProps) => {
  return (
    <div className="p-2 max-h-60 overflow-y-auto">
      <div className="text-sm font-medium mb-2 px-2">Select a child to filter records</div>
      <div className="flex flex-wrap gap-2">
        {children.map((child) => (
          <div
            key={child.id}
            className={`px-3 py-1.5 rounded-full cursor-pointer flex items-center text-xs ${
              selectedChildId === child.id
                ? "bg-primary/10 text-primary border border-primary/30"
                : "bg-muted/50 hover:bg-muted border border-transparent"
            }`}
            onClick={() => onSelectChild(child.id)}
          >
            <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center flex-shrink-0 mr-1.5">
              {child.firstName.charAt(0)}
            </div>
            <span>
              {child.firstName} {child.lastName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChildSelector;
