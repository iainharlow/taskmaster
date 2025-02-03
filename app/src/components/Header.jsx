import React from "react";
import { IconButton, Menu, MenuItem, AppBar, Toolbar, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Header = ({ sortBy, setSortBy }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = (value) => {
    if (value) {
      setSortBy(value);
    }
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="inherit">
      <Toolbar>
        <Typography variant="h4" style={{ color: "#2C3E50" }}>
          Taskmaster
        </Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            onClick={handleSortClick}
            sx={{ borderRadius: 2 }}
          >
            <Typography variant="body1" style={{ marginRight: "0.25rem", color: "#2C3E50" }}>
              Sort By: {sortBy}
            </Typography>
            <ArrowDropDownIcon />
          </IconButton>
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleSortClose(null)}
          >
            <MenuItem onClick={() => handleSortClose("created_at")}>
              Created At
            </MenuItem>
            <MenuItem onClick={() => handleSortClose("urgency")}>
              Urgency
            </MenuItem>
            <MenuItem onClick={() => handleSortClose("estimated_size")}>
              Estimated Size
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;