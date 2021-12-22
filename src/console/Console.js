
import { useTranslation } from "react-i18next";
import Page from "../shared/custom/Page";

function Console() {
  const { t } = useTranslation();

  return (
    <Page title={t("navigation.console")}>

    </Page>
  );
}

export default Console;