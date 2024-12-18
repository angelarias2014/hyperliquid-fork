import Head from 'next/head';
import { useRouter } from 'next/router';

type HeadMetaDataProps = {
  pageTitle?: string;
};

const HeadMetaData = ({ pageTitle }: HeadMetaDataProps) => {
  const router = useRouter();
  const title = pageTitle ? `${pageTitle}` : 'Hyperliquid test';
  const ogUrl = router.pathname ? `${router.pathname}` : '';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Hyperliquid test" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content="hyperliquid" />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:type" content="website" />
      </Head>
    </>
  );
};

export default HeadMetaData;
