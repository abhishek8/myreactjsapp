import React, { useState, useEffect } from "react";
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
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Container from "react-bootstrap/Container";

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
  const courseService = new CourseService();

  const classes = useStyles();

  useEffect(() => {
    const courseList = sessionStorage.getItem("app_cart")
      ? JSON.parse(sessionStorage.getItem("app_cart"))
      : [];
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
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      let total = 0;
      cartItems.forEach((item) => {
        total += item.credit;
      });
      console.log(total);
      setTotalCredits(total);
    }
  }, [cartItems]);

  const removeFromCart = async (courseId) => {
    let items = JSON.parse(sessionStorage.getItem("app_cart"));
    items.splice(items.indexOf(courseId), 1);
    sessionStorage.setItem("app_cart", JSON.stringify(items));

    let cart = cartItems;
    cart = cart.filter((item) => item.id !== courseId);
    setCartItems(cart);
  };

  const purchaseCourse = async (event) => {
    event.preventDefault();

    const items = cartItems.map((item) => {
      return { courseId: item.id, credit: item.credit };
    });

    const data = {
      items: items,
    };

    const result = await courseService.purchaseCourse(data);

    if (result) {
      sessionStorage.setItem("app_cart", []);
      props.history.push("/course/subscription");
    }
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
                  <TableCell colSpan={3} />
                  <TableCell align="center">
                    <Button
                      onClick={purchaseCourse}
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

          {/* <List dense={false}>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <FolderSpecialSharpIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Name" />
              <ListItemText primary="Credits" />
            </ListItem>
            {cartItems.map((item) => (
              <ListItem key={item.id} justify="center">
                <ListItemAvatar>
                  <Avatar src={item.thumbnail} size="large" />
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={item.author ? item.author : null}
                />
                <ListItemText primary={item.credit} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={removeFromCart}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            <hr />
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <FolderSpecialSharpIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Total :" />
              <ListItemText align="center" primary={totalCredits} />
              <ListItemSecondaryAction>
                <Button
                  edge="end"
                  onClick={purchaseCourse}
                  variant="contained"
                  color="primary"
                  size="medium"
                >
                  Buy
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </List> */}
          {/* <table className="table table-stripped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.credit}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total: </td>
                <td>{totalCredits}</td>
              </tr>
            </tfoot>
          </table> */}
        </>
      )}
    </div>
  );
}

export default Cart;
