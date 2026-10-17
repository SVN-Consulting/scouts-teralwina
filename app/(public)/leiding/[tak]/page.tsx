import { Spinner } from '@/components/loaders';
import { Tak } from '@/types';
import { Suspense } from 'react';

type LeidingTakPageProps = {
  params: Promise<{
    tak: Tak;
  }>;
};

const LeidngTakPage = async ({ params }: LeidingTakPageProps) => {
  const { tak } = await params;
  return (
    <>
      <Suspense fallback={<Spinner />}>
        <div>Leiding of {tak}</div>
      </Suspense>
    </>
  );
};

export default LeidngTakPage;
