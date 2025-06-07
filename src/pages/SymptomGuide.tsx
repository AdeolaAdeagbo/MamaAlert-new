
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navigate } from "react-router-dom";
import { Search, AlertTriangle, Info, CheckCircle, Heart } from "lucide-react";

interface SymptomInfo {
  id: string;
  name: string;
  category: "normal" | "monitor" | "emergency";
  description: string;
  whenToWorry: string[];
  selfCare: string[];
  whenToSeekHelp: string;
}

const SymptomGuide = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "normal" | "monitor" | "emergency">("all");

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const symptoms: SymptomInfo[] = [
    {
      id: "1",
      name: "Morning Sickness",
      category: "normal",
      description: "Nausea and vomiting, especially in the first trimester. Affects up to 80% of pregnant women.",
      whenToWorry: [
        "Unable to keep food or fluids down for 24+ hours",
        "Losing weight rapidly",
        "Severe dehydration",
        "Blood in vomit"
      ],
      selfCare: [
        "Eat small, frequent meals",
        "Try ginger tea or supplements",
        "Stay hydrated with small sips",
        "Rest when possible"
      ],
      whenToSeekHelp: "If you can't keep food down for more than 24 hours or show signs of dehydration."
    },
    {
      id: "2",
      name: "Severe Headache",
      category: "emergency",
      description: "Intense, persistent headaches that don't respond to rest or mild pain relief.",
      whenToWorry: [
        "Sudden, severe headache unlike any before",
        "Headache with vision changes",
        "Headache with swelling in face/hands",
        "Headache with high blood pressure"
      ],
      selfCare: [
        "Rest in a dark, quiet room",
        "Apply cold compress to forehead",
        "Stay hydrated",
        "Practice relaxation techniques"
      ],
      whenToSeekHelp: "Immediately if severe, sudden onset, or accompanied by other concerning symptoms."
    },
    {
      id: "3",
      name: "Leg Swelling",
      category: "monitor",
      description: "Mild swelling in feet and ankles is common, especially in later pregnancy.",
      whenToWorry: [
        "Sudden, severe swelling",
        "Swelling in face and hands",
        "Swelling with headache",
        "One leg more swollen than the other"
      ],
      selfCare: [
        "Elevate legs when sitting/lying",
        "Wear compression stockings",
        "Stay hydrated",
        "Avoid standing for long periods"
      ],
      whenToSeekHelp: "If swelling is sudden, severe, or accompanied by other symptoms like headache."
    },
    {
      id: "4",
      name: "Heavy Bleeding",
      category: "emergency",
      description: "Any heavy bleeding during pregnancy requires immediate medical attention.",
      whenToWorry: [
        "Soaking a pad in an hour",
        "Bleeding with severe cramping",
        "Bleeding with tissue passage",
        "Any bleeding in later pregnancy"
      ],
      selfCare: [
        "Call emergency services immediately",
        "Lie down and rest",
        "Keep track of blood loss",
        "Stay calm and get to hospital"
      ],
      whenToSeekHelp: "Immediately - call emergency services or go to nearest hospital."
    },
    {
      id: "5",
      name: "Back Pain",
      category: "normal",
      description: "Lower back pain is common as your body changes and grows during pregnancy.",
      whenToWorry: [
        "Severe, sudden back pain",
        "Back pain with fever",
        "Pain radiating to legs",
        "Pain with urinary symptoms"
      ],
      selfCare: [
        "Use proper posture",
        "Wear supportive shoes",
        "Sleep with pillow support",
        "Gentle stretching exercises"
      ],
      whenToSeekHelp: "If pain is severe, sudden, or accompanied by other concerning symptoms."
    },
    {
      id: "6",
      name: "Shortness of Breath",
      category: "monitor",
      description: "Mild shortness of breath is normal as your growing baby puts pressure on your diaphragm.",
      whenToWorry: [
        "Sudden, severe breathing difficulty",
        "Chest pain with breathing",
        "Blue lips or fingernails",
        "Inability to complete sentences"
      ],
      selfCare: [
        "Sit up straight to expand lungs",
        "Sleep propped up with pillows",
        "Take frequent breaks",
        "Practice breathing exercises"
      ],
      whenToSeekHelp: "Immediately if breathing becomes severely difficult or is accompanied by chest pain."
    }
  ];

  const filteredSymptoms = symptoms.filter(symptom => {
    const matchesSearch = symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         symptom.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || symptom.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "normal":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "monitor":
        return <Info className="h-4 w-4 text-yellow-500" />;
      case "emergency":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "normal":
        return "bg-green-100 text-green-800 border-green-200";
      case "monitor":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "emergency":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Heart className="h-8 w-8 text-rose-500" />
            Pregnancy Symptom Guide
          </h1>
          <p className="text-muted-foreground">
            Understand common pregnancy symptoms and learn when to seek medical attention.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Badge 
              variant={selectedCategory === "all" ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/80"
              onClick={() => setSelectedCategory("all")}
            >
              All Symptoms
            </Badge>
            <Badge 
              variant={selectedCategory === "normal" ? "default" : "outline"}
              className={`cursor-pointer ${selectedCategory === "normal" ? "bg-green-500 hover:bg-green-600" : ""}`}
              onClick={() => setSelectedCategory("normal")}
            >
              Normal
            </Badge>
            <Badge 
              variant={selectedCategory === "monitor" ? "default" : "outline"}
              className={`cursor-pointer ${selectedCategory === "monitor" ? "bg-yellow-500 hover:bg-yellow-600" : ""}`}
              onClick={() => setSelectedCategory("monitor")}
            >
              Monitor
            </Badge>
            <Badge 
              variant={selectedCategory === "emergency" ? "default" : "outline"}
              className={`cursor-pointer ${selectedCategory === "emergency" ? "bg-red-500 hover:bg-red-600" : ""}`}
              onClick={() => setSelectedCategory("emergency")}
            >
              Emergency
            </Badge>
          </div>
        </div>

        {/* Symptoms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSymptoms.map((symptom) => (
            <Card key={symptom.id} className={`border-l-4 ${
              symptom.category === "emergency" ? "border-l-red-500" :
              symptom.category === "monitor" ? "border-l-yellow-500" :
              "border-l-green-500"
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getCategoryIcon(symptom.category)}
                    {symptom.name}
                  </CardTitle>
                  <Badge className={getCategoryColor(symptom.category)}>
                    {symptom.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{symptom.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2 text-red-600">⚠️ When to worry:</h4>
                  <ul className="text-sm space-y-1">
                    {symptom.whenToWorry.map((worry, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{worry}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2 text-green-600">💚 Self-care tips:</h4>
                  <ul className="text-sm space-y-1">
                    {symptom.selfCare.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`p-3 rounded-lg ${
                  symptom.category === "emergency" ? "bg-red-50 border border-red-200" :
                  symptom.category === "monitor" ? "bg-yellow-50 border border-yellow-200" :
                  "bg-green-50 border border-green-200"
                }`}>
                  <h4 className="font-medium text-sm mb-1">🏥 When to seek help:</h4>
                  <p className="text-sm">{symptom.whenToSeekHelp}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSymptoms.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No symptoms found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or category filter.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Emergency Disclaimer */}
        <Card className="mt-8 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />
              <div>
                <h3 className="font-medium text-red-800 mb-2">Important Medical Disclaimer</h3>
                <p className="text-sm text-red-700">
                  This guide is for educational purposes only and should not replace professional medical advice. 
                  Always consult with your healthcare provider about any symptoms or concerns during pregnancy. 
                  In case of emergency, call your local emergency number immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SymptomGuide;
