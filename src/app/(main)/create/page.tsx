import { Suspense } from 'react';
import CreateForm from './CreateForm/CreateForm';

export default function CreateFormPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateForm />
    </Suspense>
  );
}
