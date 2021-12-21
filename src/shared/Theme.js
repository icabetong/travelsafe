import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
}
const theme = extendTheme(
  withDefaultColorScheme({ 
    colorScheme: "teal" 
  }),{
    config,
    color: {
      
    }
  }
);

export default theme;