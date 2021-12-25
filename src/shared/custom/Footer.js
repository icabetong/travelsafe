import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Flex,
  Link,
  Stack,
} from "@chakra-ui/react";

function Footer() {
  const { t } = useTranslation();

  return (
    <Flex
      width="100%"
      minH="10vh"
      justify="center"
      backgroundColor="gray.700">
      <Flex
        w="100%"
        maxW={{base: '100%', xl: '1200px'}}
        px={16}
        py={8}
        direction={{base: "column", md: "row"}}
        justify="space-between">
        <Box color="gray.300">
          <Box>{t("app_name")}</Box>
          <Box>{t("footer.copyright")}</Box>
        </Box>
        <Box color="gray.300" mt={{base: 4, md: 0}}>
          <Box color="gray.500">{t("footer.other-destinations")}</Box>
          <Stack spacing={0}>
            <Link 
              as={RouterLink} 
              to="/about">
              {t("navigation.about")}
            </Link>
            <Link 
              as={RouterLink} 
              to="/console">
              {t("navigation.console")}
            </Link>
          </Stack>
        </Box>
      </Flex>
    </Flex>
  );
}

export default Footer;