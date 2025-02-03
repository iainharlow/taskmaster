import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      // We leave primary for general text and elements.
      main: "#2C3E50",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#95A5A6",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f4f7f9",
      paper: "#ffffff",
    },
    text: {
      primary: "#2C3E50",
      secondary: "#7F8C8D",
    },
  },
  typography: {
    fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
    fontSize: 13,
    h1: { fontSize: "2rem", fontWeight: 400 },
    h2: { fontSize: "1.75rem", fontWeight: 400 },
    h3: { fontSize: "1.5rem", fontWeight: 400 },
    h4: { fontSize: "1.75rem", fontWeight: 500 }, // Larger header text
    body1: { fontSize: "0.875rem" },
    button: { textTransform: "none" },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: "0.875rem",
          backgroundColor: "#265153", // Darker, bluish-green
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#173240",
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: "#265153",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#173240",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderWidth: "1px",
          borderColor: "#CBD2D9",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderWidth: "1px",
              borderColor: "#CBD2D9",
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          boxShadow: "none",
          borderBottom: "1px solid #CBD2D9",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          justifyContent: "space-between",
          color: "#2C3E50",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "none",
        },
      },
    },
  },
});

export default theme;