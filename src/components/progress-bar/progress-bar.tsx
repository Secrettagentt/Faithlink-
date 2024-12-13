"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import React from "react";

const ProgressBarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Fragment>
      {children}
      <ProgressBar
        height="4px"
        color="#34C759"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </React.Fragment>
  );
};

export default ProgressBarProvider;
