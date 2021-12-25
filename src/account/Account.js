import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Spinner,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
} from "@chakra-ui/react";
import Page from "../shared/custom/Page";

const InformationPanel = lazy(() => import('./panels/Information'));
const SecurityPanel = lazy(() => import('./panels/Security'));
const TravelsPanel = lazy(() => import('./panels/Travels'));

function Account() {
  const { t } = useTranslation();

  const fallback = (
    <Box>
      <Spinner/>
    </Box>
  )

  return (
    <Page title={t("navigation.account")}>
      <Box w="100%" minH="80vh" mt={4} px={{base: 4, md: 8}}>
        <Tabs h="100%">
          <TabList>
            <Tab>{t("account.information")}</Tab>
            <Tab>{t("account.security")}</Tab>
            <Tab>{t("account.travels")}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Suspense fallback={fallback}>
                <InformationPanel/>
              </Suspense>
            </TabPanel>
            <TabPanel>
              <Suspense fallback={fallback}>
                <SecurityPanel/>
              </Suspense>
            </TabPanel>
            <TabPanel>
              <Suspense fallback={fallback}>
                <TravelsPanel/>
              </Suspense>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Page>
  );
}

export default Account;