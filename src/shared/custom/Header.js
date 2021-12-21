import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
    Box,
    Button,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Stack,
    Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

const MenuItems = (props) => {
  const { children, isLast, to = "/", ...rest } = props;

  return (
    <Text
      mb={{base: isLast ? 0 : 8, sm: 0}}
      mr={{base: 0, sm: isLast ? 0 : 8}}
      display="block"
      fontWeight="medium"
      {...rest}>
      { !isLast ? <Link to={to}>{children}</Link> : children }
    </Text>
  )
}

const Header = (props) => {
  const { t } = useTranslation();
  const [show, setShow] = React.useState(false);
  const [isOpen, setOpen] = React.useState(false);
  const toggleMenu = () => setShow(!show);

  const onInvoke = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        w="100%"
        mb={8}
        p={8}
        bg={["teal.500", "teal.500", "transparent", "transparent"]}
        color={["white", "white", "teal.500", "teal.500"]}
        {...props} >
        <Flex align="center" color="white">
          <Link to="/">
            <Text 
              mx={4} 
              as="h4" 
              fontWeight="semibold" 
              fontSize={{base: 'lg', md: "2xl"}}>
              {t("app_name")}
            </Text>
          </Link>
        </Flex>
        <Box display={{base: "block", md: "none"}} onClick={toggleMenu}>
          {show ? <CloseIcon/> : <HamburgerIcon/> }
        </Box>
        <Box
          display={{ base: show ? "block" : "none", md: "block"}}
          flexBasis={{base: "100%", md: "auto"}}>
          <Navigation onTrigger={onInvoke}/>
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("dialog.sign-in-as")}</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <Stack direction='column'>
              <Button
                as={Link}
                variant="outline"
                onClick={onClose}
                to="/signin/passenger">
                {t("button.passenger")}
              </Button>
              <Button
                as={Link}
                variant="outline"
                onClick={onClose}
                to="/signin/driver">
                {t("button.driver")}
              </Button>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button 
              variant="ghost"
              onClick={onClose}>
              {t("button.cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

const Navigation = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <Flex
        align={["center", "center", "center", "center"]}
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        pt={[4, 4, 0, 0]}>
        <MenuItems to="/about">{t("navigation.about")}</MenuItems>
        <MenuItems to="/signin" isLast>
          <Button onClick={props.onTrigger}>{t("button.sign-in")}</Button>
        </MenuItems>
      </Flex>
    </>
  );
};

export default Header;