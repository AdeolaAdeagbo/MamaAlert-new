import { useState } from 'react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { MoreVertical, Car } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { TrustedTransport } from './TrustedTransport';

interface OptionsMenuProps {
  userId: string;
}

export const OptionsMenu = ({ userId }: OptionsMenuProps) => {
  const [showTransport, setShowTransport] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => setShowTransport(true)}>
            <Car className="h-4 w-4 mr-2" />
            Trusted Transport
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showTransport} onOpenChange={setShowTransport}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Trusted Transport</DialogTitle>
          </DialogHeader>
          <TrustedTransport userId={userId} />
        </DialogContent>
      </Dialog>
    </>
  );
};
