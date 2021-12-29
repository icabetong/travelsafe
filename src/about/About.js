import { useTranslation } from "react-i18next";
import Page from "../shared/custom/Page";

const About = () => {
  const { t } = useTranslation();

  return (
    <Page title={t("navigation.about")}>

    </Page>
  );
}

export default About;