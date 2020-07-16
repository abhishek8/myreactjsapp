import React, { useState } from "react";
import AppUtils from "../../utilities/AppUtils";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";
import Chip from "@material-ui/core/Chip";
import ScoreIcon from "@material-ui/icons/Score";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import CheckIcon from "@material-ui/icons/CheckCircle";
import { makeStyles, Button, IconButton } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      cursor: "pointer",
    },
  },
  cardMedia: {
    paddingTop: "50%",
    "&:hover": {
      backgroundColor: "#000",
      opacity: 0.2,
    },
  },
  cardContent: {
    flexGrow: 1,
    paddingTop: "0",
    paddingBottom: "0",
  },
}));

function CoursePreview(props) {
  const userInfo = JSON.parse(sessionStorage.getItem("user_info"));
  const cookieInfo = sessionStorage.getItem("auth_cookie");
  const isLoggedIn = cookieInfo && cookieInfo.length > 0 ? true : false;
  const role = userInfo ? userInfo.role : "";

  const [cart, setCart] = useState(sessionStorage.getItem("app_cart"));

  const course = props.course;
  const title = AppUtils.getShortText(props.course.title, 35);
  const author = AppUtils.getShortText(props.course.author.name, 20);
  var credit = props.course.credits.criteria.toFixed(1).toString();
  credit = credit === "0.0" ? "Free" : credit + " credits";
  const avg_rating = Number(course.ratings.avg_rating.toFixed(1));

  const classes = useStyles();

  const checkRole = (name) => {
    return role === name;
  };

  const showCart = () => {
    return isLoggedIn && checkRole("user") && props.checkForCart;
  };

  const toggleCart = () => {
    return cart ? cart.includes(course._id) : false;
  };

  const addToCart = (e) => {
    e.preventDefault();
    var cartItems = cart ? cart : [];
    cartItems.push(course._id);
    sessionStorage.setItem("app_cart", JSON.stringify(cartItems));
    setCart(cartItems);
  };

  const handleClick = (e) => {
    if (props.handleClick) {
      props.handleClick();
    }
  };

  const handleEdit = (e) => {
    if (props.handleEdit) {
      props.handleEdit();
    }
  };

  const handleRemove = (e) => {
    if (props.handleRemove) {
      props.handleRemove();
    }
  };

  const handleAccept = (e) => {
    if (props.handleAccept) {
      props.handleAccept();
    }
  };

  const handleReject = (e) => {
    if (props.handleReject) {
      props.handleReject();
    }
  };

  return (
    <Grid item xs={12} sm={4} md={3} key={course._id}>
      <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          image={course.thumbnail}
          title={course.title}
          onClick={handleClick}
        />
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="h6" component="h6">
            {title}
          </Typography>
          <Typography variant="caption" component="h5">
            {author}
          </Typography>
          <Typography variant="caption" component="h5">
            {avg_rating.toFixed(1)}{" "}
            <Rating
              name="courseRating"
              value={avg_rating}
              precision={0.5}
              size="small"
              readOnly
            />{" "}
            ({course.ratings.total_count}){" "}
            <Chip
              label={props.course.credits.score.toFixed(1) + " credits"}
              color="default"
              size="small"
              icon={<ScoreIcon />}
            />
          </Typography>
          <Typography variant="h6" component="h4">
            {credit}
          </Typography>
          {showCart() && !toggleCart() && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={addToCart}
            >
              Add to <ShoppingCartIcon />
            </Button>
          )}
          {showCart() && toggleCart() && (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => props.history.push("/user/cart")}
            >
              Go to <ShoppingCartIcon />
            </Button>
          )}
          {props.isAuthor && checkRole("trainer") && (
            <>
              <IconButton
                variant="contained"
                color="primary"
                size="medium"
                onClick={handleEdit}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                variant="contained"
                color="secondary"
                size="medium"
                onClick={handleRemove}
              >
                <DeleteForeverIcon />
              </IconButton>
            </>
          )}
          {props.isReviewer && checkRole("reviewer") && (
            <>
              <IconButton
                variant="contained"
                color="primary"
                size="medium"
                onClick={handleAccept}
              >
                <CheckIcon />
              </IconButton>
              <IconButton
                variant="contained"
                color="secondary"
                size="medium"
                onClick={handleReject}
              >
                <CancelRoundedIcon />
              </IconButton>
            </>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}

export default CoursePreview;

/* <div className="card course-card" height="75">
        <div className="card-body" height="75">
          <img
            src={props.course.thumbnail}
            alt=""
            style={{ width: "250px", height: "150px" }}
          />
          <h5 className="card-title">{props.course.title}</h5>
          <p>{props.course.author.name}</p>
          <p>
            {props.course.ratings.avg_rating.toFixed(1)}{" "}
            <Rating
              name="courseRating"
              value={3.5}
              precision={0.5}
              size="small"
              readOnly
            />{" "}
            ({props.course.ratings.total_count})
          </p>
          <p>
            <b>
              {props.course.credits.criteria.toFixed(1) == 0
                ? "Free"
                : props.course.credits.criteria.toFixed(1) + " credits"}
            </b>
          </p>
          <p>
            <Chip
              label={props.course.credits.score.toFixed(1) + " credits"}
              color="primary"
              size="small"
              icon={<ScoreIcon />}
            />
          </p>
          <div className="">
            {props.isFree && (
              <button
                onClick={() => props.history.push("/video/" + props.course._id)}
                className="btn btn-outline-secondary"
                style={{ margin: "0.3rem" }}
              >
                Go to Course
              </button>
            )}
            {!props.isInCart && !props.isFree && (
              <button
                onClick={() => props.addToCart(props.course._id)}
                className="btn btn-outline-secondary"
                style={{ margin: "0.3rem" }}
              >
                Add To Cart
              </button>
            )}
            {props.isInCart && (
              <button
                onClick={() => props.history.push("/user/cart")}
                className="btn btn-outline-secondary"
                style={{ margin: "0.3rem" }}
              >
                Go To Cart
              </button>
            )}
          </div>
        </div>
      </div> */
