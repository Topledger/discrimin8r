import Document, {Html, Head, Main, NextScript} from "next/document";
import Script from "next/script";

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link
                        rel="icon"
                        type="image/svg+xml"
                        href="/favicon/favicon.svg"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        href="/favicon/favicon.png"
                    />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
                        rel="stylesheet"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
            
                            gtag('config', 'G-J7F5CE2LWW');
                        `}
                    </Script>
                </Head>
                <body className="bg-lbs dark:bg-dbs text-ltp dark:text-dtp selection:bg-accent selection:text-white">
                <Main/>
                <NextScript/>
                </body>
            </Html>
        );
    }
}

export default MyDocument;
