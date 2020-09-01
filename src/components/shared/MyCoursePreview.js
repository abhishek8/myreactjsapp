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
import EditIcon from "@material-ui/icons/Edit";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import {
  makeStyles,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  DialogContentText,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(0),
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
    paddingTop: "60%",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    height: "100%",
    flexGrow: 1,
    paddingTop: theme.spacing(1),
    "&:last-child": {
      paddingBottom: theme.spacing(0),
    },
  },
  avatar: {
    margin: theme.spacing(1),
  },
}));

function MyCoursePreview(props) {
  const course = props.course;
  const title = AppUtils.getShortText(props.course.title, 35);
  const author = AppUtils.getShortText(props.course.author.name, 20);
  var credit = props.course.credits.criteria.toFixed(1).toString();
  credit = credit === "0.0" ? "Free" : credit + " credits";
  const avg_rating = Number(course.ratings.avg_rating.toFixed(1));

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [confirmEditForDeactive, setConfirmEditForDeactivate] = useState(false);

  const classes = useStyles();

  const deactivateCourse = (e) => {
    setConfirmDeactivate(false);
    props.handleDeactivate(course._id);
  };

  const removeCourse = (e) => {
    setConfirmDelete(false);
    props.handleRemove(course._id);
  };

  const handleEdit = (e) => {
    if (course.status === "DEACTIVATED") setConfirmEditForDeactivate(true);
    else props.handleEdit();
  };

  return (
    <Grid item xs={12} sm={4} md={3} key={course._id}>
      <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          image={course.thumbnail}
          title={course.title}
          onClick={props.handleClick}
        />
        <CardContent className={classes.cardContent}>
          <Typography variant="h6" component="h6">
            {title}
          </Typography>
          <Typography variant="caption" component="p">
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
          </Typography>
          <Grid container justify="space-around">
            <Grid item>
              <Chip
                label={props.course.credits.score.toFixed(1) + " credit gain"}
                color="default"
                size="small"
                icon={<ScoreIcon />}
              />
            </Grid>
            <Grid item>
              <Typography color="secondary" variant="h6" component="h6">
                {credit}
              </Typography>
            </Grid>
          </Grid>

          <Grid container justify="center">
            <Grid item>
              {!(course.status === "COMPLETED") && (
                <IconButton
                  variant="contained"
                  color="primary"
                  size="medium"
                  onClick={handleEdit}
                >
                  <EditIcon />
                </IconButton>
              )}
            </Grid>
            <Grid>
              {(course.status === "CREATED" ||
                course.status === "COMPLETED") && (
                <IconButton
                  variant="contained"
                  color="secondary"
                  size="medium"
                  onClick={() => setConfirmDelete(true)}
                >
                  <DeleteForeverIcon />
                </IconButton>
              )}
              {course.status === "ACTIVE" && (
                <IconButton
                  variant="contained"
                  color="secondary"
                  size="medium"
                  onClick={() => setConfirmDeactivate(true)}
                >
                  <VisibilityOffIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        keepMounted
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
      >
        <DialogTitle>Are you sure you want to delete this course?</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item>
              <Avatar src={course.thumbnail} className={classes.avatar} />
            </Grid>
            <Grid item>
              <Typography variant="h6" component="h6">
                {title}
              </Typography>
              <Typography variant="body1" component="p">
                {author}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} color="default">
            Cancel
          </Button>
          <Button onClick={removeCourse} color="secondary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        keepMounted
        open={confirmDeactivate}
        onClose={() => setConfirmDeactivate(false)}
      >
        <DialogTitle>
          Are you sure you want to deactivate this course?
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item>
              <Avatar src={course.thumbnail} className={classes.avatar} />
            </Grid>
            <Grid item>
              <Typography variant="h6" component="h6">
                {title}
              </Typography>
              <Typography variant="body1" component="p">
                {author}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeactivate(false)} color="default">
            Cancel
          </Button>
          <Button onClick={deactivateCourse} color="secondary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmEditForDeactive}
        onClose={() => setConfirmEditForDeactivate(false)}
      >
        <DialogTitle>Are you sure you want to edit this course?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Once submitted and approved, the course will be activated again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmEditForDeactivate(false)}
            color="default"
          >
            Cancel
          </Button>
          <Button onClick={props.handleEdit} color="secondary" autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default MyCoursePreview;
