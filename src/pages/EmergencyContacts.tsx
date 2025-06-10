
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { Phone, Plus, Trash2, Edit, UserPlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

const EmergencyContacts = () => {
  const { user, refreshUserData } = useAuth();
  const { toast } = useToast();
  
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: ""
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    loadEmergencyContacts();
  }, [user.id]);

  const loadEmergencyContacts = async () => {
    try {
      console.log('Loading emergency contacts for user:', user.id);
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading emergency contacts:', error);
        toast({
          title: "Error Loading Contacts",
          description: "Could not load your emergency contacts. Please try again.",
          variant: "destructive"
        });
        return;
      }

      console.log('Loaded emergency contacts:', data);
      setContacts(data || []);
    } catch (error) {
      console.error('Exception loading emergency contacts:', error);
      toast({
        title: "Error",
        description: "Failed to load emergency contacts.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.relationship || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    try {
      if (editingId) {
        // Update existing contact
        console.log('Updating emergency contact:', editingId);
        const { error } = await supabase
          .from('emergency_contacts')
          .update({
            name: formData.name,
            relationship: formData.relationship,
            phone: formData.phone,
            email: formData.email || null
          })
          .eq('id', editingId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating emergency contact:', error);
          throw error;
        }

        toast({
          title: "Contact Updated",
          description: "Emergency contact has been updated successfully.",
        });
      } else {
        // Create new contact
        console.log('Creating new emergency contact');
        const { error } = await supabase
          .from('emergency_contacts')
          .insert({
            user_id: user.id,
            name: formData.name,
            relationship: formData.relationship,
            phone: formData.phone,
            email: formData.email || null
          });

        if (error) {
          console.error('Error creating emergency contact:', error);
          throw error;
        }

        toast({
          title: "Contact Added",
          description: "New emergency contact has been added successfully.",
        });
      }

      // Reload contacts and refresh user data
      await loadEmergencyContacts();
      await refreshUserData();
      
      // Reset form
      setFormData({ name: "", relationship: "", phone: "", email: "" });
      setIsAdding(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving emergency contact:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save emergency contact. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (contact: EmergencyContact) => {
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      email: contact.email || ""
    });
    setEditingId(contact.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('Deleting emergency contact:', id);
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting emergency contact:', error);
        throw error;
      }

      toast({
        title: "Contact Removed",
        description: "Emergency contact has been removed.",
      });

      // Reload contacts and refresh user data
      await loadEmergencyContacts();
      await refreshUserData();
    } catch (error) {
      console.error('Error deleting emergency contact:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete emergency contact. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading emergency contacts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Emergency Contacts</h1>
          <p className="text-muted-foreground">
            Manage your emergency contacts. These people will be notified when you trigger an emergency alert.
          </p>
        </div>

        {/* Add Contact Button */}
        <div className="mb-6">
          <Button 
            onClick={() => setIsAdding(true)} 
            className="bg-rose-500 hover:bg-rose-600"
            disabled={isAdding}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Emergency Contact
          </Button>
        </div>

        {/* Add/Edit Contact Form */}
        {isAdding && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingId ? "Edit Contact" : "Add New Emergency Contact"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      disabled={isSaving}
                    />
                  </div>
                  <div>
                    <Label htmlFor="relationship">Relationship *</Label>
                    <Input
                      id="relationship"
                      value={formData.relationship}
                      onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                      placeholder="e.g., Husband, Doctor, Sister"
                      required
                      disabled={isSaving}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+234 xxx xxx xxxx"
                      required
                      disabled={isSaving}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={isSaving}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    className="bg-rose-500 hover:bg-rose-600"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {editingId ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      editingId ? "Update Contact" : "Add Contact"
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAdding(false);
                      setEditingId(null);
                      setFormData({ name: "", relationship: "", phone: "", email: "" });
                    }}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Contacts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="border-rose-100">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{contact.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(contact)}
                      disabled={isSaving}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={isSaving}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{contact.relationship}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-rose-500" />
                    <span className="text-sm">{contact.phone}</span>
                  </div>
                  {contact.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{contact.email}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {contacts.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Phone className="h-12 w-12 mx-auto mb-4 text-rose-500 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Emergency Contacts</h3>
              <p className="text-muted-foreground mb-4">
                Add your first emergency contact to receive alerts in case of emergency.
              </p>
              <Button onClick={() => setIsAdding(true)} className="bg-rose-500 hover:bg-rose-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Contact
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmergencyContacts;
