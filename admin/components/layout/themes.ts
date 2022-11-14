import { defaultTheme } from "react-admin";

export const lightTheme = {
  palette: {
    primary: {
      main: "#4f3cc9",
    },
    secondary: {
      light: "#5f5fc4",
      main: "#283593",
      dark: "#001064",
      contrastText: "#fff",
    },
    mode: "light" as "light",
  },
  sidebar: {
    width: 260,
    paddingLeft: 6,
  },
  components: {
    ...defaultTheme.components,
    MuiAppBar: {
      styleOverrides: {
        colorSecondary: {
          color: "#FFF",
          backgroundColor: "#343a3f",
          border: "none",
          boxShadow: "0px 0px 10px #000"
        },
      },
    },
    RaMenuItemLink: {
      styleOverrides: {
        root: {
          margin: '2px auto',
          width: '95%',
          color: "rgba(255,255,255,0.6)",
          padding: "0.8rem 0.8rem",
          fontSize: '0.85rem',
          "& svg": {
            height: '1.4rem',
            width: '1.4rem',
            color: "rgba(255,255,255,0.6)"
          },
          "&:hover": {
            background: "#ebedec",
            color: "#343a3f",
            fontWeight: 600,
            borderRadius: 10,
            "& svg": {
              color: "#101a32"
            }
          },
          "&.RaMenuItemLink-active": {
            background: "#ebedec",
            color: "#343a3f",
            fontWeight: 600,
            borderRadius: 10,
            "& svg": {
              color: "#101a32"
            }
          }
        },
      }
    },
    RaSidebar: {
      styleOverrides: {
        root: {
          backgroundColor: "#212528",
          borderRight: '2px solid rgba(17,24,39, 0.1)',
          "& .RaSidebar-paper": {
            background: '#212528'
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: '0.8rem',
        }
      }
    },
    RaLayout: {
      styleOverrides: {
        root: {
          "& .RaLayout-content": {
            background: '#f1f5f9'
          }
        }
      }
    },
    RaDatagrid: {
      styleOverrides: {
        root: {
          "& .RaDatagrid-headerCell": {
            padding: '1rem 1rem',
            fontWeight: 'bold',
            color: "#111827"
          },
          "& .RaDatagrid-rowEven": {
            background: "#f0f3ff",
            "&:hover": {
              background: "#f0f3ff"
            }
          },
          "& .RaDatagrid-rowOdd:hover": {
            background: "#fff"
          }
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#f5f5f5",
        },
        barColorPrimary: {
          backgroundColor: "#d7d7d7",
        },
      },
    },
    RaEdit: {
      styleOverrides: {
        root: {
          "& .RaEdit-main": {
            maxHeight: '90vh',
            overflowY: 'scroll'
          }
        }
      }
    }
  },
};
