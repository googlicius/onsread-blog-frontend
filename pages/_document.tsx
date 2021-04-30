import Document, { Html, Head, Main, NextScript } from 'next/document';
import Navigation from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link href="/css/styles.css" rel="stylesheet" />
        </Head>
        <body>
          <Navigation />
          <Main />
          <NextScript />
          <Footer />
          <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js"></script>
          <script src="/js/scripts.js"></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
