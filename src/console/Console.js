import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Spinner,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel
} from "@chakra-ui/react";
import Page from "../shared/custom/Page";

const PassengerTab = lazy(() => import('./tabs/PassengerTab'));
const DriverTab = lazy(() => import('./tabs/DriverTab'));
const RoutesTab = lazy(() => import('./tabs/RoutesTab'));

function Console() {
  const { t } = useTranslation();

  const fallback = (
    <Box><Spinner/></Box>
  )

  return (
    <Page title={t("navigation.console")}>
      <Box w="100%" h="100%" px={8}>
        <Tabs minW="100%" minH="80vh">
          <TabList>
            <Tab>{t("console.passengers")}</Tab>
            <Tab>{t("console.drivers")}</Tab>
            <Tab>{t("console.routes")}</Tab>
          </TabList>

          <TabPanels display="flex" minH="75vh">
            <TabPanel display="flex" flexGrow="1">
              <Suspense fallback={fallback}>
                <PassengerTab/>
              </Suspense>
            </TabPanel>
            <TabPanel display="flex" flexGrow="1">
              <Suspense fallback={fallback}>
                <DriverTab/>
              </Suspense>
            </TabPanel>
            <TabPanel display="flex" flexGrow="1">
              <Suspense fallback={fallback}>
                <RoutesTab/>
              </Suspense>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Page>
  );
}

export default Console;