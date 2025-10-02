import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, Clock, Navigation, MapPin } from "lucide-react";

interface TransportRequest {
  id: string;
  status: "pending" | "assigned" | "on_the_way" | "arrived" | "completed" | "cancelled";
  pickup_location: string;
  destination: string;
  transport_type: string;
  urgency: string;
  driver_name?: string;
  driver_phone?: string;
  vehicle_number?: string;
  created_at: string;
}

interface TransportRequestStatusProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string | null;
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending",
    description: "Waiting for driver assignment",
    color: "bg-yellow-500"
  },
  assigned: {
    icon: CheckCircle2,
    label: "Assigned",
    description: "Driver assigned to your request",
    color: "bg-blue-500"
  },
  on_the_way: {
    icon: Navigation,
    label: "On the Way",
    description: "Driver is heading to pickup location",
    color: "bg-purple-500"
  },
  arrived: {
    icon: MapPin,
    label: "Arrived",
    description: "Driver has arrived at pickup location",
    color: "bg-green-500"
  },
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    description: "Journey completed",
    color: "bg-green-600"
  },
  cancelled: {
    icon: Clock,
    label: "Cancelled",
    description: "Request was cancelled",
    color: "bg-red-500"
  }
};

export const TransportRequestStatus = ({ 
  open, 
  onOpenChange, 
  requestId 
}: TransportRequestStatusProps) => {
  const [request, setRequest] = useState<TransportRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (requestId && open) {
      fetchRequest();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('transport-request-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'transport_requests',
            filter: `id=eq.${requestId}`
          },
          (payload) => {
            const newData = payload.new as any;
            setRequest({
              id: newData.id,
              status: newData.status,
              pickup_location: newData.pickup_location,
              destination: newData.destination,
              transport_type: newData.transport_type,
              urgency: newData.urgency,
              driver_name: newData.driver_name,
              driver_phone: newData.driver_phone,
              vehicle_number: newData.vehicle_number,
              created_at: newData.created_at
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [requestId, open]);

  const fetchRequest = async () => {
    if (!requestId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("transport_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (error) throw error;
      
      if (data) {
        setRequest({
          id: data.id,
          status: data.status as "pending" | "assigned" | "on_the_way" | "arrived" | "completed" | "cancelled",
          pickup_location: data.pickup_location,
          destination: data.destination,
          transport_type: data.transport_type,
          urgency: data.urgency,
          driver_name: data.driver_name || undefined,
          driver_phone: data.driver_phone || undefined,
          vehicle_number: data.vehicle_number || undefined,
          created_at: data.created_at
        });
      }
    } catch (error) {
      console.error("Error fetching transport request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!request && !isLoading) {
    return null;
  }

  const currentStatus = request?.status || "pending";
  const StatusIcon = statusConfig[currentStatus]?.icon || Clock;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transport Request Status</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Status Timeline */}
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-full ${statusConfig[currentStatus]?.color}`}>
                  <StatusIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{statusConfig[currentStatus]?.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {statusConfig[currentStatus]?.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-primary transition-all duration-500"
                  style={{ 
                    width: currentStatus === "pending" ? "25%" :
                           currentStatus === "assigned" ? "50%" :
                           currentStatus === "on_the_way" ? "75%" :
                           currentStatus === "arrived" ? "90%" :
                           "100%"
                  }}
                />
              </div>
            </Card>

            {/* Request Details */}
            <Card className="p-4 space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Pickup Location</p>
                <p className="font-medium">{request?.pickup_location}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Destination</p>
                <p className="font-medium">{request?.destination}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Transport Type</p>
                  <Badge variant="outline" className="mt-1">
                    {request?.transport_type}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Urgency</p>
                  <Badge 
                    variant={request?.urgency === "critical" ? "destructive" : "secondary"}
                    className="mt-1"
                  >
                    {request?.urgency}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Driver Details (if assigned) */}
            {request?.driver_name && (
              <Card className="p-4 space-y-2">
                <h4 className="font-semibold">Driver Details</h4>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Name:</span>{" "}
                    <span className="font-medium">{request.driver_name}</span>
                  </p>
                  {request.driver_phone && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      <span className="font-medium">{request.driver_phone}</span>
                    </p>
                  )}
                  {request.vehicle_number && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Vehicle:</span>{" "}
                      <span className="font-medium">{request.vehicle_number}</span>
                    </p>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
