
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AppointmentLoggerProps {
  userId: string;
  onAppointmentAdded: () => void;
}

export const AppointmentLogger = ({ userId, onAppointmentAdded }: AppointmentLoggerProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [appointmentData, setAppointmentData] = useState({
    hospitalName: "",
    date: "",
    time: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appointmentData.hospitalName || !appointmentData.date || !appointmentData.time) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Creating appointment for user:', userId);
      
      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: userId,
          hospital_name: appointmentData.hospitalName,
          appointment_date: appointmentData.date,
          appointment_time: appointmentData.time,
          notes: appointmentData.notes || null
        });

      if (error) {
        console.error('Error creating appointment:', error);
        throw error;
      }

      console.log('Appointment created successfully');
      
      // Notify parent component to refresh data
      onAppointmentAdded();

      toast({
        title: "Appointment Logged!",
        description: "Your appointment has been saved successfully.",
      });

      // Reset form and close dialog
      setAppointmentData({
        hospitalName: "",
        date: "",
        time: "",
        notes: ""
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast({
        title: "Error",
        description: "Failed to save appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          Log Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Log Antenatal Appointment
          </DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="hospitalName">Hospital/Clinic Name *</Label>
                <Input
                  id="hospitalName"
                  value={appointmentData.hospitalName}
                  onChange={(e) => setAppointmentData(prev => ({
                    ...prev,
                    hospitalName: e.target.value
                  }))}
                  placeholder="Lagos University Teaching Hospital"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Appointment Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={appointmentData.date}
                    onChange={(e) => setAppointmentData(prev => ({
                      ...prev,
                      date: e.target.value
                    }))}
                    required
                    disabled={isLoading}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={appointmentData.time}
                    onChange={(e) => setAppointmentData(prev => ({
                      ...prev,
                      time: e.target.value
                    }))}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={appointmentData.notes}
                  onChange={(e) => setAppointmentData(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                  placeholder="Any special notes about this appointment..."
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600 flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Appointment"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
