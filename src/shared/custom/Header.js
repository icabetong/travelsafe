import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useColorMode,
  useBreakpointValue,
} from "@chakra-ui/react";
import { 
  Shield, 
  LogOut,
  Moon,
  Sun,
  User,
} from "react-feather";
import { useAuth } from "../../auth/Provider";

const NavigationItem = (props) => {
  const { children, isLast, to = "/", ...rest } = props;

  return (
    <Text
      mb={{base: isLast ? 0 : 8, sm: 0}}
      mr={{base: 0, sm: isLast ? 0 : 8}}
      display="block"
      fontWeight={600}
      bg={["teal.500", "teal.500", "transparent", "transparent"]}
      color={["white", "white", "teal.500", "teal.500"]}
      {...rest}>
      <Link to={to}>{children}</Link>
    </Text>
  )
}

const Header = (props) => {
  const { t } = useTranslation();
  const variant = useBreakpointValue({base: true, md: false});

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      w="100%"
      mb={2}
      p={4}
      {...props} >
      <Flex 
        align="center"
        display="block">
        <Link to="/">
          <Text 
            mx={4} 
            as="h4" 
            fontWeight="medium" 
            fontSize={{base: 'lg', md: "2xl"}}>
            {t("app_name")}
          </Text>
        </Link>
      </Flex>
      { variant
      ? <Navigation/>
      : <Box
          display="block"
          flexBasis={{base: "100%", md: "auto"}}>
          <Navigation/>
        </Box>
      }
    </Flex>
  );
}

const Navigation = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { colorMode, toggleColorMode } = useColorMode();
  const variant = useBreakpointValue({base: true, md: false});

  const onSignOut = async () => {
    await signOut();
    if (location.pathname === '/account' 
        || location.pathname === '/dashboard' 
        || location.pathname === '/console') {
      navigate('/');
    }
  }

  const AccountMenu = () => {
    return (
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<User/>}>
          {t("navigation.account")}
        </MenuButton>
        <MenuList>
          <MenuItem isDisabled>{user && user.email}</MenuItem>
          <MenuItem 
            icon={<Shield/>} 
            onClick={() => navigate("/dashboard")}>
            {t("navigation.dashboard")}
          </MenuItem>
          <MenuItem 
            icon={colorMode === 'dark' ? <Sun/> : <Moon/>}
            onClick={() => toggleColorMode()}>
            {t(colorMode === 'dark' ? 'button.switch-light' : 'button.switch-dark')}
          </MenuItem>
          <MenuItem 
            icon={<LogOut/>} 
            onClick={onSignOut}>
            {t("button.sign-out")}
          </MenuItem>
        </MenuList>
      </Menu>
    );
  }

  return (
    variant 
    ? <AccountMenu/> 
    : <Flex
        align={["center", "center", "center", "center"]}
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        pt={[4, 4, 0, 0]}>
        <NavigationItem to="/about">{t("navigation.about")}</NavigationItem>
        { user 
          ? <AccountMenu/>
          : <NavigationItem to="/signin">
              <Button>
                {t("button.sign-in")}
              </Button>
            </NavigationItem>
        }
      </Flex>
  );
};

export default Header;