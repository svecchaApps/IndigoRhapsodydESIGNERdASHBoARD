import React, { useEffect, useState } from "react";
import { CommissionsScreenWrap } from "./CommissionsScreen.styles";
import { getDesignerCommission } from "../../service/dashBoardService";
import { CurrencyDollarIcon } from "../../components/common/Icons";
import { toast } from "react-toastify";

const CommissionsScreen = () => {
  const [commissionData, setCommissionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommission = async () => {
      try {
        setLoading(true);
        const data = await getDesignerCommission();
        setCommissionData(data);
      } catch (error) {
        console.error("Error fetching commission:", error);
        toast.error("Failed to load commission data");
        setCommissionData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCommission();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount ?? 0);
  };

  return (
    <CommissionsScreenWrap>
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Commissions</h1>
          <p className="page-subtitle">
            View your total sales, commission earned, and commission rate.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading commission data...</p>
        </div>
      ) : !commissionData ? (
        <div className="empty-state">
          <div className="empty-icon">
            <CurrencyDollarIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3>No commission data</h3>
          <p>Commission information is not available at this time.</p>
        </div>
      ) : (
        <>
          <div className="stats-section">
            <div className="stat-card stat-total-sales">
              <div className="stat-card-header">
                <div className="stat-icon bg-blue-500">
                  <CurrencyDollarIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="stat-content">
                <p className="stat-title">Total Sales</p>
                <h3 className="stat-value">
                  {formatCurrency(commissionData.totalSales)}
                </h3>
              </div>
            </div>
            <div className="stat-card stat-commission">
              <div className="stat-card-header">
                <div className="stat-icon bg-amber-500">
                  <CurrencyDollarIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="stat-content">
                <p className="stat-title">Commission Earned</p>
                <h3 className="stat-value">
                  {formatCurrency(commissionData.commission_total)}
                </h3>
              </div>
            </div>
            <div className="stat-card stat-rate">
              <div className="stat-card-header">
                <div className="stat-icon bg-emerald-500">
                  <CurrencyDollarIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="stat-content">
                <p className="stat-title">Commission Rate</p>
                <h3 className="stat-value">
                  {((commissionData.commissionRate ?? 0) * 100).toFixed(1)}%
                </h3>
              </div>
            </div>
          </div>

          <div className="commission-summary">
            <h3 className="section-title">Summary</h3>
            <div className="summary-content">
              <p>
                Your total sales amount to{" "}
                <strong>{formatCurrency(commissionData.totalSales)}</strong>.
                At a commission rate of{" "}
                <strong>
                  {((commissionData.commissionRate ?? 0) * 100).toFixed(1)}%
                </strong>
                , your total commission earned is{" "}
                <strong>
                  {formatCurrency(commissionData.commission_total)}
                </strong>
                .
              </p>
            </div>
          </div>
        </>
      )}
    </CommissionsScreenWrap>
  );
};

export default CommissionsScreen;
