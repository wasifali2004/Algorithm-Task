// src/lib/ui-store.ts
'use client';

import { create } from 'zustand';

export type DashboardPanel = 'overview' | 'send' | 'recent' | 'help';

type UiState = {
  dashboardPanel: DashboardPanel;
  setDashboardPanel: (panel: DashboardPanel) => void;
};

export const useUiStore = create<UiState>((set) => ({
  dashboardPanel: 'overview',
  setDashboardPanel: (panel) => set({ dashboardPanel: panel }),
}));
