import { Tak } from '@/types';

type MaandlijstTakPageProps = {
  params: Promise<{
    tak: Tak;
  }>;
};

export const MaandlijstTakPage = async ({ params }: MaandlijstTakPageProps) => {
  const { tak } = await params;
  return <div>MaandlijstTakPage of {tak}</div>;
};

export default MaandlijstTakPage;
