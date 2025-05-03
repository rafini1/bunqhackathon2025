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

interface SendMoneyConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transferDetails: {
    amount?: string;
    currency?: string;
    recipient?: string;
  };
}

export function SendMoneyConfirmation({ 
  isOpen, 
  onClose, 
  onConfirm, 
  transferDetails 
}: SendMoneyConfirmationProps) {
  const { amount, currency, recipient } = transferDetails;
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">Confirm Money Transfer</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {amount && currency && recipient ? (
              <div className="space-y-4 py-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">{amount} {currency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">To:</span>
                  <span className="font-medium">{recipient}</span>
                </div>
                <div className="h-px bg-border my-2"></div>
                <p>Are you sure you want to send this money?</p>
              </div>
            ) : (
              <p>Processing a money transfer request. Would you like to proceed?</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Confirm Transfer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}