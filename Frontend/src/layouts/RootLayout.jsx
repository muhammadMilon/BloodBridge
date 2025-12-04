import { Outlet, useLocation } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import GeminiChatWidget from "../components/GeminiChatWidget";

const queryClient = new QueryClient();

const RootLayout = () => {
  const location = useLocation();
  const hideFooterRoutes = ["/registration"];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <div>
          <Header />
          <main className="min-h-[calc(100vh-285px)] ">
            <Outlet></Outlet>
          </main>
          {!shouldHideFooter && <Footer />}
          <GeminiChatWidget />
        </div>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default RootLayout;
