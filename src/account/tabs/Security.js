import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  useColorMode,
} from "@chakra-ui/react";
import { useAuth } from "../../auth/Provider";
import supabase from "../../core/Infrastructure";

function SecurityTab() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const onSendPasswordReset = async () => {
    setSending(true);
    const { error } = await supabase.auth.api.resetPasswordForEmail(user.email);
    setSending(false);
    if (error) {
      toast({
        title: t("feedback.password-reset-send-error"),
        status: "error",
        isClosable: true,
      })
    } else {
      toast({
        title: t("feedback.password.reset-sent"),
        status: "success",
        isClosable: true,
      });
      setOpen(false);
    }
  }

  return (
    <Flex
      direction="column"
      align="start">
      <Box fontSize="lg" fontWeight="medium">{t("account.password-reset")}</Box>
      <Box mb={4} color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>{t("account.password-reset-subtitle")}</Box>
      <Button 
        onClick={onOpen}>
          {t("button.get-started")}
      </Button>
      { open &&
        <Modal isOpen={open} onClose={onClose} closeOnOverlayClick={!sending}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t("dialog.send-password-reset-title")}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Trans
                i18nKey="dialog.send-password-reset-subtitle"
                values={{ email: user.email }}
                components={{
                  focus: <Box as="span" fontWeight="700"/>
                }} />
            </ModalBody>
            <ModalFooter>
              <Button
                mr={3}
                onClick={onSendPasswordReset}
                isLoading={sending}>
                {t("button.continue")}
              </Button>
              <Button
                variant="ghost"
                onClick={onClose}>
                {t("button.cancel")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      }
    </Flex>
    
  )
}
export default SecurityTab;