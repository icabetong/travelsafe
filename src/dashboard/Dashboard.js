import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Flex,
  Stack,
  useBreakpointValue
} from "@chakra-ui/react";
import Page from "../shared/custom/Page";
import QRCode from "qrcode.react";
import { useAuth } from "../auth/Provider";

function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const size = useBreakpointValue({base: 128, md: 256, lg: 512});

  return (
    <Page title={t("navigation.dashboard")}>
      <Flex
        direction={{base: "column", md: "row-reverse"}}
        align="center"
        justifyContent="space-around">
        <Stack>
          <Box>{t("info.your-qr-code")}</Box>
          <Box
            as={QRCode}
            value={user.id}
            size={size}
            width={{base: "xs", md: "md"}}
            height={{base: "xs", md: "md"}}
            p={4}
            border="1px"
            borderRadius="md"
            borderColor="gray.500"/>
          <Box
            mt={2}
            color="gray.500"
            fontSize="sm"
            textAlign="center">
            {t("info.qr-code-save")}
          </Box>
        </Stack>
        <Box w={{base: 0, md: 16}}/>
        <Stack>
          <Button
            mt={8}>
            {t("button.scan-qr-code")}
          </Button>
          <Button
            mt={4}
            variant="outline"
            colorScheme="gray"
            onClick={() => navigate("/account")}>
            {t("button.update-account-information")}
          </Button>
        </Stack>
      </Flex>
    </Page>
  );
}

export default Dashboard;