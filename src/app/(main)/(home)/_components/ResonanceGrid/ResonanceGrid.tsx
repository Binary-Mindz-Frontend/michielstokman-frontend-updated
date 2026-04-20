import CardGrid from './_components/CardGrid/CardGrid';
import FilterTabs from './_components/FilterTabs/FilterTabs';

function ResonanceGrid() {
  return (
    <section className="space-y-8 sm:space-y-12">
      <FilterTabs />
      <CardGrid />
    </section>
  );
}

export default ResonanceGrid;
