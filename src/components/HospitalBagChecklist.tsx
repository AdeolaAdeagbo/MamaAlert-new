import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { usePregnancyProgress } from "@/hooks/usePregnancyProgress";
import { Luggage, Baby, User, Heart, CheckCircle } from "lucide-react";

interface ChecklistItem {
  id: string;
  name: string;
  category: 'mom' | 'baby' | 'partner' | 'documents';
  essential: boolean;
  isChecked: boolean;
}

interface HospitalBagChecklistProps {
  userId: string;
}

export const HospitalBagChecklist = ({ userId }: HospitalBagChecklistProps) => {
  const { pregnancyData, currentWeek } = usePregnancyProgress(userId);
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);
  
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    // Mom items
    { id: '1', name: 'Comfortable nightgowns or pajamas', category: 'mom', essential: true, isChecked: false },
    { id: '2', name: 'Nursing bras (2-3)', category: 'mom', essential: true, isChecked: false },
    { id: '3', name: 'Comfortable underwear (disposable)', category: 'mom', essential: true, isChecked: false },
    { id: '4', name: 'Comfortable going-home outfit', category: 'mom', essential: true, isChecked: false },
    { id: '5', name: 'Toiletries and personal care items', category: 'mom', essential: true, isChecked: false },
    { id: '6', name: 'Phone charger', category: 'mom', essential: true, isChecked: false },
    { id: '7', name: 'Lip balm and lotion', category: 'mom', essential: false, isChecked: false },
    { id: '8', name: 'Hair ties and headband', category: 'mom', essential: false, isChecked: false },

    // Baby items
    { id: '9', name: 'Going-home outfit (newborn & 0-3 months)', category: 'baby', essential: true, isChecked: false },
    { id: '10', name: 'Car seat (must have to leave hospital)', category: 'baby', essential: true, isChecked: false },
    { id: '11', name: 'Blanket for going home', category: 'baby', essential: true, isChecked: false },
    { id: '12', name: 'Baby mittens', category: 'baby', essential: false, isChecked: false },
    { id: '13', name: 'Burp cloths', category: 'baby', essential: false, isChecked: false },

    // Partner items
    { id: '14', name: 'Change of clothes', category: 'partner', essential: true, isChecked: false },
    { id: '15', name: 'Snacks and drinks', category: 'partner', essential: true, isChecked: false },
    { id: '16', name: 'Camera or phone for photos', category: 'partner', essential: false, isChecked: false },

    // Documents
    { id: '17', name: 'Hospital registration paperwork', category: 'documents', essential: true, isChecked: false },
    { id: '18', name: 'Insurance cards', category: 'documents', essential: true, isChecked: false },
    { id: '19', name: 'ID/Driver\'s license', category: 'documents', essential: true, isChecked: false },
    { id: '20', name: 'Birth plan (if you have one)', category: 'documents', essential: false, isChecked: false },
  ]);

  const isReadyToPack = currentWeek >= 35;

  const toggleItem = (itemId: string) => {
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, isChecked: !item.isChecked }
          : item
      )
    );
  };

  const getProgress = () => {
    const essentialItems = checklistItems.filter(item => item.essential);
    const checkedEssentialItems = essentialItems.filter(item => item.isChecked);
    return {
      essential: {
        completed: checkedEssentialItems.length,
        total: essentialItems.length,
        percentage: Math.round((checkedEssentialItems.length / essentialItems.length) * 100)
      },
      all: {
        completed: checklistItems.filter(item => item.isChecked).length,
        total: checklistItems.length,
        percentage: Math.round((checklistItems.filter(item => item.isChecked).length / checklistItems.length) * 100)
      }
    };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mom': return <User className="h-4 w-4" />;
      case 'baby': return <Baby className="h-4 w-4" />;
      case 'partner': return <Heart className="h-4 w-4" />;
      case 'documents': return <CheckCircle className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mom': return 'text-pink-600 dark:text-pink-400';
      case 'baby': return 'text-blue-600 dark:text-blue-400';
      case 'partner': return 'text-green-600 dark:text-green-400';
      case 'documents': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const progress = getProgress();

  if (!isReadyToPack) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <Luggage className="h-12 w-12 text-blue-500 mx-auto" />
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">Hospital Bag Checklist</h3>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              Start packing from week 35. Currently at week {currentWeek}.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const categories = [
    { key: 'documents', name: 'Documents & Paperwork', color: 'purple' },
    { key: 'mom', name: 'For Mom', color: 'pink' },
    { key: 'baby', name: 'For Baby', color: 'blue' },
    { key: 'partner', name: 'For Partner/Support Person', color: 'green' },
  ];

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
          <Luggage className="h-5 w-5" />
          Hospital Bag Checklist
          <Badge variant="secondary" className="ml-auto">
            Week {currentWeek}
          </Badge>
        </CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-purple-700 dark:text-purple-300">
            <span>Essential Items</span>
            <span className="font-medium">{progress.essential.completed}/{progress.essential.total}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${progress.essential.percentage}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {progress.all.completed}/{progress.all.total} total items packed ({progress.all.percentage}%)
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full mt-2 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
          >
            {showDetails ? "Hide Details" : "Show More"}
          </Button>
        </div>
      </CardHeader>
      {showDetails && (
        <CardContent className="space-y-6">
          {categories.map((category) => {
          const categoryItems = checklistItems.filter(item => item.category === category.key);
          const checkedItems = categoryItems.filter(item => item.isChecked).length;
          
          return (
            <div key={category.key} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={getCategoryColor(category.key)}>
                  {getCategoryIcon(category.key)}
                </div>
                <h4 className="font-medium text-sm">{category.name}</h4>
                <Badge variant="outline" className="text-xs">
                  {checkedItems}/{categoryItems.length}
                </Badge>
              </div>
              
              <div className="space-y-2 ml-6">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <Checkbox
                      id={item.id}
                      checked={item.isChecked}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="flex-shrink-0"
                    />
                    <label
                      htmlFor={item.id}
                      className={`text-sm flex-1 cursor-pointer ${
                        item.isChecked ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {item.name}
                      {item.essential && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Essential
                        </Badge>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {progress.essential.percentage === 100 && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <CheckCircle className="h-4 w-4" />
              <span className="font-semibold text-sm">Ready for Delivery!</span>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              All essential items are packed. Your hospital bag is ready!
            </p>
          </div>
        )}

          <p className="text-xs text-muted-foreground text-center">
            Pack your hospital bag by week 37. Keep it ready for when labor begins.
          </p>
        </CardContent>
      )}
    </Card>
  );
};