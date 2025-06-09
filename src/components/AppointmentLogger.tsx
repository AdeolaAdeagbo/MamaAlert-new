
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Plus } from "lucide-react";

interface Appointment {
  id: string;
  hospitalName: string;
  date: string;
  time: string;
  notes: string;
  createdAt: string;
}

interface AppointmentLoggerProps {
  userId: string;
  onAppointmentAdded: (appointment: Appointment) => void;
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
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        hospitalName: appointmentData.hospitalName,
        date: appointmentData.date,
        time: appointmentData.time,
        notes: appointmentData.notes,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const existingAppointments = JSON.parse(
        localStorage.getItem(`appointments-${userId}`) || "[]"
      );
      existingAppointments.push(newAppointment);
      localStorage.setItem(`appointments-${userId}`, JSON.stringify(existingAppointments));

      // Notify parent component
      onAppointmentAdded(newAppointment);

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
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600 flex-1"
                >
                  {isLoading ? "Saving..." : "Save Appointment"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
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
