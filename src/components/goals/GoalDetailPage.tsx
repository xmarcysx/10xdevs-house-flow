// Główna strona widoku szczegółów pojedynczego celu oszczędnościowego
import React from "react";
import { GoalContributionsView } from "./GoalContributionsView";
import GoalDetailLayout from "./GoalDetailLayout";

interface GoalDetailPageProps {
  goalId: string;
}

export const GoalDetailPage: React.FC<GoalDetailPageProps> = ({ goalId }) => {
  return (
    <GoalDetailLayout>
      <GoalContributionsView goalId={goalId} />
    </GoalDetailLayout>
  );
};
