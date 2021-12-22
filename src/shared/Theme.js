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
    fonts: {
      heading: "Rubik",
      body: "Rubik"
    }
  }
);

export default theme;