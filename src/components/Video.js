import React, { useState, useEffect, useContext } from "react";
import ReactPlayer from "react-player";
import CourseService from "../services/courseService";
import AppUtils from "../utilities/AppUtils";

import {
  Grid,
  Typography,
  makeStyles,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  Snackbar,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import Alert from "@material-ui/lab/Alert";
import ScoreIcon from "@material-ui/icons/Score";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { UserContext } from "../context/UserContext";
import BackButton from "./shared/BackButton";

const useStyles = makeStyles((theme) => ({
  rootGrid: {
    width: "100%",
    height: "70vh",
    [theme.breakpoints.down("sm")]: {
      height: "60vh",
    },
    [theme.breakpoints.down("xs")]: {
      height: "50vh",
    },
  },
  contentGrid: {
    border: "1px solid lightgray",
    height: "66vh",
    [theme.breakpoints.down("sm")]: {
      height: "56vh",
    },
    [theme.breakpoints.down("xs")]: {
      height: "46vh",
    },
  },
  article: {
    padding: theme.spacing(2),
    overflow: "auto",
    width: "100%",
  },
  description: {
    padding: theme.spacing(2),
  },
  sectionGrid: {
    border: "1px solid lightgray",
    backgroundColor: "#EEEEEE",
    overflow: "auto",
    height: "66vh",
    [theme.breakpoints.down("sm")]: {
      height: "56vh",
    },
    [theme.breakpoints.down("xs")]: {
      height: "46vh",
    },
  },
  section: {
    boxShadow: "none",
    margin: "0 auto !important",
    "&:not(:last-child)": {
      border: 0,
    },
    "&:before": {
      display: "none",
    },
  },
  contents: {
    width: "100%",
    padding: theme.spacing(0),
  },
}));

function Video(props) {
  const userContext = useContext(UserContext);

  const [course, setCourse] = useState(null);
  const [currSection, setCurrSection] = useState(false);
  const [currContent, setCurrContent] = useState("");
  const [courseComplete, setCourseComplete] = useState(false);

  const classes = useStyles();
  const { params } = props.match;

  useEffect(() => {
    let service = new CourseService();
    service.getCourseById(params.id).then((res) => {
      if (res) {
        console.log(res);
        if (res.section && res.section.length > 0) {
          if (
            res.section[0].contentList &&
            res.section[0].contentList.length > 0
          ) {
            setCurrContent(res.section[0].contentList[0]);
          }
        }
        setCourse(res);
      }
    });
  }, [params]);

  const getNextSectionWithContent = (section) => {
    if (course && course.section && course.section.length > 0) {
      if (!section) return course.section[0];

      let sect_pos = 0;
      let sect_len = course.section.length;
      for (let i = 1; i < sect_len; i++) {
        if (course.section[i].label === section.label) sect_pos = i;
      }

      for (let i = sect_pos + 1; i < course.section.length; i++) {
        const sect = course.section[i];
        if (sect.contentList.length > 0) {
          return sect;
        }
      }
    }
    return null;
  };

  const findAndSetNextContent = () => {
    let section;
    let content;

    // No section selected
    if (!currSection || !currContent) {
      let next = getNextSectionWithContent();
      if (!next) return true;
      section = next;
      content = section.contentList[0];
    }
    // Both exists
    else {
      let content_pos = -1;
      let content_len = currSection.contentList.length;
      for (let i = 0; i < content_len; i++) {
        if (currSection.contentList[i].subtitle === currContent.subtitle)
          content_pos = i;
      }
      // Content doesn't exists in section
      if (content_pos === -1) return false;
      // Content in middle
      else if (content_pos < content_len - 1) {
        section = currSection;
        content = currSection.contentList[content_pos + 1];
      }
      // Content in last
      else {
        let next = getNextSectionWithContent(currSection);
        if (!next) return true; // No more section with content ENDING REACHED
        section = next;
        content = next.contentList[0];
      }
    }
    setCurrSection(section);
    setCurrContent(content);
    let sect_last = section.contentList.length - 1;
    if (section.contentList[sect_last].subtitle === content.subtitle)
      return content.contentType === "VIDEO" ? false : true;
    return false;
  };

  const handleEnd = () => {
    if (
      findAndSetNextContent() &&
      userContext.userState.user["role"] === "user"
    ) {
      let service = new CourseService();
      service.setWatched(course._id).then((res) => {
        console.log("Complete", res);
        setCourseComplete(true);
      });
    }
  };

  const getPublishedDateString = () => {
    return course.publishedDate ? (
      AppUtils.getPublishedDateString(course.publishedDate)
    ) : (
      <Typography variant="caption" component="span" color="textSecondary">
        Not verified yet
      </Typography>
    );
  };

  return (
    <>
      <BackButton />
      {course && course.section && course.section.length > 0 && (
        <>
          <Grid container className={classes.rootGrid}>
            <Grid item xs={9} sm={9} md={9} className={classes.contentGrid}>
              {currContent && (
                <>
                  {currContent.contentType === "VIDEO" && (
                    <ReactPlayer
                      url={currContent.sourceLinks.videosrc}
                      light={currContent.sourceLinks["thumbnail"]}
                      height="100%"
                      width="100%"
                      controls={true}
                      onEnded={() => handleEnd()}
                    />
                  )}
                  {currContent.contentType === "ARTICLE" && (
                    <div
                      className={classes.article}
                      dangerouslySetInnerHTML={{
                        __html: currContent.textContent,
                      }}
                    ></div>
                  )}
                </>
              )}
            </Grid>
            <Grid item xs={3} sm={3} md={3} className={classes.sectionGrid}>
              {course.section.map((sect) => (
                <Accordion
                  key={sect.label}
                  className={classes.section}
                  square={true}
                  elevation={0}
                  onClick={() => setCurrSection(sect)}
                >
                  <AccordionSummary>
                    <Typography variant="h5" component="span">
                      {sect.label} <ExpandMoreIcon />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails style={{ padding: "0" }}>
                    <List component="nav" className={classes.contents}>
                      {sect.contentList.length > 0 && (
                        <>
                          {sect.contentList.map((content) => (
                            <ListItem
                              key={content.subtitle}
                              selected={
                                currContent &&
                                content.subtitle === currContent.subtitle
                              }
                              onClick={() => setCurrContent(content)}
                            >
                              <Typography component="div" variant="subtitle1">
                                {content.subtitle}
                              </Typography>
                            </ListItem>
                          ))}
                        </>
                      )}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          </Grid>
          <Typography variant="h5" component="h5">
            {course.title}
          </Typography>
          <Typography variant="subtitle1" component="h6">
            {getPublishedDateString()}
          </Typography>
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
          <br />
          {course.description && course.description.length > 0 && (
            <>
              <br />
              <Typography variant="h6" component="h6" gutterBottom>
                About this course
              </Typography>
              <div
                className={classes.description}
                dangerouslySetInnerHTML={{
                  __html: course.description,
                }}
              ></div>
            </>
          )}
        </>
      )}
      <Snackbar
        open={courseComplete}
        autoHideDuration={6000}
        onClose={() => setCourseComplete(false)}
      >
        <Alert severity="success">
          Course completed! Please rate to gain credit points if any.
        </Alert>
      </Snackbar>
    </>
  );
}

export default Video;
