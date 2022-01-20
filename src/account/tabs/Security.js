import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@chakra-ui/react";
import { useAuth } from "../../auth/Provider";
import supabase from "../../core/Infrastructure";

function SecurityTab() {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  const navigate = useNavigate();

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
      w="100%"
      direction="column"
      align="start">
      <SecurityItem
        title={t("account.password-reset")}
        subtitle={t("account.password-reset-subtitle")}
        buttonText="button.get-started"
        onClick={onOpen}/>
      <SecurityItem
        title={t("account.verification-status")}
        subtitle={
          <Trans
            i18nKey="account.verification-status-subtitle"
            values={{ status: t(`types.${profile.status}`) }}
            components={{
              focus: <Box as="span" fontWeight="bold"/>
            }}/>
        }
        buttonText={profile.status !== 'verified' ? "button.get-verified" : undefined}
        onClick={profile.status !== 'verified' ? () => navigate("/verify") : undefined}/>
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

function SecurityItem(props) {
  const { t } = useTranslation();

  return (
    <Box mt={2} mb={4}>
    <Box fontSize="lg" fontWeight="semibold">{props.title}</Box>
      <Box mb={4} fontSize="sm" color='gray.500'>{props.subtitle}</Box>
      { props.buttonText && props.onClick
        &&  <Button 
              size='sm'
              onClick={props.onClick}>
                {t(props.buttonText)}
            </Button>
      }
    </Box>
  )
}