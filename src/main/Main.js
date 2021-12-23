import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Flex,
  Stack,
  useToast,
  useBreakpointValue
} from "@chakra-ui/react";
import Page from "../shared/custom/Page";
import QRCode from "qrcode.react";
import { useAuth } from "../auth/Provider";
import Scanner from "../scan/Scanner";

function Main() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const size = useBreakpointValue({base: 256});
  const [scan, setScan] = useState(false);
  const toast = useToast();

  const onScanInvoke = () => setScan(true);
  const onScanDismiss = () => setScan(false);
  const onScanError = () => {
    toast({
      title: t("feedback.scan-error"),
      status: "error",
      isClosable: true,
    });
  }

  const onDataCaptured = (data) => {

  }

  return (
    <Page title={t("concat.welcome", {name: profile.firstname})}>
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
            mt={8}
            onClick={onScanInvoke}>
            {t("button.scan-qr-code")}
          </Button>
          <Button
            variant="ghost"
            colorScheme="gray"
            fontSize="sm"
            onClick={() => navigate("/account")}>
            {t("button.update-account-information")}
          </Button>
        </Stack>
      </Flex>
      {scan &&
        <Scanner
          open={scan}
          onClose={onScanDismiss}
          onDataCapture={onDataCaptured}
          onDataError={onScanError}/>
      }
    </Page>
  );
}

export default Main;