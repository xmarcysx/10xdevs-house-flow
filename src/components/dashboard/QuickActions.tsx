import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const QuickActions: React.FC = () => {
  const handleAddExpense = () => {
    window.location.href = "/expenses/new";
  };

  const handleAddIncome = () => {
    window.location.href = "/incomes/new";
  };

  const handleAddGoal = () => {
    window.location.href = "/goals/new";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Szybkie akcje</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button onClick={handleAddExpense} className="w-full justify-start" variant="outline">
            <span className="mr-2">💸</span>
            Dodaj wydatek
          </Button>

          <Button onClick={handleAddIncome} className="w-full justify-start" variant="outline">
            <span className="mr-2">💰</span>
            Dodaj wpływ
          </Button>

          <Button onClick={handleAddGoal} className="w-full justify-start" variant="outline">
            <span className="mr-2">🎯</span>
            Dodaj cel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
