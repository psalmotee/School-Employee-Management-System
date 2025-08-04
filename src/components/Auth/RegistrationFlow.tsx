"use client";

import type React from "react";
import { useState } from "react";
import CodeVerification from "./CodeVerification";
import RegisterForm from "./RegisterForm";
import type { InvitationCode } from "../../types";

const RegistrationFlow: React.FC = () => {
  const [verifiedCode, setVerifiedCode] = useState<InvitationCode | null>(null);

  const handleCodeVerified = (code: InvitationCode) => {
    setVerifiedCode(code);
  };

  const handleBack = () => {
    setVerifiedCode(null);
  };

  if (verifiedCode) {
    return <RegisterForm invitationCode={verifiedCode} onBack={handleBack} />;
  }

  return (
    <CodeVerification onCodeVerified={handleCodeVerified} onBack={handleBack} />
  );
};

export default RegistrationFlow;
