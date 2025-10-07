import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Video, Newspaper } from "lucide-react";

export const LearnAndGrow = () => {
  const resources = [
    {
      id: 1,
      type: "video",
      title: "Prenatal Yoga Basics",
      description: "Gentle exercises for a healthy pregnancy",
      thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop",
      icon: Video,
    },
    {
      id: 2,
      type: "article",
      title: "Nutrition During Pregnancy",
      description: "Essential nutrients for you and baby",
      thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=225&fit=crop",
      icon: BookOpen,
    },
    {
      id: 3,
      type: "news",
      title: "MamaAlert Updates",
      description: "New features and community news",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop",
      icon: Newspaper,
    },
  ];

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Learn & Grow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {resources.map((resource) => {
          const Icon = resource.icon;
          return (
            <div 
              key={resource.id}
              className="flex gap-3 p-3 rounded-2xl bg-secondary/50 hover:bg-secondary native-transition cursor-pointer touch-target active:scale-98"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                <img 
                  src={resource.thumbnail} 
                  alt={resource.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-start p-2">
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-foreground mb-1 truncate">
                  {resource.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {resource.description}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
