
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { Phone, Plus, Trash2, Edit, UserPlus } from "lucide-react";

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

const EmergencyContacts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Mock emergency contacts data
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: "1",
      name: "Dr. Adebayo",
      relationship: "Primary Doctor",
      phone: "+234 803 123 4567",
      email: "dr.adebayo@hospital.com"
    },
    {
      id: "2", 
      name: "Husband - Michael",
      relationship: "Spouse",
      phone: "+234 809 876 5432",
      email: "michael@email.com"
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: ""
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setContacts(contacts.map(contact => 
        contact.id === editingId 
          ? { ...contact, ...formData }
          : contact
      ));
      setEditingId(null);
      toast({
        title: "Contact Updated",
        description: "Emergency contact has been updated successfully.",
      });
    } else {
      const newContact: EmergencyContact = {
        id: Date.now().toString(),
        ...formData
      };
      setContacts([...contacts, newContact]);
      toast({
        title: "Contact Added",
        description: "New emergency contact has been added successfully.",
      });
    }
    
    setFormData({ name: "", relationship: "", phone: "", email: "" });
    setIsAdding(false);
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

  const handleDelete = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast({
      title: "Contact Removed",
      description: "Emergency contact has been removed.",
    });
  };

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
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" className="bg-rose-500 hover:bg-rose-600">
                    {editingId ? "Update Contact" : "Add Contact"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAdding(false);
                      setEditingId(null);
                      setFormData({ name: "", relationship: "", phone: "", email: "" });
                    }}
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
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-600 hover:text-red-700"
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
