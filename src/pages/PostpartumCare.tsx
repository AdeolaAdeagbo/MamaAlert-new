import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BreastfeedingTracker } from '@/components/BreastfeedingTracker';
import { InfantHealthMonitor } from '@/components/InfantHealthMonitor';
import { PostpartumMoodTracker } from '@/components/PostpartumMoodTracker';
import { BabyProfileSetup } from '@/components/BabyProfileSetup';
import { Baby, Heart, Activity, Brain } from 'lucide-react';

export default function PostpartumCare() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Postpartum & Baby Care
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive care for new mothers and their babies. Track feeding, health, mood, and development.
          </p>
        </div>

        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto">
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <Baby className="h-4 w-4" />
              <span className="hidden sm:inline">Setup</span>
            </TabsTrigger>
            <TabsTrigger value="feeding" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Feeding</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Health</span>
            </TabsTrigger>
            <TabsTrigger value="mood" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Mood</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup">
            <BabyProfileSetup />
          </TabsContent>

          <TabsContent value="feeding">
            <BreastfeedingTracker />
          </TabsContent>

          <TabsContent value="health">
            <InfantHealthMonitor />
          </TabsContent>

          <TabsContent value="mood">
            <PostpartumMoodTracker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}