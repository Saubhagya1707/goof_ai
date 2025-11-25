import { definePreset } from '@primeng/themes';
import Nora from '@primeng/themes/nora';

const Dora = definePreset(Nora, {
  // Primitive tokens: Define the basic building blocks like typography
  primitive: {
    typography: {
      fontFamily: '"IBM Plex Sans", sans-serif',
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 500,
        bold: 700,
      },
    },
  },
  // Semantic tokens: Define contextual styling like colors
  semantic: {
    primary: {
      50: '#f2f2f2',
      100: '#d9d9d9',
      200: '#bfbfbf',
      300: '#a6a6a6',
      400: '#8c8c8c',
      500: '#737373',
      600: '#595959',
      700: '#404040',
      800: '#262626',
      900: '#000000', // Black as primary
    },
    secondary: {
      50: '#f9f9f9',
      100: '#f0f0f0',
      200: '#e6e6e6',
      300: '#d9d9d9',
      400: '#bfbfbf',
      500: '#a6a6a6',
      600: '#8c8c8c',
      700: '#737373',
      800: '#595959',
      900: '#404040',
    },
    success: {
      50: '#f2f2f2',
      100: '#e6e6e6',
      200: '#cccccc',
      300: '#b3b3b3',
      400: '#999999',
      500: '#808080',
      600: '#666666',
      700: '#4d4d4d',
      800: '#333333',
      900: '#1a1a1a',
    },
    colorScheme: {
      light: {
        background: '#ffffff',
        surface: '#f4f4f4',
        text: '#171717',
        border: '#e0e0e0',
        secondary: '{secondary.400}', // #bfbfbf
      },
      dark: {
        background: '#171717',
        surface: '#262626',
        text: '#e0e0e0',
        border: '#525252',
        secondary: '{secondary.300}', // #d9d9d9
      },
    },
  },
  // Component tokens: Customize specific PrimeNG components
  components: {
    button: {
      colorScheme: {
        light: {
          background: '{primary.900}', //rgb(0, 0, 0)
          color: '#ffffff',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '0',
          fontSize: '0.875rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'background 0.2s, transform 0.2s',
          hover: {
            background: '{primary.800}', // #262626
            transform: 'scale(1.02)',
          },
          focus: {
            outline: '2px solid {primary.700}', // #404040
            outlineOffset: '2px',
            boxShadow: '0 0 0 2px {primary.700}',
          },
        },
        dark: {
          background: '{primary.50}', // #f2f2f2
          color: '#000000',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '0',
          fontSize: '0.875rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          transition: 'background 0.2s, transform 0.2s',
          hover: {
            background: '{primary.100}', // #d9d9d9
            transform: 'scale(1.02)',
          },
          focus: {
            outline: '2px solid {primary.300}', // #a6a6a6
            outlineOffset: '2px',
            boxShadow: '0 0 0 2px {primary.300}',
          },
        },
      },
    },
    input: {
      colorScheme: {
        light: {
          background: '#ffffff',
          border: '1px solid {border}', // #e0e0e0
          padding: '0.5rem',
          borderRadius: '0',
          fontSize: '0.875rem',
          color: '{text}', // #171717
          placeholder: {
            color: '{secondary.400}', // #bfbfbf
          },
          focus: {
            borderColor: '{primary.400}', // #8c8c8c
            boxShadow: '0 0 0 2px {primary.200}', // #bfbfbf
            outline: 'none',
          },
        },
        dark: {
          background: '#262626',
          border: '1px solid {border}', // #525252
          padding: '0.5rem',
          borderRadius: '0',
          fontSize: '0.875rem',
          color: '{text}', // #e0e0e0
          placeholder: {
            color: '{secondary.300}', // #d9d9d9
          },
          focus: {
            borderColor: '{primary.300}', // #a6a6a6
            boxShadow: '0 0 0 2px {primary.100}', // #d9d9d9
            outline: 'none',
          },
        },
      },
    },
    panel: {
      colorScheme: {
        light: {
          background: '{surface}', // #f4f4f4
          border: '1px solid {border}', // #e0e0e0
          borderRadius: '0',
          padding: '1rem',
          header: {
            background: '{secondary.100}', // #f0f0f0
            padding: '0.5rem 1rem',
            borderBottom: '1px solid {border}',
            fontWeight: '{typography.fontWeight.medium}',
          },
        },
        dark: {
          background: '{surface}', // #262626
          border: '1px solid {border}', // #525252
          borderRadius: '0',
          padding: '1rem',
          header: {
            background: '{secondary.700}', // #737373
            padding: '0.5rem 1rem',
            borderBottom: '1px solid {border}',
            fontWeight: '{typography.fontWeight.medium}',
          },
        },
      },
    },
  },
});

export default Dora;