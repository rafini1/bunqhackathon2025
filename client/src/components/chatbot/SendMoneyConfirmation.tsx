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
import { useBalance } from "../../contexts/BalanceContext";

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
  const { totalBalance } = useBalance();
  
  // Check if amount is greater than balance
  const amountValue = amount ? parseFloat(amount) : 0;
  const isInsufficientBalance = amountValue > totalBalance;
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">
            {isInsufficientBalance ? "Insufficient Balance" : "Confirm Money Transfer"}
          </AlertDialogTitle>
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
                
                {isInsufficientBalance && (
                  <div className="flex justify-between items-center text-red-500">
                    <span>Your balance:</span>
                    <span className="font-medium">€ {totalBalance.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                
                <div className="h-px bg-border my-2"></div>
                
                {isInsufficientBalance ? (
                  <div className="text-red-500 font-medium">
                    You don't have enough funds to complete this transfer.
                  </div>
                ) : (
                  <p>Are you sure you want to send this money?</p>
                )}
              </div>
            ) : (
              <p>Processing a money transfer request. Would you like to proceed?</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {isInsufficientBalance ? "Close" : "Cancel"}
          </AlertDialogCancel>
          
          {!isInsufficientBalance && (
            <AlertDialogAction 
              onClick={onConfirm}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Confirm Transfer
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}