
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
  Input,
  Stack,
} from "@chakra-ui/react";
import Page from "../shared/custom/Page";

function Dashboard() {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <Page title={t("navigation.dashboard")}>
      <Flex direction="column" w="100%" px={8}>
        <Text fontWeight="semibold" fontSize="lg">{t("dashboard.vehicle-details")}</Text>
        <Flex as="form" direction="column" align="center" justify="flex-end">
          <FormControl mb={4}>
            <FormLabel htmlFor='plate'>{t("field.vehicle-plate-number")}</FormLabel>
            <Input id='plate' type='text' />
            <FormErrorMessage></FormErrorMessage>
          </FormControl>
          <Button>{t("button.save")}</Button>
        </Flex>
        <Text fontWeight="semibold" fontSize="lg">{t("dashboard.current-route")}</Text>
      </Flex>
    </Page>
  );
}

export default Dashboard;