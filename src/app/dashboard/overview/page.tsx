import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import DashboardSummary from './_components/DashboardSummary/DashboardSummary';
import TopResonanceContent from './_components/TopResonanceContent/TopResonanceContent';
import WeeklyTrends from './_components/WeeklyTrends/WeeklyTrends';

function DashboardOverviewPage() {
  return (
    <section className="space-y-6">
      <DynamicPageHeader title="Dashboard Overview" />
      <DashboardSummary />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WeeklyTrends />
        <TopResonanceContent />
      </div>
    </section>
  );
}

export default DashboardOverviewPage;
