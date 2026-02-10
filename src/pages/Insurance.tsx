import { MainLayout } from "@/components/layout/MainLayout";
import { AssetSummaryCard } from "@/components/holdings/AssetSummaryCard";
import { HoldingsTable } from "@/components/holdings/HoldingsTable";
import { portfolioData } from "@/data/portfolioData";

const Insurance = () => {
  const asset = portfolioData.find((a) => a.id === "insurance")!;

  return (
    <MainLayout title="Insurance" subtitle="Your insurance policies">
      <div className="space-y-6">
        <AssetSummaryCard asset={asset} />
        <HoldingsTable
          holdings={asset.holdings}
          showPremium
        />
      </div>
    </MainLayout>
  );
};

export default Insurance;
