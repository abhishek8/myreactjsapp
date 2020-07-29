import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import CourseService from "../services/courseService";
import AppUtils from "../utilities/AppUtils";

import {
  Container,
  Grid,
  Typography,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  makeStyles,
  Chip,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import Alert from "@material-ui/lab/Alert";
import ScoreIcon from "@material-ui/icons/Score";

const useStyles = makeStyles((theme) => ({
  videoGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(1),
    width: "100%",
    maxWidth: "720px",
    height: "70vh",
    [theme.breakpoints.down("sm")]: {
      height: "60vh",
    },
    [theme.breakpoints.down("xs")]: {
      height: "50vh",
    },
  },
}));

function Video(props) {
  const userInfo = JSON.parse(sessionStorage.getItem("user_info"));
  const role = userInfo ? userInfo.role : "";

  const [course, setCourse] = useState(null);
  const [courseComplete, setcourseComplete] = useState(false);
  const [rating, setRating] = useState(5);

  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [ratingFailure, setRatingFailure] = useState(false);

  const classes = useStyles();
  const { params } = props.match;

  useEffect(() => {
    let service = new CourseService();
    service.getCourseById(params.id).then((res) => {
      if (res) {
        console.log(res);
        setCourse(res);
      }
    });
  }, [params]);

  const postRating = async (e) => {
    e.preventDefault();

    let { params } = props.match;
    let service = new CourseService();
    let result = await service.postRating({
      courseId: params.id,
      rating_value: Number(rating),
    });
    if (result && result.success) {
      setRatingSuccess(true);
    } else {
      setRatingFailure(true);
    }
    setcourseComplete(false);
  };

  return (
    <Container maxWidth="md">
      {course && (
        <>
          <Grid container className={classes.videoGrid}>
            <Grid item xs={12} sm={12} md={12}>
              <ReactPlayer
                url={course.courseLink}
                light={course.thumbnail}
                height="100%"
                width="100%"
                controls={true}
                onEnded={() => setcourseComplete(true)}
              />
            </Grid>
          </Grid>
          <Typography variant="h5" component="h5">
            {course.title}
          </Typography>
          {course.publishedDate && (
            <Typography variant="subtitle1" component="h6">
              {AppUtils.getPublishedDateString(course.publishedDate)}
            </Typography>
          )}
          {!course.publishedDate && (
            <Typography variant="h6" color="secondary" component="h6">
              Not verified yet
            </Typography>
          )}
          <Typography variant="subtitle1" component="h6">
            {course.author.name}
          </Typography>
          <Typography variant="caption" component="h5">
            {course.ratings.avg_rating.toFixed(1)}{" "}
            <Rating
              name="courseRating"
              value={Number(course.ratings.avg_rating.toFixed(1))}
              precision={0.5}
              size="small"
              readOnly
            />{" "}
            ({course.ratings.total_count}){" "}
          </Typography>
          <Chip
            label={course.credits.score.toFixed(1) + " credit gain"}
            color="default"
            size="small"
            icon={<ScoreIcon />}
          />
        </>
      )}
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        keepMounted
        open={courseComplete && role === "user"}
        onClose={() => setcourseComplete(false)}
      >
        <DialogTitle>Please provide your rating</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This is necessary to gain credits if any offered in this course
          </DialogContentText>
          <Rating
            name="courseRating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            size="medium"
            min={1}
            max={5}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={postRating} color="primary" autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={ratingSuccess}
        autoHideDuration={6000}
        onClose={() => setRatingSuccess(false)}
      >
        <Alert severity="success">
          Successfully submitted your rating. You will recieve credit in your
          account if course offers so.
        </Alert>
      </Snackbar>
      <Snackbar
        open={ratingFailure}
        autoHideDuration={6000}
        onClose={() => setRatingFailure(false)}
      >
        <Alert severity="error">
          Failed to submit your rating. Please try again!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Video;

// class Video extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       course: null,
//     };
//     this.handleComplete = this.handleComplete.bind(this);
//     this.postRating = this.postRating.bind(this);
//   }

//   async componentDidMount() {
//     let { params } = this.props.match;
//     let serviceObj = new CourseService();
//     let courseDetails = await serviceObj.getCourseById(params.id);

//     if (courseDetails) {
//       this.setState({
//         course: courseDetails,
//       });
//     }
//   }

//   handleComplete(e) {
//     console.log("Ended");
//     this.setState({
//       isCompleted: true,
//     });
//   }

//   async postRating(e) {
//     e.preventDefault();
//     let { params } = this.props.match;
//     let service = new CourseService();
//     let result = await service.postRating({
//       courseId: params.id,
//       rating_value: Number(this.state.rating),
//     });
//     if (result && result.success) {
//       alert(result.message);
//     }
//   }

//   render() {
//     let renderPlayer = <Loading />;
//     let course = this.state.course;
//     if (course) {
//       renderPlayer = (
//         <>
//           <Container
//             maxWidth="md"
//             style={{ paddingTop: "16px", paddingLeft: "0px" }}
//           >
//             <ReactPlayer
//               url={course.courseLink}
//               light={course.thumbnail}
//               controls={true}
//               onEnded={this.handleComplete}
//             />
//           </Container>
//           <h3>{course.title}</h3>
//           <h6>{course.author.name}</h6>
//           <h6>
//             {course.publishedDate
//               ? AppUtils.formatDateString(course.publishedDate)
//               : "Not verified yet"}
//           </h6>
//           <div>
//             {this.state.isCompleted && (
//               <>
//                 <h3>Completed</h3>
//                 <select
//                   name="rating"
//                   value={this.state.rating}
//                   onChange={(e) => this.setState({ rating: e.target.value })}
//                 >
//                   <option value="5">5</option>
//                   <option value="4">4</option>
//                   <option value="3">3</option>
//                   <option value="2">2</option>
//                   <option value="1">1</option>
//                 </select>
//                 <button onClick={this.postRating}>Post Rating</button>
//               </>
//             )}
//           </div>
//         </>
//       );
//     }
//     return <div>{renderPlayer}</div>;
//   }
// }

// export default Video;
