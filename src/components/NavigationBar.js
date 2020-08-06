import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AccountCircle from "@material-ui/icons/AccountCircle";
import CartIcon from "@material-ui/icons/AddShoppingCartSharp";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {
  makeStyles,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";

const useStyles = makeStyles((theme) => ({
  brandImage: {
    cursor: "pointer",
    maxHeight: theme.spacing(4),
  },
  navGrid: {
    "& > button": {
      marginRight: theme.spacing(1),
      "&:focus": {
        borderRadius: "0",
        boxShadow: "0",
        outline: "none",
      },
    },
  },
}));

function NavigationBar(props) {
  const [anchorEl, setAnchorEl] = useState("");
  const [openSide, setSideOpen] = useState(false);

  const userContext = useContext(UserContext);
  const cartContext = useContext(CartContext);

  const history = useHistory();
  const classes = useStyles();

  const logout = () => {
    setAnchorEl(null);
    userContext.userDispatch({ type: "LOGOUT" });
    history.push("/");
  };

  const checkRole = (name) => {
    return (
      userContext.userState &&
      userContext.userState.user &&
      userContext.userState.user["role"] === name
    );
  };

  return (
    <div>
      <Drawer
        anchor="left"
        open={openSide}
        onClose={() => setSideOpen(false)}
        variant="persistent"
      >
        <List>
          <ListItem onClick={() => history.push("/")}>
            <ListItemText>Home</ListItemText>
          </ListItem>
        </List>
      </Drawer>
      <AppBar position="fixed">
        <Toolbar>
          <img
            src="/logo.png"
            onClick={() => history.push("/")}
            alt="Persistent Systems"
            className={classes.brandImage}
          />

          <Grid align="right" justify="space-between" container>
            <Grid className={classes.navGrid} item></Grid>

            <Grid className={classes.navGrid} item>
              {!userContext.userState.isAuthenticated && (
                <>
                  <Button
                    color="secondary"
                    onClick={() => history.push("/register")}
                    disableRipple
                    disableElevation
                  >
                    Sign up
                  </Button>
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={() => {
                      history.push("/login");
                    }}
                    disableRipple
                    disableElevation
                  >
                    Login
                  </Button>
                </>
              )}
              {userContext.userState.isAuthenticated && (
                <>
                  {checkRole("trainer") && (
                    <Button
                      color="secondary"
                      onClick={() => history.push("/course/my-course")}
                      disableRipple
                      disableElevation
                    >
                      My Courses
                    </Button>
                  )}
                  {checkRole("reviewer") && (
                    <Button
                      color="secondary"
                      onClick={() => history.push("/course/review")}
                      disableRipple
                      disableElevation
                    >
                      Review
                    </Button>
                  )}
                  {checkRole("user") && (
                    <>
                      <Button
                        color="secondary"
                        onClick={() => history.push("/course/subscription")}
                        disableRipple
                        disableElevation
                      >
                        Subscription
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => history.push("/user/cart")}
                        disableRipple
                        disableElevation
                      >
                        <Badge
                          color="secondary"
                          badgeContent={cartContext.cartState.length}
                        >
                          <CartIcon />
                        </Badge>
                      </Button>
                    </>
                  )}
                  <Button
                    color="secondary"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    disableRipple
                    disableElevation
                  >
                    <AccountCircle />
                  </Button>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                  >
                    {checkRole("user") && (
                      <div>
                        <MenuItem
                          onClick={() => {
                            history.push("/course/subscription");
                            setAnchorEl(null);
                          }}
                        >
                          Subscription
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            history.push("/user/cart");
                            setAnchorEl(null);
                          }}
                        >
                          Cart
                        </MenuItem>
                      </div>
                    )}
                    {checkRole("trainer") && (
                      <MenuItem
                        onClick={() => {
                          history.push("/course/my-course");
                          setAnchorEl(null);
                        }}
                      >
                        My Courses
                      </MenuItem>
                    )}
                    {checkRole("reviewer") && (
                      <MenuItem
                        onClick={() => {
                          history.push("/course/review");
                          setAnchorEl(null);
                        }}
                      >
                        Review
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={() => {
                        setAnchorEl(null);
                        history.push("/profile");
                      }}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem onClick={logout}>Logout</MenuItem>
                  </Menu>
                </>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  );
}

export default NavigationBar;
