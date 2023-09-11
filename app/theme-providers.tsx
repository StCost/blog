"use client";

import { ThemeProvider } from "next-themes";
import siteMetadata from "@/data/siteMetadata";
import React, { Component } from "react";

export class ThemeProviders extends Component<{ children: React.ReactNode }> {
  render() {
    const { children } = this.props;
    return (
      <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme} enableSystem>
        {children}
      </ThemeProvider>
    );
  }
}
