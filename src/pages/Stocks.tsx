import { MainLayout } from "@/components/layout/MainLayout";
import { AssetSummaryCard } from "@/components/holdings/AssetSummaryCard";
import { HoldingsTable } from "@/components/holdings/HoldingsTable";
import { portfolioData } from "@/data/portfolioData";

const Stocks = () => {
  const asset = portfolioData.find((a) => a.id === "stocks")!;

  return (
    <MainLayout title="Stocks" subtitle="Your direct equity investments">
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

export default Stocks;
