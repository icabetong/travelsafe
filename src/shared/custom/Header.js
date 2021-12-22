import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
    Box,
    Button,
    Flex,
    Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useAuth } from "../../auth/Provider";

const MenuItems = (props) => {
  const { children, isLast, to = "/", ...rest } = props;

  return (
    <Text
      mb={{base: isLast ? 0 : 8, sm: 0}}
      mr={{base: 0, sm: isLast ? 0 : 8}}
      display="block"
      fontWeight="medium"
      {...rest}>
      <Link to={to}>{children}</Link>
    </Text>
  )
}

const Header = (props) => {
  const { t } = useTranslation();
  const [show, setShow] = React.useState(false);
  const toggleMenu = () => setShow(!show);

  return (
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
        <Navigation/>
      </Box>
    </Flex>
  );
}

const Navigation = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  console.log(user);

  return (
    <>
      <Flex
        align={["center", "center", "center", "center"]}
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        pt={[4, 4, 0, 0]}>
        <MenuItems to="/about">{t("navigation.about")}</MenuItems>
        <MenuItems to={user ? "/dashboard" : "/signin"}>
          <Button>
            {t(user ? "navigation.account" : "button.sign-in")}
          </Button>
        </MenuItems>
      </Flex>
    </>
  );
};

export default Header;