import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Car, Phone, Shield, Edit, Save, X } from 'lucide-react';

interface TransportContact {
  id: string;
  user_id: string;
  driver_name: string;
  phone_number: string;
  vehicle_info?: string;
  notes?: string;
  created_at: string;
}

interface TrustedTransportProps {
  userId: string;
}

export const TrustedTransport = ({ userId }: TrustedTransportProps) => {
  const { toast } = useToast();
  const [transport, setTransport] = useState<TransportContact | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    driver_name: '',
    phone_number: '',
    vehicle_info: '',
    notes: ''
  });

  useEffect(() => {
    fetchTransport();
  }, [userId]);

  const fetchTransport = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trusted_transport')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setTransport(data);
        setFormData({
          driver_name: data.driver_name,
          phone_number: data.phone_number,
          vehicle_info: data.vehicle_info || '',
          notes: data.notes || ''
        });
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error fetching transport:', error);
      toast({
        title: "Error",
        description: "Failed to load transport contact.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveTransport = async () => {
    if (!formData.driver_name || !formData.phone_number) {
      toast({
        title: "Error",
        description: "Driver name and phone number are required.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (transport) {
        const { error } = await supabase
          .from('trusted_transport')
          .update(formData)
          .eq('id', transport.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('trusted_transport')
          .insert({ ...formData, user_id: userId })
          .select()
          .single();

        if (error) throw error;
        setTransport(data);
      }

      setIsEditing(false);
      toast({
        title: "Saved",
        description: "Trusted transport contact saved successfully."
      });
      fetchTransport();
    } catch (error) {
      console.error('Error saving transport:', error);
      toast({
        title: "Error",
        description: "Failed to save transport contact.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200 text-base">
          <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <Car className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          Trusted Transport
          {transport && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="ml-auto text-blue-700 dark:text-blue-300 h-7 w-7 p-0"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isEditing && transport ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2.5 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-sm">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-blue-900 dark:text-blue-100 truncate">{transport.driver_name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Phone className="h-3 w-3 text-blue-600 dark:text-blue-400 shrink-0" />
                  <a href={`tel:${transport.phone_number}`} className="text-xs text-blue-700 dark:text-blue-300 hover:underline truncate">
                    {transport.phone_number}
                  </a>
                </div>
              </div>
            </div>
            
            {transport.vehicle_info && (
              <div className="p-2.5 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-sm">
                <p className="text-xs text-muted-foreground mb-0.5">Vehicle Information</p>
                <p className="text-xs text-foreground">{transport.vehicle_info}</p>
              </div>
            )}
            
            {transport.notes && (
              <div className="p-2.5 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-sm">
                <p className="text-xs text-muted-foreground mb-0.5">Notes</p>
                <p className="text-xs text-foreground">{transport.notes}</p>
              </div>
            )}
            
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 h-8 text-xs"
              onClick={() => window.location.href = `tel:${transport.phone_number}`}
            >
              <Phone className="h-3.5 w-3.5 mr-1.5" />
              Call Transport
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium mb-1.5 block text-blue-900 dark:text-blue-100">Driver Name *</label>
              <Input
                placeholder="Enter driver's name"
                value={formData.driver_name}
                onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                className="bg-white dark:bg-gray-800 h-9 text-sm"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium mb-1.5 block text-blue-900 dark:text-blue-100">Phone Number *</label>
              <Input
                type="tel"
                placeholder="+234..."
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="bg-white dark:bg-gray-800 h-9 text-sm"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium mb-1.5 block text-blue-900 dark:text-blue-100">Vehicle Information</label>
              <Input
                placeholder="e.g., Red Toyota Corolla, Plate: ABC-123"
                value={formData.vehicle_info}
                onChange={(e) => setFormData({ ...formData, vehicle_info: e.target.value })}
                className="bg-white dark:bg-gray-800 h-9 text-sm"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium mb-1.5 block text-blue-900 dark:text-blue-100">Additional Notes</label>
              <Textarea
                placeholder="Any additional information..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-white dark:bg-gray-800 text-sm min-h-[60px]"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={saveTransport} className="flex-1 bg-blue-600 hover:bg-blue-700 h-8 text-xs">
                <Save className="h-3.5 w-3.5 mr-1.5" />
                Save
              </Button>
              {transport && (
                <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1 h-8 text-xs">
                  <X className="h-3.5 w-3.5 mr-1.5" />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
