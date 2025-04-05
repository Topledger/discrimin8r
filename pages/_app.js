import ReactQueryProvider from "../components/ReactQueryProvider";
import { DarkModeProvider } from "../providers/DarkMode";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    return (
        <ReactQueryProvider>
            <DarkModeProvider>
                <Component {...pageProps} />
            </DarkModeProvider>
        </ReactQueryProvider>
    );
}

export default MyApp;
