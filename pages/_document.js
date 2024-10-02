import Document, { Html, Head, Main, NextScript } from "next/document";

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
                        href="https://fonts.googleapis.com/css2?family=Baloo+Chettan+2&display=swap"
                        rel="stylesheet"
                    />
                </Head>
                <body className="bg-lbs dark:bg-dbs text-ltp dark:text-dtp selection:bg-accent selection:text-white">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
