import { MainLayout } from "@/components/layout/MainLayout";
import { AssetSummaryCard } from "@/components/holdings/AssetSummaryCard";
import { HoldingsTable } from "@/components/holdings/HoldingsTable";
import { portfolioData } from "@/data/portfolioData";

const NcdMld = () => {
  const asset = portfolioData.find((a) => a.id === "ncd-mld")!;

  return (
    <MainLayout title="NCDs / MLDs" subtitle="Your debenture investments">
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

export default NcdMld;
