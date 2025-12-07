import Banner from "../components/Banner";
import DonationProcess from "../components/DonationProcess";
import HealthInsights from "../components/HealthInsights";
import ImpactStatistics from "../components/ImpactStatistics";
import PendingRequests from "../components/PendingRequests";
import QrVerificationInfo from "../components/QrVerificationInfo";
import RewardsShowcase from "../components/RewardsShowcase";

const Home = () => {
  return (
    <>
      <Banner></Banner>
      <ImpactStatistics></ImpactStatistics>
      <PendingRequests></PendingRequests>
      <DonationProcess></DonationProcess>
      <HealthInsights></HealthInsights>
      <RewardsShowcase></RewardsShowcase>
      <QrVerificationInfo></QrVerificationInfo>
    </>
  );
};

export default Home;
