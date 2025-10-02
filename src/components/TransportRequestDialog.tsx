import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TransportRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onRequestSubmitted: (requestId: string) => void;
}

export const TransportRequestDialog = ({ 
  open, 
  onOpenChange, 
  userId,
  onRequestSubmitted 
}: TransportRequestDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [destination, setDestination] = useState("");
  const [transportType, setTransportType] = useState<"ambulance" | "private" | "taxi">("ambulance");
  const [urgency, setUrgency] = useState<"critical" | "urgent" | "normal">("critical");
  const [notes, setNotes] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    if (open && !pickupLocation) {
      getLocation();
    }
  }, [open]);

  const getLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setPickupCoords(coords);
          setPickupLocation(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setPickupLocation("Location unavailable");
          setIsLoadingLocation(false);
        }
      );
    } else {
      setPickupLocation("Geolocation not supported");
      setIsLoadingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!destination.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a destination",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("transport_requests")
        .insert({
          user_id: userId,
          pickup_location: pickupLocation,
          pickup_latitude: pickupCoords?.lat,
          pickup_longitude: pickupCoords?.lng,
          destination: destination,
          transport_type: transportType,
          urgency: urgency,
          notes: notes
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Transport Request Sent",
        description: "Your transport request has been submitted successfully",
      });

      onRequestSubmitted(data.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting transport request:", error);
      toast({
        title: "Request Failed",
        description: "Failed to submit transport request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Transport</DialogTitle>
          <DialogDescription>
            Fill in the details for your transport request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pickup">Pickup Location</Label>
            <div className="flex gap-2">
              <Input
                id="pickup"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Current location"
                disabled={isLoadingLocation}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={getLocation}
                disabled={isLoadingLocation}
              >
                {isLoadingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transport-type">Transport Type</Label>
            <Select value={transportType} onValueChange={(value: any) => setTransportType(value)}>
              <SelectTrigger id="transport-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ambulance">Ambulance</SelectItem>
                <SelectItem value="private">Private Vehicle</SelectItem>
                <SelectItem value="taxi">Taxi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency</Label>
            <Select value={urgency} onValueChange={(value: any) => setUrgency(value)}>
              <SelectTrigger id="urgency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions or medical information"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
