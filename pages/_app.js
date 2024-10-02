import ReactQueryProvider from "../components/ReactQueryProvider";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    return (
        <ReactQueryProvider>
            <Component />
        </ReactQueryProvider>
    );
}

export default MyApp;
