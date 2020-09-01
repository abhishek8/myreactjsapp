import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import AppUtils from "../../utilities/AppUtils";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";
import Chip from "@material-ui/core/Chip";
import ScoreIcon from "@material-ui/icons/Score";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import CheckIcon from "@material-ui/icons/CheckCircle";
import {
  makeStyles,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
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

function ReviewPreview(props) {
  const course = props.course;
  const title = AppUtils.getShortText(props.course.title, 35);
  const author = AppUtils.getShortText(props.course.author.name, 20);
  var credit = props.course.credits.criteria.toFixed(1).toString();
  credit = credit === "0.0" ? "Free" : credit + " credits";
  const avg_rating = Number(course.ratings.avg_rating.toFixed(1));

  const [confirmChange, setConfirmChanges] = useState({
    state: false,
    approve: null,
  });

  const history = useHistory();
  const classes = useStyles();

  const verifyCourse = (status) => {
    setConfirmChanges({ state: false, approve: null });
    props.verifyCourse(course._id, status);
  };

  return (
    <Grid item xs={12} sm={4} md={3} key={course._id}>
      <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          image={course.thumbnail}
          title={course.title}
          onClick={() => history.push(`/video/${course._id}`)}
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
              {!props.hideApprove && (
                <IconButton
                  variant="contained"
                  color="primary"
                  size="medium"
                  align="bottom"
                  onClick={() =>
                    setConfirmChanges({ state: true, approve: true })
                  }
                >
                  <CheckIcon />
                </IconButton>
              )}
              {!props.hideDelete && (
                <IconButton
                  variant="contained"
                  color="secondary"
                  size="medium"
                  onClick={() =>
                    setConfirmChanges({ state: true, approve: false })
                  }
                >
                  <CancelRoundedIcon />
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
        open={confirmChange.state}
        onClose={() => setConfirmChanges({ state: false, approve: null })}
      >
        <DialogTitle>
          Are you sure you want to{" "}
          {confirmChange.approve ? "approve" : "reject"} this course?
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
          <Button
            onClick={() => setConfirmChanges({ state: false, approve: null })}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => verifyCourse(confirmChange.approve)}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default ReviewPreview;
