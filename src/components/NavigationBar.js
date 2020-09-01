import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import CartIcon from "@material-ui/icons/AddShoppingCartSharp";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {
  makeStyles,
  Badge,
  IconButton,
  Drawer,
  List,
  ListItem,
  Hidden,
} from "@material-ui/core";
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
  navList: {
    display: "flex",
    flexDirection: "row",
    padding: 0,
    "& > li": {
      width: "auto",
      paddingLeft: 0,
      paddingRight: theme.spacing(1),
    },
  },
  brandImage: {
    cursor: "pointer",
    maxHeight: theme.spacing(4),
  },
  rootGrid: {
    justifyContent: "space-between",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "center",
    },
  },
  brandGrid: {
    alignSelf: "center",
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

  const renderNavigationLinks = () => {
    if (!userContext.userState.isAuthenticated) {
      return (
        <>
          <ListItem>
            <Button
              color="secondary"
              onClick={() => history.push("/register")}
              disableRipple
              disableElevation
            >
              Sign up
            </Button>
          </ListItem>
          <ListItem>
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
          </ListItem>
        </>
      );
    } else {
      if (checkRole("trainer")) {
        return (
          <>
            <ListItem>
              <Button
                color="secondary"
                onClick={() => history.push("/course/manage")}
                disableRipple
                disableElevation
              >
                Manage
              </Button>
            </ListItem>
            <ListItem>
              <Button
                color="secondary"
                onClick={() => history.push("/course/my-course")}
                disableRipple
                disableElevation
              >
                My Courses
              </Button>
            </ListItem>
          </>
        );
      } else if (checkRole("reviewer")) {
        return (
          <>
            <ListItem>
              <Button
                color="secondary"
                onClick={() => history.push("/course/pending")}
                disableRipple
                disableElevation
              >
                Pending
              </Button>
            </ListItem>
            <ListItem>
              <Button
                color="secondary"
                onClick={() => history.push("/course/review")}
                disableRipple
                disableElevation
              >
                Reviewed
              </Button>
            </ListItem>
          </>
        );
      } else if (checkRole("user")) {
        return (
          <>
            <ListItem>
              <Button
                color="secondary"
                onClick={() => history.push("/course/subscription")}
                disableRipple
                disableElevation
              >
                Subscription
              </Button>
            </ListItem>
            <ListItem>
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
                  Cart&nbsp;
                  <CartIcon />
                </Badge>
              </Button>
            </ListItem>
          </>
        );
      }
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setSideOpen(open);
  };

  return (
    <div>
      <Hidden smUp>
        <Drawer
          anchor="left"
          open={openSide}
          onClose={toggleDrawer(false)}
          align="center"
          justify="center"
        >
          <List
            className={classes.list}
            align="center"
            justify="center"
            onClick={toggleDrawer(false)}
          >
            <ListItem>
              <img
                src="/logo.png"
                onClick={() => history.push("/")}
                alt="Persistent Systems"
                className={classes.brandImage}
              />
              <br />
              <br />
            </ListItem>
            <ListItem>
              <Button
                color="secondary"
                onClick={() => history.push("/")}
                disableRipple
              >
                Home
              </Button>
            </ListItem>
            {renderNavigationLinks()}
            {userContext.userState.isAuthenticated && (
              <>
                <ListItem>
                  <Button
                    color="secondary"
                    onClick={() => history.push("/profile")}
                    disableRipple
                    disableElevation
                  >
                    Profile
                  </Button>
                </ListItem>
                <ListItem>
                  <Button
                    color="secondary"
                    onClick={logout}
                    disableRipple
                    disableElevation
                  >
                    Logout
                  </Button>
                </ListItem>
              </>
            )}
          </List>
        </Drawer>
      </Hidden>
      <AppBar position="fixed">
        <Toolbar>
          <Hidden smUp>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer(true)}
              edge="start"
            >
              <MenuIcon color="secondary" />
            </IconButton>
          </Hidden>

          <Grid className={classes.rootGrid} align="right" container>
            <Grid className={classes.brandGrid} item>
              <img
                src="/logo.png"
                onClick={() => history.push("/")}
                alt="Persistent Systems"
                className={classes.brandImage}
              />
            </Grid>
            <Hidden xsDown>
              <Grid className={classes.navGrid} item>
                <List className={classes.navList}>
                  {renderNavigationLinks()}
                  {userContext.userState.isAuthenticated && (
                    <ListItem>
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
                          <div>
                            <MenuItem
                              onClick={() => {
                                history.push("/course/manage");
                                setAnchorEl(null);
                              }}
                            >
                              Manage
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                history.push("/course/my-course");
                                setAnchorEl(null);
                              }}
                            >
                              My Courses
                            </MenuItem>
                          </div>
                        )}
                        {checkRole("reviewer") && (
                          <div>
                            <MenuItem
                              onClick={() => {
                                history.push("/course/pending");
                                setAnchorEl(null);
                              }}
                            >
                              Pending
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                history.push("/course/review");
                                setAnchorEl(null);
                              }}
                            >
                              Reviewed
                            </MenuItem>
                          </div>
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
                    </ListItem>
                  )}
                </List>
              </Grid>
            </Hidden>
          </Grid>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  );
}

export default NavigationBar;
