import React from "react";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TotalBalance, Main, Savings, Card } from "@/lib/icons";

interface Account {
  id: number;
  type: "total" | "main" | "savings" | "card";
  name: string;
  balance: string;
  color: string;
  status?: string;
  icon: string;
}

export function AccountsSection() {
  const { data: accounts, isLoading } = useQuery<Account[]>({
    queryKey: ['/api/accounts'],
  });

  const defaultAccounts: Account[] = [
    {
      id: 1,
      type: "total",
      name: "Total Balance",
      balance: "€ 0,00",
      color: "purple",
      icon: "wallet"
    },
    {
      id: 2,
      type: "main",
      name: "Main",
      balance: "€ 0,00",
      color: "orange",
      icon: "circle"
    },
    {
      id: 3,
      type: "savings",
      name: "Savings Ac...",
      balance: "",
      status: "Pending",
      color: "blue",
      icon: "piggy-bank"
    },
    {
      id: 4,
      type: "card",
      name: "Credit Card",
      balance: "",
      color: "credit-card",
      icon: "credit-card"
    }
  ];

  const displayAccounts = accounts || defaultAccounts;

  if (isLoading) {
    return (
      <div className="px-4 mb-3">
        <div className="animate-pulse bg-gray-700 h-6 w-32 mb-3 rounded"></div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-gray-800 h-28 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const renderIcon = (type: string) => {
    switch (type) {
      case "total":
        return <TotalBalance className="text-pink-300 h-4 w-4" />;
      case "main":
        return <Main className="text-orange-300 h-4 w-4" />;
      case "savings":
        return <Savings className="text-blue-300 h-4 w-4" />;
      case "card":
        return <Card className="text-white h-4 w-4" />;
      default:
        return null;
    }
  };

  const getCardClass = (color: string) => {
    switch (color) {
      case "purple":
        return "card-gradient-purple";
      case "orange":
        return "card-gradient-orange";
      case "blue":
        return "card-gradient-blue";
      default:
        return "bg-gray-800";
    }
  };

  return (
    <div className="px-4 mb-3">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-white font-semibold text-lg">Rafi</h2>
        <button className="text-white">
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {displayAccounts.map((account) => (
          <div
            key={account.id}
            className={`rounded-lg p-4 ${
              account.type === "card" 
                ? "bg-gray-800 relative overflow-hidden" 
                : getCardClass(account.color)
            }`}
          >
            {account.type === "card" ? (
              <React.Fragment>
                <div className="mb-1 text-sm text-gray-300">{account.name}</div>
                <div className="absolute bottom-0 left-0 right-0 h-3/4 rounded-lg overflow-hidden">
                  <div className="credit-card-gradient h-full"></div>
                </div>
                <div className="absolute top-3 right-3 flex gap-1">
                  <div className="w-6 h-6 bg-red-500 rounded-full opacity-80"></div>
                  <div className="w-6 h-6 bg-orange-500 rounded-full opacity-80 -ml-3"></div>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="flex items-center gap-2 mb-2">
                  {renderIcon(account.type)}
                  <span className={`text-${account.color === "purple" ? "pink" : account.color === "orange" ? "orange" : "blue"}-300 font-medium`}>
                    {account.name}
                  </span>
                </div>
                <div className="text-white font-bold text-xl">
                  {account.status ? account.status : account.balance}
                </div>
              </React.Fragment>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
