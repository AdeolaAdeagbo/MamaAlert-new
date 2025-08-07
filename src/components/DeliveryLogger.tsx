import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMode } from '@/contexts/ModeContext';
import { Baby, Calendar } from 'lucide-react';

interface DeliveryLoggerProps {
  trigger?: React.ReactNode;
}

export const DeliveryLogger = ({ trigger }: DeliveryLoggerProps) => {
  const { switchToPostpartum, isLoading } = useMode();
  const [deliveryDate, setDeliveryDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryDate) return;

    await switchToPostpartum(deliveryDate);
    setIsOpen(false);
    setDeliveryDate('');
  };

  const defaultTrigger = (
    <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
      <Baby className="h-4 w-4 mr-2" />
      I've Given Birth!
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5 text-pink-500" />
            Congratulations on Your Baby! 🎉
          </DialogTitle>
        </DialogHeader>
        <Card className="border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="deliveryDate" className="text-pink-700">
                  When did you give birth?
                </Label>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="h-4 w-4 text-pink-500" />
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    required
                    className="border-pink-200 focus:border-pink-400"
                  />
                </div>
              </div>
              
              <div className="text-sm text-pink-600 bg-pink-50 p-3 rounded-lg border border-pink-200">
                <p className="font-medium mb-1">This will switch you to postpartum care mode:</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Breastfeeding guidance and tracking</li>
                  <li>Baby immunization schedule</li>
                  <li>Infant health monitoring</li>
                  <li>Postpartum mood tracking</li>
                  <li>Baby milestone tracking</li>
                </ul>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  className="border-pink-200 text-pink-700 hover:bg-pink-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || !deliveryDate}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  {isLoading ? 'Updating...' : 'Switch to Postpartum Care'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};