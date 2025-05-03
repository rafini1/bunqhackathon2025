import React from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type ActionType = 'block' | 'unblock' | 'request' | 'savings' | 'navigate';

interface ActionDetails {
  type: ActionType;
  destination?: string;
  accountName?: string;
  amount?: string;
  currency?: string;
  recipient?: string;
}

interface ActionConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionDetails: ActionDetails;
}

export function ActionConfirmation({ 
  isOpen, 
  onClose, 
  onConfirm, 
  actionDetails 
}: ActionConfirmationProps) {
  const { type, destination, accountName, amount, currency, recipient } = actionDetails;
  
  // Generate appropriate title based on action type
  const getTitleForActionType = (): string => {
    switch (type) {
      case 'block': return 'Confirm Card Blocking';
      case 'unblock': return 'Confirm Card Unblocking';
      case 'request': return 'Confirm Money Request';
      case 'savings': return 'Confirm New Savings Account';
      case 'navigate': return 'Confirm Navigation';
      default: return 'Confirm Action';
    }
  };
  
  // Generate appropriate description based on action type
  const getDescriptionForActionType = (): React.ReactNode => {
    switch (type) {
      case 'block':
        return (
          <div className="space-y-4 py-2">
            <p>Are you sure you want to block your card?</p>
            <p className="text-muted-foreground text-sm">This will prevent any new transactions from being processed on your card.</p>
          </div>
        );
      
      case 'unblock':
        return (
          <div className="space-y-4 py-2">
            <p>Are you sure you want to unblock your card?</p>
            <p className="text-muted-foreground text-sm">This will allow new transactions to be processed on your card.</p>
          </div>
        );
      
      case 'request':
        return (
          <div className="space-y-4 py-2">
            {amount && currency && recipient ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Request Amount:</span>
                  <span className="font-medium">{amount} {currency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">From:</span>
                  <span className="font-medium">{recipient}</span>
                </div>
                <div className="h-px bg-border my-2"></div>
                <p>Are you sure you want to send this money request?</p>
              </>
            ) : (
              <p>Would you like to create a new money request?</p>
            )}
          </div>
        );
      
      case 'savings':
        return (
          <div className="space-y-4 py-2">
            {accountName ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Account Name:</span>
                  <span className="font-medium">{accountName}</span>
                </div>
                <div className="h-px bg-border my-2"></div>
                <p>Are you sure you want to open a new savings account?</p>
              </>
            ) : (
              <p>Would you like to open a new savings account?</p>
            )}
          </div>
        );
      
      case 'navigate':
        return (
          <div className="space-y-4 py-2">
            {destination ? (
              <>
                <p>Would you like to navigate to {destination}?</p>
              </>
            ) : (
              <p>Would you like to navigate to this page?</p>
            )}
          </div>
        );
      
      default:
        return <p>Would you like to confirm this action?</p>;
    }
  };
  
  // Generate appropriate confirm button text based on action type
  const getConfirmButtonTextForActionType = (): string => {
    switch (type) {
      case 'block': return 'Block Card';
      case 'unblock': return 'Unblock Card';
      case 'request': return 'Send Request';
      case 'savings': return 'Create Account';
      case 'navigate': return 'Go to Page';
      default: return 'Confirm';
    }
  };
  
  // Generate appropriate button color based on action type
  const getConfirmButtonColorForActionType = (): string => {
    switch (type) {
      case 'block': return 'bg-red-600 hover:bg-red-700';
      case 'unblock': return 'bg-green-600 hover:bg-green-700';
      case 'request': return 'bg-blue-600 hover:bg-blue-700';
      case 'savings': return 'bg-purple-600 hover:bg-purple-700';
      case 'navigate': return 'bg-green-600 hover:bg-green-700';
      default: return 'bg-green-600 hover:bg-green-700';
    }
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">{getTitleForActionType()}</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {getDescriptionForActionType()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={`${getConfirmButtonColorForActionType()} text-white`}
          >
            {getConfirmButtonTextForActionType()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}