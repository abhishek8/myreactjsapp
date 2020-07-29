import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "./shared/FormikControl";
import CourseService from "../services/courseService";

import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {
  Grid,
  Container,
  Card,
  CardMedia,
  CircularProgress,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  card: {
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "75%",
  },
}));

function getSteps() {
  return ["Upload Video", "Preview", "Provide Details"];
}

const initialValues = {
  title: "",
  genre: "",
  credits: {
    criteria: 0,
    score: 0,
  },
  courseLink: "",
  thumbnail: "",
};

const validationSchema = Yup.object({
  title: Yup.string().max(25, "Max 25 characters or less").required("Required"),
  genre: Yup.string().required("Required"),
  credits: Yup.object().shape({
    criteria: Yup.number()
      .min(0, "Invalid credit")
      .max(15, "Credit can be max 15")
      .required("Required"),
    score: Yup.number()
      .min(0, "Invalid credit")
      .max(15, "Credit can be max 15")
      .required("Required"),
  }),
  courseLink: Yup.string().required("Required"),
  thumbnail: Yup.string(),
});

function CreateCourse(props) {
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [fileError, setFileDisplayError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const classes = useStyles();
  const steps = getSteps();

  useEffect(() => {
    let serviceObj = new CourseService();
    serviceObj.getAllCategories().then((res) => {
      setCategories(
        res.map((cat) => {
          return { key: cat.name, value: cat.display };
        })
      );
    });
  }, []);

  const onSubmit = (val) => {
    console.log(val);
    let courseService = new CourseService();
    courseService.addNewCourse(val).then((res) => {
      if (res && res.id) {
        props.history.push("/course/my-course");
      }
    });
  };

  const uploadVideo = async (formik) => {
    if (formik.values.courseLink) handleNext();
    else if (selectedFile) {
      setUploading(true);
      let courseService = new CourseService();
      const res = await courseService.uploadVideo(selectedFile);
      setUploading(false);
      if (res) {
        console.log(res);
        formik.setFieldValue("courseLink", res.videoFilePath);
        formik.setFieldValue("thumbnail", res.thumbsFilePath);
        handleNext();
      } else {
        setFileDisplayError(true);
      }
    } else setFileDisplayError(true);
  };

  const uploadThumbnail = async (formik) => {
    if (formik.values.thumbnail) handleNext();
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <br />
      <Container>
        <Grid container justify="center">
          <Grid item xs={12} sm={12} md={6} align="center">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {(formik) => (
                <Form encType="multipart/formdata">
                  {activeStep === steps.length - 3 && (
                    <>
                      <FormikControl
                        control="input"
                        label="Provide Link"
                        name="courseLink"
                        size="small"
                        value={formik.values.courseLink}
                        onChange={formik.handleChange}
                      />
                      <Typography
                        variant="caption"
                        component="h6"
                        align="center"
                        gutterBottom
                        paragraph
                      >
                        Or
                      </Typography>
                      <FormikControl
                        control="file"
                        name="selectedFile"
                        onBlur={(e) => setSelectedFile(e.target.files[0])}
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                      />
                      {selectedFile && (
                        <Typography variant="subtitle1" component="p">
                          {selectedFile.name}
                        </Typography>
                      )}
                      <br />
                      {fileError && (
                        <Typography
                          color="error"
                          variant="subtitle1"
                          component="p"
                        >
                          Please provide link or select a file
                        </Typography>
                      )}
                      <br />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => uploadVideo(formik)}
                        type="button"
                        edge="end"
                      >
                        Upload
                      </Button>
                      <br />
                      {uploading && (
                        <Typography
                          color="secondary"
                          variant="subtitle1"
                          component="p"
                        >
                          <CircularProgress />
                          Uploading file to server, please wait...
                        </Typography>
                      )}
                    </>
                  )}
                  {activeStep === steps.length - 2 && (
                    <div>
                      <Grid container align="center" justify="center">
                        <Grid item xs={12} sm={12} md={12}>
                          <Card className={classes.card} elevation={2}>
                            {formik.values.thumbnail && (
                              <CardMedia
                                className={classes.cardMedia}
                                image={formik.values.thumbnail}
                                title="Thumbnail"
                              />
                            )}
                          </Card>
                          <FormikControl
                            control="input"
                            type="text"
                            label="Provide thumbnail"
                            name="thumbnail"
                            size="small"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.thumbnail &&
                              formik.errors.thumbnail &&
                              formik.errors.thumbnail !== ""
                            }
                          />
                          {formik.values.thumbnail === "" && (
                            <Typography
                              color="error"
                              variant="subtitle1"
                              component="p"
                              paragraph
                            >
                              Please provide thumbnail for video
                            </Typography>
                          )}
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => uploadThumbnail(formik)}
                          >
                            Next
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  )}
                  {activeStep === steps.length - 1 && (
                    <div>
                      <FormikControl
                        control="input"
                        type="text"
                        label="Title"
                        name="title"
                        size="small"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.title &&
                          formik.errors.title &&
                          formik.errors.title !== ""
                        }
                      />
                      <FormikControl
                        control="select"
                        label="Genre"
                        name="genre"
                        size="small"
                        align="left"
                        value={formik.values.genre}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        options={categories}
                        error={
                          formik.touched.genre &&
                          formik.errors.genre &&
                          formik.errors.genre !== ""
                        }
                      />
                      <FormikControl
                        control="input"
                        type="number"
                        inputProps={{ min: "0", max: "15", step: "0.5" }}
                        label="Criteria"
                        name="credits.criteria"
                        size="small"
                        value={formik.values.credits.criteria}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.credits &&
                          formik.touched.credits.criteria &&
                          formik.errors.credits &&
                          formik.errors.credits.criteria &&
                          formik.errors.credits.criteria !== ""
                        }
                      />
                      <FormikControl
                        control="input"
                        type="number"
                        inputProps={{ min: "0", max: "15", step: "0.5" }}
                        label="Score"
                        name="credits.score"
                        size="small"
                        value={formik.values.credits.score}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.credits &&
                          formik.touched.credits.score &&
                          formik.errors.credits &&
                          formik.errors.credits.score &&
                          formik.errors.credits.score !== ""
                        }
                      />
                      <FormikControl control="submit" />
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default CreateCourse;
