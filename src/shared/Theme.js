import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { CalendarDefaultTheme } from "@uselessdev/datepicker";

const font = 'Fira Sans';
const config = {
  initialColorMode: 'light',
  useSystemColorMode: true,
}
const theme = extendTheme(
  CalendarDefaultTheme,
  withDefaultColorScheme({ 
    colorScheme: "teal" 
  }),{
    config,
    fonts: {
      heading: font,
      body: font
    },
    components: {
      Input: {
        defaultProps: {
          focusBorderColor: "teal.400"
        }
      },
      Select: {
        defaultProps: {
          focusBorderColor: "teal.400"
        }
      },
      Calendar: {
        parts: ['calendar'],
        baseStyle: {
          calendar: {
            margin: '0 auto',
            border: 'none'
          },
        }
      },
      CalendarControl: {
        parts: ['button'],
        baseStyle: {
          button: {
            rounded: "md",
          },
        }
      },
      CalendarMonth: {
        parts: ['days'],
        baseStyle: {
          days: {
            color: 'red'
          },
        }
      },
      CalendarDay: {
        baseStyle: props => ({
          color: props.colorMode === 'dark' ? 'white' : 'gray.800',
          rounded: 'md',
          fontWeight: 400,
          _hover: {
            color: props.colorMode === 'dark' ? 'white' : 'black',
            backgroundColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.300'
          },
        })
      }
    }
  }
);

export default theme;