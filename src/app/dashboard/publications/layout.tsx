import PublicationsDraftSync from './_components/PublicationsDraftSync';
import ReviewModeBanner from './_components/ReviewModeBanner';

/**
 * Wraps the overview, the workspace and the cover library so review-only state
 * survives navigation between them.
 */
export default function PublicationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicationsDraftSync />
      <ReviewModeBanner />
      {children}
    </>
  );
}
