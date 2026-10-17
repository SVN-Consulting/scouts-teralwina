import { Spinner } from '@/components/loaders';

const loading = () => {
  return (
    <main className='container mx-auto w-full h-screen overflow-x-scroll flex flex-col items-center justify-center'>
      <Spinner />
    </main>
  );
};

export default loading;
