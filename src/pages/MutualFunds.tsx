import { MainLayout } from "@/components/layout/MainLayout";
import { AssetSummaryCard } from "@/components/holdings/AssetSummaryCard";
import { HoldingsTable } from "@/components/holdings/HoldingsTable";
import { portfolioData } from "@/data/portfolioData";

const MutualFunds = () => {
  const asset = portfolioData.find((a) => a.id === "mutual-funds")!;

  return (
    <MainLayout title="Mutual Funds" subtitle="Your mutual fund investments">
      <div className="space-y-6">
        <AssetSummaryCard asset={asset} />
        <HoldingsTable
          holdings={asset.holdings}
          showCategory
          showUnits
        />
      </div>
    </MainLayout>
  );
};

export default MutualFunds;
