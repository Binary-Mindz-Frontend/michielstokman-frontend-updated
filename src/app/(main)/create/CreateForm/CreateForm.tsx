'use client';
import { useSearchParams } from 'next/navigation';
import ConfessionForm from './_components/CreateForm/ConfessionForm/ConfessionForm';
import MeditationForm from './_components/CreateForm/MeditationForm/MeditationForm';
import CreateFormCategoryTabs from './_components/CreateFormCategoryTabs/CreateFormCategoryTabs';
import CreateFormHeader from './_components/CreateFormHeader/CreateFormHeader';

export default function CreateForm() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('type') || 'Confessions';

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <CreateFormHeader category={selectedCategory} />
      <CreateFormCategoryTabs selected={selectedCategory} />

      {selectedCategory === 'Confessions' ? <ConfessionForm /> : <MeditationForm />}

      <p className="text-secondary mt-4 text-center text-sm">
        All submissions are reviewed with care.
      </p>
    </section>
  );
}
