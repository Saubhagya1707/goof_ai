import { definePreset } from '@primeng/themes';
import Nora from '@primeng/themes/nora';

const Cora = definePreset(Nora, {
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
      50: '#d0e2ff',
      100: '#a6c8ff',
      200: '#78a9ff',
      300: '#4589ff',
      400: '#0f62fe', // Core IBM blue
      500: '#0f62fe',
      600: '#0f62fe',
      700: '#0f62fe',
      800: '#0f62fe',
      900: '#0f62fe',
    },
    secondary: {
      50: '#f4f4f4',
      100: '#e0e0e0',
      200: '#c6c6c6',
      300: '#a8a8a8',
      400: '#8d8d8d',
      500: '#6f6f6f',
      600: '#525252',
      700: '#393939',
      800: '#262626',
      900: '#171717',
    },
    surface: {
        50: '#f8faf8',
        100: '#f0f5f0',
        200: '#e8f0e8',
        300: '#e0ebe0',
        400: '#d8e6d8',
        500: '#d0e0d0',  // Base surface
        600: '#b8c8b8',
        700: '#a0b0a0',
        800: '#889888',
        900: '#708070',
    },
    success: {
      50: '#e6f7e6',
      100: '#c2ebc2',
      200: '#9ddf9d',
      300: '#78d378',
      400: '#54c754',
      500: '#30ba30',
      600: '#2a9e2a',
      700: '#238223',
      800: '#1d661d',
      900: '#164d16',
    },
    colorScheme: {
      light: {
        background: '#ffffff',
        surface: '#f4f4f4',
        text: '#171717',
        border: '#e0e0e0',
        hover: '{primary.50}',
        secondary: '{secondary.400}',
      },
      dark: {
        background: '#171717',
        surface: '#262626',
        text: '#e0e0e0', // Light gray instead of pure white for readability
        border: '#525252',
        hover: '{primary.400}',
        secondary: '{secondary.300}',
      },
    },
  },
  // Component tokens: Customize specific PrimeNG components
  components: {
    button: {
      colorScheme: {
        
        light: {
          
          background: '{primary.400}',
          color: '#black',
        //   border: 'none',
          paddingX: '2rem',
          paddingY: '1rem',
          fontSize: '0.875rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle depth
          transition: 'background 0.2s, transform 0.2s', // Smooth interactivity
          hover: {
            background: '{hover}',
            transform: 'scale(1.02)', // Slight scale effect
          },
          focus: {
            outline: '2px solid {primary.200}',
            outlineOffset: '2px',
            boxShadow: '0 0 0 2px {primary.200}', // Enhanced focus indicator
          },
        },
        dark: {
          background: '{primary.300}',
          color: '#ffffff',
        //   border: 'none',
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          transition: 'background 0.2s, transform 0.2s',
          hover: {
            background: '{gray.900}',
            transform: 'scale(1.02)',
          },
          focus: {
            outline: '2px solid {primary.100}',
            outlineOffset: '2px',
            boxShadow: '0 0 0 2px {primary.100}',
          },
        },
      },
    },
    input: {
      colorScheme: {
        light: {
          background: '#ffffff',
          border: '1px solid {border}',
          padding: '0.5rem',
          borderRadius: '4px',
          fontSize: '0.875rem',
          color: '{text}',
          placeholder: {
            color: '{secondary.400}',
          },
          focus: {
            borderColor: '{primary.400}',
            boxShadow: '0 0 0 2px {primary.200}', // Subtle glow on focus
            outline: 'none',
          },
        },
        dark: {
          background: '#262626',
          border: '1px solid {border}',
          padding: '0.5rem',
          borderRadius: '4px',
          fontSize: '0.875rem',
          color: '{text}',
          placeholder: {
            color: '{secondary.300}',
          },
          focus: {
            borderColor: '{primary.300}',
            boxShadow: '0 0 0 2px {primary.100}',
            outline: 'none',
          },
        },
      },
    },
    panel: {
      colorScheme: {
        light: {
          background: '{surface}',
          border: '1px solid {border}',
          borderRadius: '4px',
          padding: '1rem',
          header: {
            background: '{secondary.100}', // Distinct header
            padding: '0.5rem 1rem',
            borderBottom: '1px solid {border}',
            fontWeight: '{typography.fontWeight.medium}',
          },
        },
        dark: {
          background: '{surface}',
          border: '1px solid {border}',
          borderRadius: '4px',
          padding: '1rem',
          header: {
            background: '{secondary.700}',
            padding: '0.5rem 1rem',
            borderBottom: '1px solid {border}',
            fontWeight: '{typography.fontWeight.medium}',
          },
        },
      },
    },
    menu: {
      colorScheme: {
        light: {
          list: {
            gap: '1px'
          },
          item: {
            focusBackground: '{hover}',
            focusColor: '{text}'
          },
          background: '#ffffff',
          borderColor: '{border}',
          color: '{text}',
        },
        dark: {
          list: {
            gap: '1px'
          },
          item: {
            focusBackground: '{hover}',
            color: '{text}',
          },
          background: '#262626',
          borderColor: '{border}',
          color: '{text}',
        },
      },
    },
    breadcrumb: {
      colorScheme: {
        light: {
          background: '#ffffff'
        },
        dark: {
          background: '{surface}',
        },
      },
    },
    paginator: {
      colorScheme: {
        light: {
          background: '#ffffff',
          navButton: {
            hoverBackground: '{primary.400}'
          }
        },
        dark: {
          background: '{surface}',
          navButton: {
            hoverBackground: '{primary.400}'
          }
        },
      },
    },
    datatable: {
      colorScheme: {
        light: {
          header: {
            cell: {
              background: '#ffffff',
              hover: {
                background: '{hover}',
              }
            },
            background: '#ffffff'
          },
          row: {
            background: '#ffffff',
            hover: {
              background: '{hover}',
            }
          },
          footer: {
            background: '#ffffff'
          },
          background: '#ffffff'
        },
        dark: {
          header: {
            cell: {
              background: '{surface}',
              hover: {
                background: '{hover}',
              }
            },
            background: '{surface}'
          },
          row: {
            background: '{surface}',
            hover: {
              background: '{hover}',
            }
          },
          footer: {
            background: '{surface}',
          },
          background: '{surface}',
        },
      }, 
    }
  },
});



export default Cora;