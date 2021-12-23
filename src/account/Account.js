
import { useTranslation } from "react-i18next";
import Page from "../shared/custom/Page";

function Account() {
  const { t } = useTranslation();

  return (
    <Page title={t("navigation.account")}>

    </Page>
  );
}

export default Account;