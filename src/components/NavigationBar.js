import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserService from "../services/userService";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AccountCircle from "@material-ui/icons/AccountCircle";
import CartIcon from "@material-ui/icons/AddShoppingCartSharp";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles, Badge } from "@material-ui/core";
import { CartContext } from "../context";
//import MenuIcon from "@material-ui/icons/Menu";

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
  const [isLoggedIn, setLogin] = useState(false);
  const [role, setRole] = useState("");
  const [anchorEl, setAnchorEl] = useState("");

  const cartContext = useContext(CartContext);
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem("user_info"));
    const cookieInfo = sessionStorage.getItem("auth_cookie");
    if (userInfo) {
      setLogin(cookieInfo && cookieInfo.length > 0);
      setRole(userInfo.role);
    }
  }, []);

  const logout = () => {
    const userService = new UserService();
    userService.logoutUser();
    history.push("/login");
  };

  const checkRole = (name) => {
    return role === name;
  };

  return (
    <div>
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
              {!isLoggedIn && (
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
              {isLoggedIn && (
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

// import { NavLink } from "react-router-dom";
// import SearchComponent from "./shared/SearchComponent";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser } from "@fortawesome/free-solid-svg-icons";
// import { faSignOutAlt, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
// import { faBookReader } from "@fortawesome/free-solid-svg-icons";
// import { faHistory } from "@fortawesome/free-solid-svg-icons";
// import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
// import Navbar from "react-bootstrap/Navbar";
// import Nav from "react-bootstrap/Nav";
// import NavDropdown from "react-bootstrap/NavDropdown";
// import Image from "react-bootstrap/Image";
// import { UserConsumer } from "../userContext";
//
//
// class NavigationBar extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isLoggedIn: false,
//       isUser: false,
//       isTrainer: false,
//       isReviewer: false,
//       anchorEl: null,
//     };
//     this.logout = this.logout.bind(this);
//   }

//   componentDidMount() {
//     const node = this.wrapper.current;
//     let userData = JSON.parse(sessionStorage.getItem("user_info"));
//     this.setState({
//       isLoggedIn: sessionStorage.getItem("auth_cookie") ? true : false,
//       isUser: userData && userData.role && userData.role === "user",
//       isTrainer: userData && userData.role && userData.role === "trainer",
//       isReviewer: userData && userData.role && userData.role === "reviewer",
//     });
//   }

//   handleMenu = (event) => {
//     this.setState({ anchorEl: event.currentTarget });
//   };

//   handleClose = () => {
//     this.setState({ anchorEl: null });
//   };

//   logout(event) {
//     sessionStorage.clear();
//     this.setState({
//       isLoggedIn: false,
//       isUser: false,
//       isTrainer: false,
//       isReviewer: false,
//     });
//   }

//   wrapper = createRef();

//   render() {
//     return (
//       <div>
//         <AppBar position="fixed">
//           <Toolbar>
//             <Grid
//               align="right"
//               justify="space-between" // Add it here :)
//               container
//             >
//               <Grid item>
//                 <Button color="secondary">
//                   <Link color="inherit" className="navbar-links" href="/">
//                     {" "}
//                     Persistent System
//                   </Link>
//                 </Button>
//                 {this.state.isTrainer && (
//                   <Button color="secondary">
//                     <Link
//                       color="inherit"
//                       className="navbar-links"
//                       href="/course/my-course"
//                     >
//                       {" "}
//                       My Courses
//                     </Link>
//                   </Button>
//                 )}
//                 {this.state.isReviewer && (
//                   <Button color="secondary">
//                     <Link
//                       color="inherit"
//                       className="navbar-links"
//                       href="/course/review"
//                     >
//                       Review
//                     </Link>
//                   </Button>
//                 )}
//                 {this.state.isUser && (
//                   <Button color="secondary">
//                     <Link
//                       color="inherit"
//                       className="navbar-links"
//                       href="/course/subscription"
//                     >
//                       Subscription
//                     </Link>
//                   </Button>
//                 )}
//               </Grid>

//               <Grid item>
//                 {!this.state.isLoggedIn && (
//                   <>
//                     <Button color="secondary">
//                       <Link
//                         color="inherit"
//                         className="navbar-links"
//                         href="/login"
//                       >
//                         Sign up
//                       </Link>
//                     </Button>
//                     <Button color="secondary" variant="outlined">
//                       <Link
//                         color="inherit"
//                         className="navbar-links"
//                         href="/login"
//                       >
//                         Login
//                       </Link>
//                     </Button>
//                   </>
//                 )}
//                 {this.state.isLoggedIn && (
//                   <>
//                     <IconButton color="secondary">
//                       <Link color="inherit" href="/user/cart">
//                         <CartIcon />
//                       </Link>
//                     </IconButton>
//                     <IconButton color="secondary" onClick={this.handleMenu}>
//                       <AccountCircle />
//                     </IconButton>
//                     <Menu
//                       id="menu-appbar"
//                       anchorEl={this.state.anchorEl}
//                       anchorOrigin={{
//                         vertical: "top",
//                         horizontal: "right",
//                       }}
//                       keepMounted
//                       transformOrigin={{
//                         vertical: "top",
//                         horizontal: "right",
//                       }}
//                       open={Boolean(this.state.anchorEl)}
//                       onClose={this.handleClose}
//                       ref={this.wrapper}
//                     >
//                       <MenuItem onClick={this.handleClose}>
//                         <Link href="/profile">Profile</Link>
//                       </MenuItem>
//                       <MenuItem onClick={this.logout}>Logout</MenuItem>
//                     </Menu>
//                   </>
//                 )}
//               </Grid>
//             </Grid>
//           </Toolbar>
//         </AppBar>
//         <Toolbar />
//       </div>
//       // <Navbar bg="light" sticky="top" expand="lg" ref={this.wrapper}>
//       //   <Navbar.Brand>
//       //     <Nav.Link href="/">
//       //       <Image
//       //         src="https://www.persistent.com/wp-content/uploads/2020/06/persistentsys-header-logo.png"
//       //         width="100"
//       //         height="40"
//       //         className="d-inline-block align-top"
//       //         alt="See Beyond, Rise Above"
//       //       />
//       //     </Nav.Link>
//       //   </Navbar.Brand>
//       //   <Navbar.Toggle aria-controls="basic-navbar-nav" />
//       //   <Navbar.Collapse id="basic-navbar-nav">
//       //     <Nav className="mr-auto">
//       //       {/* <Navbar.Brand>
//       //         <Nav.Link href="/browse">
//       //           {" "}
//       //           <FontAwesomeIcon icon={faBookReader} /> Browse
//       //         </Nav.Link>
//       //       </Navbar.Brand> */}
//       //       <UserConsumer>
//       //         {(value) => {
//       //           if (value.isLoggedIn && value.isTrainer) {
//       //             return (
//       //               <Navbar.Brand>
//       //                 <Nav.Link href="/course/my-course">
//       //                   {" "}
//       //                   <FontAwesomeIcon icon={faHistory} /> My Courses
//       //                 </Nav.Link>
//       //               </Navbar.Brand>
//       //             );
//       //           }
//       //           if (value.isLoggedIn && value.isReviewer) {
//       //             return (
//       //               <Navbar.Brand>
//       //                 <Nav.Link href="/course/review">
//       //                   {" "}
//       //                   <FontAwesomeIcon icon={faHistory} /> Review
//       //                 </Nav.Link>
//       //               </Navbar.Brand>
//       //             );
//       //           }
//       //           if (value.isLoggedIn && value.isUser) {
//       //             return (
//       //               <Navbar.Brand>
//       //                 <Nav.Link href="/course/subscription">
//       //                   {" "}
//       //                   <FontAwesomeIcon icon={faHistory} /> Subscription
//       //                 </Nav.Link>
//       //               </Navbar.Brand>
//       //             );
//       //           }
//       //         }}
//       //       </UserConsumer>
//       //     </Nav>
//       //     {/* <SearchComponent /> */}
//       //     <UserConsumer>
//       //       {(value) => {
//       //         if (value.isLoggedIn) {
//       //           return (
//       //             <Nav className="mr-auto">
//       //               {value.isUser && (
//       //                 <Navbar.Brand>
//       //                   <Nav.Link href="/user/cart">
//       //                     {" "}
//       //                     <FontAwesomeIcon icon={faCartPlus} />
//       //                   </Nav.Link>
//       //                 </Navbar.Brand>
//       //               )}
//       //               <NavDropdown
//       //                 title={<FontAwesomeIcon icon={faUser} />}
//       //                 id="basic-nav-dropdown"
//       //               >
//       //                 <Navbar.Brand>
//       //                   <Nav.Link as={NavLink} to="/profile">
//       //                     <FontAwesomeIcon icon={faUser} /> Profile
//       //                   </Nav.Link>
//       //                 </Navbar.Brand>
//       //                 <NavDropdown.Divider />
//       //                 <Navbar.Brand>
//       //                   <Nav.Link
//       //                     as={NavLink}
//       //                     onClick={(e) => {
//       //                       this.logout(e);
//       //                       value.setLogin(false);
//       //                     }}
//       //                     to="/login"
//       //                   >
//       //                     <FontAwesomeIcon icon={faSignOutAlt} /> Logout
//       //                   </Nav.Link>
//       //                 </Navbar.Brand>
//       //               </NavDropdown>
//       //             </Nav>
//       //           );
//       //         } else {
//       //           return (
//       //             <Nav className="mr-auto">
//       //               <Navbar.Brand>
//       //                 <Nav.Link href="/Login">
//       //                   {" "}
//       //                   <FontAwesomeIcon icon={faSignInAlt} /> Login{" "}
//       //                 </Nav.Link>{" "}
//       //               </Navbar.Brand>
//       //             </Nav>
//       //           );
//       //         }
//       //       }}
//       //     </UserConsumer>
//       //   </Navbar.Collapse>
//       // </Navbar>
//     );
//   }
// }

// export default NavigationBar;

// //import { faHome } from "@fortawesome/free-solid-svg-icons";
// //import { faBell } from "@fortawesome/free-solid-svg-icons";
// //import { faCog } from "@fortawesome/free-solid-svg-icons";
// //import { faHistory } from "@fortawesome/free-solid-svg-icons";
// //import LoginService from "../services/loginService";
// //import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// //import Tooltip from "react-bootstrap/Tooltip";

// /* <Navbar.Brand><Link to="/About"> About </Link></Navbar.Brand>
//                 <Navbar.Brand><Link to="/GithubUsers"> Users </Link> </Navbar.Brand> */
// /* <Form inline>
//                         <FormControl type="text" placeholder="Search" className="mr-sm-2" />
//                         <Button variant="outline-success">Search</Button>
//                 </Form> */

// /* <Navbar.Brand>
//           <OverlayTrigger
//             key="bottom"
//             placement="bottom"
//             overlay={
//               <Tooltip>
//                 <strong>Notifications</strong>
//               </Tooltip>
//             }
//           >
//             <FontAwesomeIcon icon={faBell} />
//           </OverlayTrigger>
//         </Navbar.Brand> */

// // let button;

// //     if (isLoggedIn) {
// //       button = (
// //         <Nav className="">
// //           <NavDropdown
// //             title={<FontAwesomeIcon icon={faUser} />}
// //             id="basic-nav-dropdown"
// //             className=""
// //           >
// //             <Navbar.Brand>
// //               <Nav.Link as={NavLink} to="/profile">
// //                 <FontAwesomeIcon icon={faUser} /> Profile
// //               </Nav.Link>
// //             </Navbar.Brand>
// //             <NavDropdown.Divider />
// //             <Navbar.Brand>
// //               <Nav.Link as={NavLink} onClick={this.logout} to="/login">
// //                 <FontAwesomeIcon icon={faSignOutAlt} /> Logout
// //               </Nav.Link>
// //             </Navbar.Brand>

// //             {/* <Link as={NavLink} to="/history">
// //                 <FontAwesomeIcon icon={faHistory} /> History
// //               </Link>
// //               <Link as={NavLink} to="/settings">
// //                 <FontAwesomeIcon icon={faCog} /> Account Settings
// //               </Link> */}
// //           </NavDropdown>
// //         </Nav>
// //       );
// //     } else {
// //       button = (
// //         <Nav className="ml-auto">
// //           <Navbar.Brand>
// //             <Nav.Link href="/Login">
// //               {" "}
// //               <FontAwesomeIcon icon={faSignInAlt} /> Login{" "}
// //             </Nav.Link>{" "}
// //           </Navbar.Brand>
// //         </Nav>
// //       );
// //     }
