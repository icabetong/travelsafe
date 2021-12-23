import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import QrReader from "react-web-qr-reader";

function Scanner(props) {
  const { t } = useTranslation();

  return (
    <Modal 
      isOpen={props.open} 
      onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("dialog.scan")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <QrReader
              onScan={props.onDataCapture}/>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose}>
            {t("button.cancel")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
} 

export default Scanner;