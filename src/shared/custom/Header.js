import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
    Box,
    Button,
    Flex,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Text,
    useColorMode,
} from "@chakra-ui/react";
import { 
  Shield, 
  LogOut, 
  ChevronDown, 
  X,
  Moon,
  Sun,
  Menu as MenuIcon } from "react-feather";
import { useAuth } from "../../auth/Provider";

const NavigationItem = (props) => {
  const { children, isLast, to = "/", ...rest } = props;

  return (
    <Text
      mb={{base: isLast ? 0 : 8, sm: 0}}
      mr={{base: 0, sm: isLast ? 0 : 8}}
      display="block"
      fontWeight="medium"
      bg={["teal.500", "teal.500", "transparent", "transparent"]}
      color={["white", "white", "teal.500", "teal.500"]}
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
      
      {...props} >
      <Flex align="center">
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
        {show ? <X/> : <MenuIcon/> }
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
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  const onSignOut = async () => {
    await signOut();
    navigate("/signin");
  }

  return (
    <>
      <Flex
        align={["center", "center", "center", "center"]}
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        pt={[4, 4, 0, 0]}>
        <NavigationItem to="/about">{t("navigation.about")}</NavigationItem>
        { user 
          ?
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDown/>}>
                {t("navigation.account")}
              </MenuButton>
              <MenuList>
                <MenuItem isDisabled>{user.email}</MenuItem>
                <MenuItem 
                  icon={<Shield/>} 
                  onClick={() => navigate("/dashboard")}>
                  {t("navigation.dashboard")}
                </MenuItem>
                <MenuItem 
                  icon={colorMode === 'dark' ? <Sun/> : <Moon/>}
                  onClick={() => toggleColorMode()}>
                  {t(colorMode === 'dark' ? 'button-switch-light' : 'button.switch-dark')}
                </MenuItem>
                <MenuItem 
                  icon={<LogOut/>} 
                  onClick={onSignOut}>
                  {t("button.signout")}
                </MenuItem>
              </MenuList>
            </Menu>
          : <NavigationItem to="/signin">
              <Button>
                {t("button.sign-in")}
              </Button>
            </NavigationItem>
        }
      </Flex>
    </>
  );
};

export default Header;