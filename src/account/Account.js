import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Center,
  Spinner,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
} from "@chakra-ui/react";
import Page from "../shared/custom/Page";

const InformationTab = lazy(() => import('./tabs/Information'));
const SecurityTab = lazy(() => import('./tabs/Security'));
const TravelsTab = lazy(() => import('./tabs/Travels'));

function Account() {
  const { t } = useTranslation();

  const loading = (
    <Box w='100%' h='100%'>
      <Center h='100%'>
        <Spinner/>
      </Center>
    </Box>
  )

  return (
    <Page title={t("navigation.account")}>
      <Box w="100%" minH="100%" px={{base: 4, md: 8}}>
        <Tabs minW="100%" minH="80vh">
          <TabList>
            <Tab>{t("account.information")}</Tab>
            <Tab>{t("account.security")}</Tab>
            <Tab>{t("account.travels")}</Tab>
          </TabList>

          <TabPanels display="flex" minH="75vh">
            <TabPanel display="flex" flexGrow="1">
              <Suspense fallback={loading}>
                <InformationTab/>
              </Suspense>
            </TabPanel>
            <TabPanel display="flex" flexGrow="1">
              <Suspense fallback={loading}>
                <SecurityTab/>
              </Suspense>
            </TabPanel>
            <TabPanel display="flex" flexGrow="1">
              <Suspense fallback={loading}>
                <TravelsTab/>
              </Suspense>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Page>
  );
}

export default Account;