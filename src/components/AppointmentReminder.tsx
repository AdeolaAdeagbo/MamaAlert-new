
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Bell, Phone, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

interface AppointmentReminderProps {
  userId: string;
}

type Appointment = Tables<'appointments'>;

export const AppointmentReminder = ({ userId }: AppointmentReminderProps) => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<string>("");
  const [feedback, setFeedback] = useState("");

  const [reminderData, setReminderData] = useState({
    hospitalName: "",
    date: "",
    time: "",
    notes: "",
    phoneNumber: ""
  });

  useEffect(() => {
    loadAppointments();
    checkReminders();
  }, [userId]);

  const loadAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId)
        .gte('appointment_date', new Date().toISOString().split('T')[0])
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const checkReminders = async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const { data: tomorrowAppointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId)
        .eq('appointment_date', tomorrowStr)
        .eq('reminder_sent', false);

      if (tomorrowAppointments && tomorrowAppointments.length > 0) {
        // Send reminders for tomorrow's appointments
        for (const appointment of tomorrowAppointments) {
          await sendAppointmentReminder(appointment);
        }
      }
    } catch (error) {
      console.error('Error checking reminders:', error);
    }
  };

  const sendAppointmentReminder = async (appointment: Appointment) => {
    try {
      // Get user profile for phone number
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone')
        .eq('id', userId)
        .single();

      if (!profile?.phone) {
        console.log('No phone number found for user');
        return;
      }

      const userName = `${profile.first_name} ${profile.last_name}`.trim();
      const message = `APPOINTMENT REMINDER

Hello ${userName},

You have an antenatal appointment tomorrow:

Date: ${new Date(appointment.appointment_date).toLocaleDateString()}
Time: ${appointment.appointment_time}
Hospital: ${appointment.hospital_name}

Please remember to bring your antenatal card and arrive 15 minutes early.

From MamaAlert - Your Pregnancy Companion`;

      const { error: smsError } = await supabase.functions.invoke('send-termii-sms', {
        body: {
          phoneNumber: profile.phone,
          message,
          userName,
          messageType: "appointment"
        }
      });

      if (smsError) {
        console.error('SMS sending failed:', smsError);
      } else {
        // Mark reminder as sent
        await supabase
          .from('appointments')
          .update({ reminder_sent: true })
          .eq('id', appointment.id);

        console.log(`Reminder sent for appointment ${appointment.id}`);
      }
    } catch (error) {
      console.error('Error sending appointment reminder:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: userId,
          hospital_name: reminderData.hospitalName,
          appointment_date: reminderData.date,
          appointment_time: reminderData.time,
          notes: reminderData.notes,
          reminder_sent: false
        });

      if (error) throw error;

      toast({
        title: "Appointment Added!",
        description: "You'll receive an SMS reminder 1 day before your appointment.",
      });

      setReminderData({
        hospitalName: "",
        date: "",
        time: "",
        notes: "",
        phoneNumber: ""
      });
      setIsOpen(false);
      loadAppointments();
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast({
        title: "Error",
        description: "Failed to save appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // You can create a feedback table or add feedback column to appointments
      await supabase
        .from('appointments')
        .update({ 
          notes: `${appointments.find(a => a.id === selectedAppointment)?.notes || ''}\n\nFeedback: ${feedback}` 
        })
        .eq('id', selectedAppointment);

      toast({
        title: "Feedback Saved",
        description: "Thank you for your feedback!",
      });

      setFeedback("");
      setFeedbackOpen(false);
      loadAppointments();
    } catch (error) {
      console.error('Error saving feedback:', error);
      toast({
        title: "Error",
        description: "Failed to save feedback.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              Appointment Reminders
            </CardTitle>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Add Appointment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Appointment Reminder</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="hospitalName">Hospital/Clinic Name *</Label>
                    <Input
                      id="hospitalName"
                      value={reminderData.hospitalName}
                      onChange={(e) => setReminderData(prev => ({
                        ...prev,
                        hospitalName: e.target.value
                      }))}
                      placeholder="Lagos University Teaching Hospital"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={reminderData.date}
                        onChange={(e) => setReminderData(prev => ({
                          ...prev,
                          date: e.target.value
                        }))}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <Label htmlFor="time">Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={reminderData.time}
                        onChange={(e) => setReminderData(prev => ({
                          ...prev,
                          time: e.target.value
                        }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={reminderData.notes}
                      onChange={(e) => setReminderData(prev => ({
                        ...prev,
                        notes: e.target.value
                      }))}
                      placeholder="Any special notes about this appointment..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Set Reminder"
                      )}
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
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{appointment.hospital_name}</h4>
                    <div className="flex gap-2">
                      <span className="text-sm text-muted-foreground">
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {appointment.appointment_time}
                      </span>
                    </div>
                  </div>
                  
                  {appointment.notes && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {appointment.notes}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded ${
                      appointment.reminder_sent 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {appointment.reminder_sent ? 'Reminder Sent' : 'Reminder Pending'}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAppointment(appointment.id);
                        setFeedbackOpen(true);
                      }}
                    >
                      Add Feedback
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming appointments scheduled.</p>
              <p className="text-xs mt-2">Add an appointment to receive SMS reminders.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Feedback</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div>
              <Label htmlFor="feedback">How was your appointment?</Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Please share your experience with this appointment..."
                rows={4}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Save Feedback
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFeedbackOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
