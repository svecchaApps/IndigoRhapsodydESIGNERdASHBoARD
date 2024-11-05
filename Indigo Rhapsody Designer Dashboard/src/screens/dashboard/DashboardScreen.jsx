import Sales from "../../components/dashboard/SalesBlock/Sales";
import { DashboardScreenWrap } from "./DashboardScreen.styles";
import RecentOrdersTable from "../../components/recentOrders/RecentOrdersTable";
const DashboardScreen = () => {
  return (
    <DashboardScreenWrap className="content-area">
      <div className="area-row ar-one">
        <Sales />
        <RecentOrdersTable />
      </div>
      <div className="area-row ar-two"></div>
    </DashboardScreenWrap>
  );
};

export default DashboardScreen;
