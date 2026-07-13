import type { AdminDashboardWidgetId, AdminStrings } from '@interfaces';

export interface AdminDashboardWidgetDef {
  id: AdminDashboardWidgetId;
  labelKey: keyof AdminStrings;
  group: 'kpi' | 'analytics' | 'tables';
}

export const ADMIN_DASHBOARD_WIDGETS: AdminDashboardWidgetDef[] = [
  { id: 'kpi-total-users', labelKey: 'widgetKpiTotalUsers', group: 'kpi' },
  { id: 'kpi-paid-users', labelKey: 'widgetKpiPaidUsers', group: 'kpi' },
  { id: 'kpi-trial-users', labelKey: 'widgetKpiTrialUsers', group: 'kpi' },
  { id: 'kpi-conversion', labelKey: 'widgetKpiConversion', group: 'kpi' },
  { id: 'kpi-mrr', labelKey: 'widgetKpiMrr', group: 'kpi' },
  { id: 'segments', labelKey: 'widgetSegments', group: 'analytics' },
  { id: 'activation-funnel', labelKey: 'widgetActivationFunnel', group: 'analytics' },
  { id: 'alerts', labelKey: 'widgetAlerts', group: 'analytics' },
  { id: 'geography', labelKey: 'widgetGeography', group: 'analytics' },
  { id: 'product-usage', labelKey: 'widgetProductUsage', group: 'analytics' },
  { id: 'last-visits', labelKey: 'widgetLastVisits', group: 'tables' },
];

export const DEFAULT_ADMIN_DASHBOARD_WIDGETS: AdminDashboardWidgetId[] =
  ADMIN_DASHBOARD_WIDGETS.map((w) => w.id);

export const ADMIN_DASHBOARD_WIDGET_GROUPS: Array<AdminDashboardWidgetDef['group']> = [
  'kpi',
  'analytics',
  'tables',
];
