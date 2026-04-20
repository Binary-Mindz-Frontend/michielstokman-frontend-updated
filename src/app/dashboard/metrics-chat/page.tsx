import DynamicPageHeader from '@/components/dashboard/DynamicPageHeader/DynamicPageHeader';
import ChatBox from './_components/ChatBox/ChatBox';

function DashboardMetricsChatPage() {
  return (
    <section>
      <DynamicPageHeader
        title="Metrics Chat"
        description="Ask about top resonance, growth area averages, completion rates, or pending items"
      />
      <ChatBox />
    </section>
  );
}

export default DashboardMetricsChatPage;
