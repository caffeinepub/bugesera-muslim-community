import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { CommunityActivity } from "./components/CommunityActivity";
import { DonationModal } from "./components/DonationModal";
import { FinancialOverview } from "./components/FinancialOverview";
import { Footer } from "./components/Footer";
import { FundraisingSection } from "./components/FundraisingSection";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin } from "./hooks/useQueries";
import { AdminDashboard } from "./pages/AdminDashboard";
import { MemberDashboard } from "./pages/MemberDashboard";

type Page = "home" | "member" | "admin";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [donateOpen, setDonateOpen] = useState(false);
  const { loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();

  const isLoggedIn = loginStatus === "success" && !!identity;

  const _handleGetStarted = () => {
    if (isLoggedIn) setCurrentPage("member");
    else setDonateOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentPage={currentPage}
        setCurrentPage={(p) => {
          if (p === "admin" && !isAdmin) return;
          if (p === "member" && !isLoggedIn) return;
          setCurrentPage(p);
        }}
      />

      {currentPage === "home" && (
        <main>
          <HeroSection
            onDonate={() => setDonateOpen(true)}
            onLearnMore={() =>
              document
                .querySelector("#features")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />
          <FundraisingSection />
          <CommunityActivity />
          <FinancialOverview />
          <Footer />
        </main>
      )}

      {currentPage === "member" && isLoggedIn && <MemberDashboard />}
      {currentPage === "admin" && isAdmin && <AdminDashboard />}

      {/* Redirect if not authorized */}
      {currentPage === "member" && !isLoggedIn && (
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Please sign in to access your dashboard
            </p>
          </div>
        </main>
      )}

      <DonationModal open={donateOpen} onOpenChange={setDonateOpen} />
      <Toaster richColors position="top-right" />
    </div>
  );
}
