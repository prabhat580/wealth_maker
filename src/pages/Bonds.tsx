import { MainLayout } from "@/components/layout/MainLayout";
import { AssetSummaryCard } from "@/components/holdings/AssetSummaryCard";
import { HoldingsTable } from "@/components/holdings/HoldingsTable";
import { portfolioData } from "@/data/portfolioData";

const Bonds = () => {
  const asset = portfolioData.find((a) => a.id === "bonds")!;

  return (
    <MainLayout title="Bonds" subtitle="Your bond investments">
      <div className="space-y-6">
        <AssetSummaryCard asset={asset} />
        <HoldingsTable
          holdings={asset.holdings}
          showMaturity
          showInterestRate
        />
      </div>
    </MainLayout>
  );
};

export default Bonds;
