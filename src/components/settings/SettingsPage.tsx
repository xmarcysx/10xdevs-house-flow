// Główna strona ustawień użytkownika
import React from "react";
import SettingsLayout from "./SettingsLayout";
import SettingsForm from "./SettingsForm";

const SettingsPage: React.FC = () => {
  return (
    <SettingsLayout>
      <SettingsForm />
    </SettingsLayout>
  );
};

export default SettingsPage;
