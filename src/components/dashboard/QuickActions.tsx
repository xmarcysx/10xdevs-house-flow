import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const handleAddExpense = () => {
    localStorage.setItem("openModal", "add");
    navigate("/expenses");
  };

  const handleAddIncome = () => {
    localStorage.setItem("openModal", "add");
    navigate("/incomes");
  };

  const handleAddGoal = () => {
    localStorage.setItem("openModal", "add");
    navigate("/goals");
  };

  return (
    <Card className="h-full group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-white to-orange-50/50 dark:from-gray-800 dark:to-orange-900/20">
      <CardHeader className="pb-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          Szybkie akcje
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 space-y-4">
          <Button
            onClick={handleAddExpense}
            className="flex-grow justify-start bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-xl">💸</span>
              </div>
              <span className="text-lg">Dodaj wydatek</span>
            </div>
          </Button>

          <Button
            onClick={handleAddIncome}
            className="flex-grow justify-start bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-xl">💰</span>
              </div>
              <span className="text-lg">Dodaj wpływ</span>
            </div>
          </Button>

          <Button
            onClick={handleAddGoal}
            className="flex-grow justify-start bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-xl">🎯</span>
              </div>
              <span className="text-lg">Dodaj cel</span>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
