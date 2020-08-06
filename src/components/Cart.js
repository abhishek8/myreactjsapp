import React, { useState, useEffect, useContext, useRef } from "react";
import CourseService from "../services/courseService";
import {
  Typography,
  Paper,
  CardMedia,
  CardContent,
  makeStyles,
  Button,
  Avatar,
  ListItemText,
  IconButton,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Container from "react-bootstrap/Container";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  card: {
    height: "60%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "30%",
    maxWidth: "500px",
    maxHeight: "500px",
  },
  cardContent: {
    flexGrow: 1,
    paddingTop: "0",
    paddingBottom: "0",
  },
}));

function Cart(props) {
  const [cartItems, setCartItems] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);

  const [confirmPurchase, setConfirmPurchase] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchaseError, setPurchaseError] = useState(false);
  const [lessBalance, setLessBalance] = useState(false);
  const courseService = new CourseService();

  const userContext = useRef(useContext(UserContext));
  const cartContext = useContext(CartContext);

  const classes = useStyles();

  useEffect(() => {
    const courseList = cartContext.cartState;
    if (courseList && courseList.length > 0) {
      const fetchCartItems = async (courseId) => {
        const service = new CourseService();
        const res = await service.getCourseById(courseId);
        if (res) {
          const data = {
            id: res._id,
            name: res.title,
            credit: res.credits.criteria,
            author: res.author.name,
            thumbnail: res.thumbnail,
          };
          setCartItems((prevItems) => [...prevItems, data]);
        }
      };

      courseList.forEach((courseId) => {
        fetchCartItems(courseId);
      });
    }
  }, [cartContext]);

  useEffect(() => {
    if (cartItems.length > 0) {
      console.log(cartItems);
      let total = 0;
      cartItems.forEach((item) => {
        total += item.credit;
      });
      setTotalCredits(total);
    }
  }, [cartItems]);

  const removeFromCart = (courseId) => {
    cartContext.cartDispatch({ type: "REMOVE", courseId: courseId });
    setCartItems((prev) => prev.filter((c) => c.id !== courseId));
  };

  const purchaseCourse = async (event) => {
    event.preventDefault();

    const balance = userContext.current.userState.user["creditBalance"];
    if (balance < totalCredits) setLessBalance(true);
    else {
      const items = cartItems.map((item) => {
        return { courseId: item.id, credit: item.credit };
      });

      const data = {
        items: items,
      };

      const result = await courseService.purchaseCourse(data);

      if (result) {
        cartContext.cartDispatch({ type: "CLEAR" });
        userContext.current.userDispatch({ type: "RESET" });
        props.history.push("/course/subscription");
        setPurchaseSuccess(true);
      } else {
        setPurchaseError(true);
      }
    }

    setConfirmPurchase(false);
  };

  return (
    <div>
      <br />
      <Typography variant="h5" component="h5">
        Course Cart
      </Typography>
      <br />
      <Typography variant="subtitle1" component="h6">
        {cartItems.length < 2
          ? cartItems.length + " Course "
          : cartItems.length + " Courses "}{" "}
        in Cart
      </Typography>
      {cartItems.length === 0 && (
        <div>
          <Container>
            <Paper align="center" className={classes.card}>
              <div>
                <CardMedia
                  image="https://www.netclipart.com/pp/m/3-39507_cart-clipart-ferris-wheel-shopping-cart.png"
                  title="Empty Cart"
                  className={classes.cardMedia}
                />
              </div>
              <CardContent className={classes.cardContent}>
                <Typography variant="caption" component="h4">
                  Your cart is empty. Keep looking for a course.
                </Typography>
              </CardContent>
            </Paper>
          </Container>
        </div>
      )}
      {cartItems.length > 0 && (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Details</TableCell>
                  <TableCell align="center">Credits</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Avatar src={item.thumbnail} size="large" />
                    </TableCell>
                    <TableCell>
                      <ListItemText
                        primary={item.name}
                        secondary={item.author ? item.author : null}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {Number(item.credit).toFixed(1)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} align="right">
                    Total Credits
                  </TableCell>
                  <TableCell align="center">
                    {Number(totalCredits).toFixed(1)}
                  </TableCell>
                  <TableCell />
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography
                      color="secondary"
                      variant="caption"
                      component="span"
                    >
                      You have{" "}
                      {userContext.current.userState.user.creditBalance} credits
                      in your account.
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={() => setConfirmPurchase(true)}
                      variant="contained"
                      color="primary"
                      size="medium"
                    >
                      Buy
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      <Dialog open={confirmPurchase}>
        <DialogTitle>Do you wish to proceed with the transaction</DialogTitle>
        <DialogActions>
          <Button color="secondary" onClick={() => setConfirmPurchase(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={purchaseCourse}>
            Buy
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={purchaseError}
        autoHideDuration={5000}
        onClose={() => setPurchaseError(false)}
      >
        <Alert severity="error">
          Transaction Failed! Please try again or get in touch with support
          team.
        </Alert>
      </Snackbar>
      <Snackbar
        open={lessBalance}
        autoHideDuration={5000}
        onClose={() => setLessBalance(false)}
      >
        <Alert severity="error">Transaction Failed! Insufficient Balace.</Alert>
      </Snackbar>
      <Snackbar
        open={purchaseSuccess}
        autoHideDuration={5000}
        onClose={() => setPurchaseSuccess(false)}
      >
        <Alert severity="success">Your transaction is successful.</Alert>
      </Snackbar>
    </div>
  );
}

export default Cart;
