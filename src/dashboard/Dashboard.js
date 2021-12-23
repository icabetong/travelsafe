
import { useTranslation } from "react-i18next";
import Page from "../shared/custom/Page";

function Dashboard() {
  const { t } = useTranslation();


  return (
    <Page title={t("navigation.dashboard")}>
      
    </Page>
  );
}

export default Dashboard;