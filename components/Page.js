import Head from "next/head";
import Navbar from "./NavBar";
import Footer from "./footer";

const Layout = ({ children }) => {
    return (
        <div className="bg-[#F3F3FF] min-h-screen flex flex-col">
            {children}
        </div>
    );
};

const Body = ({ children }) => {
    return <div className="flex-1">{children}</div>;
};

const Page = ({ title, children }) => {
    return (
        <Layout>
            <Head>
                <title>{title}</title>
            </Head>
            <Navbar />
            <Body>{children}</Body>
            <Footer />
        </Layout>
    );
};

export default Page;
