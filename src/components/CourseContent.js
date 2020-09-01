import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Draggable, Droppable } from "react-drag-and-drop";
import CourseService from "../services/courseService";
//import AppUtils from "../utilities/AppUtils";

import {
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
  Accordion,
  IconButton,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  TextField,
  Box,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateArticle from "./shared/CreateArticle";
import CreateVideo from "./shared/CreateVideo";
import BackButton from "./shared/BackButton";

const useStyles = makeStyles((theme) => ({
  section: {
    margin: theme.spacing(2),
  },
  list: {
    width: "100%",
  },
  article: {
    padding: theme.spacing(4),
    overflow: "scroll",
    height: "60vh",
  },
}));

function CourseContent(props) {
  const [course, setCourse] = useState(null);
  const [sectName, setSectName] = useState("");
  const [currSection, setCurrSection] = useState(null);
  const [currContent, setCurrContent] = useState("");

  const [createSection, toggleCreateSection] = useState(false);
  const [confirmRemove, toggleConfirmRemove] = useState(false);
  const [addVideo, toggleUploadVideo] = useState(false);
  const [addArticle, toggleArticle] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [confirmComplete, setConfirmComplete] = useState(false);

  const classes = useStyles();
  const { params } = props.match;

  useEffect(() => {
    let service = new CourseService();
    service.getCourseById(params.id).then((res) => {
      console.log(res);
      if (res) {
        setCourse(res);
      }
    });
  }, [params]);

  const handleSectionCreate = (e) => {
    if (sectName && sectName !== "") {
      const newSection = {
        label: sectName,
        order:
          course.section && course.section.length ? course.section.length : 0,
        contentList: [],
      };
      setCourse((prev) => {
        prev.section.push(newSection);
        return prev;
      });
      setSectName("");
      toggleCreateSection(false);
    }
  };

  const removeSection = (e) => {
    setCourse((course) => {
      for (let i = 0; i < course.section.length; i++) {
        if (course.section[i].label === currSection)
          course.section.splice(i, 1);
      }
      return course;
    });
    toggleConfirmRemove(false);
  };

  const handleRemove = (label) => {
    setCurrSection(label);
    toggleConfirmRemove(true);
  };

  const handleContentCreate = (newContent, sectName) => {
    setCourse((prev) => {
      prev.section.forEach((sect) => {
        if (sect.label === sectName) {
          if (!sect.contentList) sect.contentList = [];
          newContent["order"] = sect.contentList.length;
          sect.contentList.push(newContent);
        }
      });
      console.log(prev);
      return prev;
    });
    toggleArticle(false);
    toggleUploadVideo(false);
  };

  const renderCurrentContent = () => {
    if (currContent && currContent !== "") {
      let contentDetails = null;
      course.section.forEach((sect) => {
        if (contentDetails) return;
        sect.contentList.forEach((content) => {
          if (content.subtitle === currContent) {
            contentDetails = content;
            return;
          }
        });
      });
      console.log(contentDetails);
      if (contentDetails.contentType === "ARTICLE") {
        return (
          <Box className={classes.article}>
            <div
              dangerouslySetInnerHTML={{
                __html: contentDetails.textContent,
              }}
            ></div>
          </Box>
        );
      } else if (contentDetails.contentType === "VIDEO") {
        return (
          <Box align="center">
            <ReactPlayer
              url={contentDetails.sourceLinks.videosrc}
              light={
                contentDetails.sourceLinks.thumbnail
                  ? contentDetails.sourceLinks.thumbnail
                  : ""
              }
              height="400px"
              width="90%"
              controls={true}
            />
          </Box>
        );
      }
    }
  };

  const saveChanges = async (e) => {
    let service = new CourseService();
    const res = await service.updateCourse(course._id, course);
    console.log(res);
    if (res && res.success) setSaveSuccess(true);
    else setSaveError(true);
  };

  const submitCourse = async (e) => {
    e.preventDefault();

    let service = new CourseService();
    const res = await service.submitCourse(course._id, course);
    console.log(res);
    if (res && res.success) {
      setConfirmComplete(false);
      props.history.push("/course/manage");
    } else setSaveError(true);
  };

  const showArticle = (e) => {
    toggleArticle((prev) => !prev);
    toggleUploadVideo(false);
  };

  const showVideo = (e) => {
    toggleUploadVideo((prev) => !prev);
    toggleArticle(false);
  };

  return (
    <>
      <BackButton />
      <Grid container>
        <Grid container>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => toggleCreateSection(true)}
            >
              <AddIcon /> Add Section
            </Button>
            <br />
            <br />
            {course && course.section && course.section.length === 0 && (
              <Typography variant="h5" component="h5">
                No section created. Start by adding a section.
              </Typography>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          {course && course.section && course.section.length > 0 && (
            <>
              <Droppable types={["sections"]}>
                {course.section.map((sect) => (
                  <Draggable type="sections" data={sect.label} key={sect.label}>
                    <Accordion
                      key={sect.label}
                      expanded={currSection === sect.label}
                      className={classes.section}
                      onClick={() => setCurrSection(sect.label)}
                    >
                      <AccordionSummary>
                        <Grid container justify="space-between">
                          <Grid item>
                            <Typography variant="h6" component="span">
                              {sect.label}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <IconButton
                              edge="end"
                              onClick={() => handleRemove(sect.label)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List component="nav" className={classes.list}>
                          {sect.contentList && sect.contentList.length > 0 && (
                            <Droppable types={["resource"]}>
                              {sect.contentList.map((content) => (
                                <Draggable
                                  key={content.subtitle}
                                  type="resource"
                                  data={content}
                                >
                                  <ListItem
                                    key={content.order}
                                    selected={content.subtitle === currContent}
                                    onClick={() =>
                                      setCurrContent(content.subtitle)
                                    }
                                  >
                                    <Typography
                                      component="div"
                                      variant="subtitle1"
                                    >
                                      {content.subtitle}
                                    </Typography>
                                  </ListItem>
                                </Draggable>
                              ))}
                            </Droppable>
                          )}
                          <ListItem>
                            <Button onClick={showVideo}>
                              <AddIcon /> Video
                            </Button>
                            <Button onClick={showArticle}>
                              <AddIcon /> Article
                            </Button>
                          </ListItem>
                          {addArticle && (
                            <ListItem>
                              <CreateArticle
                                create={(val) =>
                                  handleContentCreate(val, sect.label)
                                }
                              />
                            </ListItem>
                          )}
                          {addVideo && (
                            <ListItem>
                              <CreateVideo
                                id={sect.label}
                                create={(val) =>
                                  handleContentCreate(val, sect.label)
                                }
                              />
                            </ListItem>
                          )}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  </Draggable>
                ))}
              </Droppable>

              <br />
              <Grid container justify="space-between">
                <Grid item>
                  <Button variant="contained" onClick={saveChanges}>
                    Save
                  </Button>
                </Grid>
                {course.status === "CREATED" && (
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setConfirmComplete(true)}
                    >
                      Complete
                    </Button>
                  </Grid>
                )}
              </Grid>
              <br />
            </>
          )}
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          {renderCurrentContent()}
        </Grid>
      </Grid>

      <Dialog open={createSection} onClose={() => toggleCreateSection(false)}>
        <DialogTitle>Create Section</DialogTitle>
        <DialogContent>
          <DialogContentText>Name: </DialogContentText>
          <TextField
            name="name"
            fullWidth={true}
            value={sectName}
            autoFocus
            onChange={(e) => setSectName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => toggleCreateSection(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSectionCreate(sectName)}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmRemove} onClose={() => toggleConfirmRemove(false)}>
        <DialogTitle>Are you sure you want to remove this section</DialogTitle>
        <DialogContent>
          <DialogContentText>
            All videos and documents will be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => toggleConfirmRemove(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={removeSection}>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmComplete} onClose={() => setConfirmComplete(false)}>
        <DialogTitle>Are you sure you want to submit this course?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Once the course is submitted, it will be sent for review and after
            it has been successfully reviewed, others can view and purchase this
            course. You can edit this course but will not be able to delete it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => setConfirmComplete(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={submitCourse}>
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={saveError}
        autoHideDuration={5000}
        onClose={() => setSaveError(false)}
      >
        <Alert severity="error">Failed! Please try again.</Alert>
      </Snackbar>
      <Snackbar
        open={saveSuccess}
        autoHideDuration={5000}
        onClose={() => setSaveSuccess(false)}
      >
        <Alert severity="success">Saved Successfully.</Alert>
      </Snackbar>
      <Snackbar
        open={submitError}
        autoHideDuration={5000}
        onClose={() => setSubmitError(false)}
      >
        <Alert severity="error">Unable to submit! Please try again.</Alert>
      </Snackbar>
    </>
  );
}

export default CourseContent;
