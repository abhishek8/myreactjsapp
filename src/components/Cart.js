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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import FolderIcon from "@material-ui/icons/Folder";
import FolderSpecialSharpIcon from "@material-ui/icons/FolderSpecialSharp";
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
  const courseList = sessionStorage.getItem("app_cart")
    ? JSON.parse(sessionStorage.getItem("app_cart"))
    : [];

  const classes = useStyles();

  useEffect(() => {
    if (courseList && courseList.length > 0) {
      const fetchCartItems = async (courseId) => {
        const res = await courseService.getCourseById(courseId);
        if (res) {
          const data = {
            id: res._id,
            name: res.title,
            credit: res.credits.criteria,
            author: res.author.name,
          };
          setCartItems((prevItems) => [...prevItems, data]);
          setTotalCredits((prevTotal) => prevTotal + data.credit);
        }
      };

      courseList.forEach((courseId) => {
        fetchCartItems(courseId);
      });
    }
  }, []);

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
        {cartItems.length} Courses in Cart
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
          <List dense={false}>
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
              <ListItem key={item.id}>
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={item.author ? item.author : null}
                />
                <ListItemText primary={item.credit} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
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
              <ListItemText primary={totalCredits} />
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
          </List>
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

// export class Cart extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       items: [],
//       totalCredits: 0,
//     };

//     this.purchaseCourse = this.purchaseCourse.bind(this);
//   }

//   async componentDidMount() {
//     let items = JSON.parse(sessionStorage.getItem("app_cart"));
//     let service = new CourseService();
//     let courseList = [];
//     let totalCredits = 0;
//     if (items) {
//       for (let i = 0; i < items.length; i++) {
//         let data = await service.getCourseById(items[i]);
//         courseList.push({
//           id: data._id,
//           name: data.title,
//           credit: data.credits.criteria,
//         });
//         totalCredits += data.credits.criteria;
//       }
//     }
//     this.setState({
//       items: courseList,
//       totalCredits: totalCredits,
//     });
//   }

//   async purchaseCourse(e) {
//     e.preventDefault();
//     let service = new CourseService();
//     const items = this.state.items.map((item) => {
//       return { courseId: item.id, credit: item.credit };
//     });
//     const data = {
//       items: items,
//     };
//     const result = await service.purchaseCourse(data);
//     if (result) {
//       sessionStorage.setItem("app_cart", []);
//       this.props.history.push("/course/subscription");
//     }
//   }

//   render() {
//     const items = this.state.items;
//     let renderItems = items.map((item) => {
//       return (
//         <tr key={item.id}>
//           <td>{item.name}</td>
//           <td>{item.credit}</td>
//         </tr>
//       );
//     });
//     return (
//       <div>
//         <table className="table table-stripped">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Credits</th>
//             </tr>
//           </thead>
//           <tbody>{renderItems}</tbody>
//           <tfoot>
//             <tr>
//               <td>Total: </td>
//               <td>{this.state.totalCredits}</td>
//             </tr>
//           </tfoot>
//         </table>
//         <button onClick={this.purchaseCourse} className="btn btn-secondary">
//           Buy
//         </button>
//       </div>
//     );
//   }
// }

// export default Cart;
