import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Center,
  Spinner,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel
} from "@chakra-ui/react";
import { useAuth } from "../auth/Provider";
import Page from "../shared/custom/Page";

const PassengerTab = lazy(() => import('./tabs/PassengerTab'));
const DriverTab = lazy(() => import('./tabs/DriverTab'));
const RoutesTab = lazy(() => import('./tabs/RoutesTab'));

function Console() {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const loading = (
    <Box w='100%'>
      <Center h='100%'>
        <Spinner/>
      </Center>
    </Box>
  )

  const content = (
    <Page title={t("navigation.console")}>
      <Box w="100%" h="100%" px={{base: 4, md: 8}}>
        <Tabs minW="100%" minH="80vh">
          <TabList>
            <Tab>{t("console.passengers")}</Tab>
            <Tab>{t("console.drivers")}</Tab>
            <Tab>{t("console.routes")}</Tab>
          </TabList>

          <TabPanels display="flex" minH="75vh">
            <TabPanel display="flex" flexGrow="1">
              <Suspense fallback={loading}>
                <PassengerTab/>
              </Suspense>
            </TabPanel>
            <TabPanel display="flex" flexGrow="1">
              <Suspense fallback={loading}>
                <DriverTab/>
              </Suspense>
            </TabPanel>
            <TabPanel display="flex" flexGrow="1">
              <Suspense fallback={loading}>
                <RoutesTab/>
              </Suspense>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Page>
  )

  return (
    profile.type === 'admin' || profile.id === "d9359a11-4e35-44a3-be45-e4c52abb7b9b"
      ? content
      : <Navigate to="/error"/>
  );
}

export default Console;