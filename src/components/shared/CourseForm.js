import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "./FormikControl";
import CourseContent from "../CourseContent";
import CourseService from "../../services/courseService";
import ResourceService from "../../services/resourceService";

import {
  Grid,
  Typography,
  Button,
  Container,
  Card,
  CardMedia,
  makeStyles,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@material-ui/core";
import BackButton from "./BackButton";

const validationSchema = Yup.object({
  title: Yup.string().max(25, "Max 25 characters or less").required("Required"),
  genre: Yup.string().required("Required"),
  description: Yup.string().max(500, "Max 500 character or less."),
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
  thumbnail: Yup.string().required("Required"),
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  form: {
    width: "100%",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  card: {
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "50%",
  },
  previewGrid: {
    margin: theme.spacing(2),
  },
}));

const getSteps = () => {
  return ["Details", "Description", "Content"];
};

function CourseForm(props) {
  const [formValues, setFormValues] = useState({
    title: "",
    genre: "",
    description: "",
    credits: {
      criteria: 0,
      score: 0,
    },
    thumbnail: "",
  });
  const [categories, setCategories] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileDisplayError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const classes = useStyles();
  const steps = getSteps();

  let { params } = props.match;
  const courseId = params["id"];

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

  useEffect(() => {
    if (courseId) {
      let courseService = new CourseService();
      courseService.getCourseById(courseId).then((result) => {
        console.log(result);
        setFormValues({
          title: result.title,
          genre: result.genre,
          description: result.description,
          credits: {
            criteria: result.credits.criteria,
            score: result.credits.score,
          },
          thumbnail: result.thumbnail,
        });
      });
    }
  }, [courseId]);

  const handleNextStep = (e) => {
    setActiveStep((prev) => prev + 1);
  };

  const renderSkip = () => {
    return (
      <Button type="button" onClick={handleNextStep}>
        Skip
      </Button>
    );
  };

  const uploadFile = async (formik) => {
    setUploading(true);
    let resourceService = new ResourceService();
    const res = await resourceService.uploadCourseImage(selectedFile);
    setUploading(false);
    if (res) {
      formik.setFieldValue("thumbnail", res.data.path);
      setSelectedFile(null);
    } else {
      setFileDisplayError(true);
    }
  };

  const onSubmit = (val) => {
    console.log(val);
    let courseService = new CourseService();
    courseService.updateCourse(courseId, val).then((res) => {
      if (res && res.id) {
        //props.history.push("/course/my-course");
        handleNextStep();
      }
    });
  };

  const setEditorValue = (formik, e) => {
    formik.setFieldValue("description", e.editor.getData());
  };

  return (
    <Container>
      <BackButton />
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Grid container style={{ display: "flex" }}>
        <Formik
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {(formik) => (
            <Form encType="multipart/formdata" className={classes.form}>
              {activeStep === 0 && (
                <>
                  <Grid item xs={12} sm={12} md={6}>
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
                    <FormikControl
                      control="input"
                      type="text"
                      label="Image URL"
                      name="thumbnail"
                      size="small"
                      value={formik.values.thumbnail}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.thumbnail &&
                        formik.errors.thumbnail &&
                        formik.errors.thumbnail !== ""
                      }
                    />
                    <FormikControl
                      control="file"
                      name="selectedFile"
                      onBlur={(e) => setSelectedFile(e.target.files[0])}
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                    <Typography variant="subtitle1" component="p">
                      {selectedFile ? selectedFile.name : ""}
                    </Typography>
                    {selectedFile && (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => uploadFile(formik)}
                        type="button"
                        edge="end"
                      >
                        Upload
                      </Button>
                    )}
                    <Typography color="error" variant="subtitle1" component="p">
                      {fileError ? "Please provide link or select a file" : ""}
                    </Typography>
                    {uploading && (
                      <Typography
                        color="secondary"
                        variant="subtitle1"
                        component="div"
                      >
                        <CircularProgress />
                        Uploading file to server, please wait...
                      </Typography>
                    )}
                    <Grid container>
                      {renderSkip()}
                      <FormikControl control="submit" />
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    align="center"
                    className={classes.previewGrid}
                  >
                    <div>
                      <Card className={classes.card} elevation={2}>
                        {formik.values.thumbnail && (
                          <CardMedia
                            className={classes.cardMedia}
                            image={formik.values.thumbnail}
                            title="Thumbnail"
                          />
                        )}
                      </Card>
                    </div>
                  </Grid>
                </>
              )}
              {activeStep === 1 && (
                <Grid item style={{ margin: "auto" }}>
                  <FormikControl
                    control="richText"
                    label="Description"
                    name="description"
                    content={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    events={{
                      blur: (e) => setEditorValue(formik, e),
                      change: (e) => setEditorValue(formik, e),
                    }}
                    error={
                      formik.touched.description &&
                      formik.errors.description &&
                      formik.errors.description !== ""
                    }
                  />
                  <Grid container>
                    {renderSkip()}
                    <FormikControl control="submit" />
                  </Grid>
                </Grid>
              )}
            </Form>
          )}
        </Formik>
        {activeStep === 2 && <CourseContent {...props} />}
      </Grid>
    </Container>
  );
}

export default CourseForm;
