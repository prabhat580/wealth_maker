import { MainLayout } from "@/components/layout/MainLayout";
import { AssetSummaryCard } from "@/components/holdings/AssetSummaryCard";
import { HoldingsTable } from "@/components/holdings/HoldingsTable";
import { portfolioData } from "@/data/portfolioData";

const UnlistedEquity = () => {
  const asset = portfolioData.find((a) => a.id === "unlisted-equity")!;

  return (
    <MainLayout title="Unlisted Equity" subtitle="Your pre-IPO investments">
      <div className="space-y-6">
        <AssetSummaryCard asset={asset} />
        <HoldingsTable
          holdings={asset.holdings}
          showUnits
        />
      </div>
    </MainLayout>
  );
};

export default UnlistedEquity;
