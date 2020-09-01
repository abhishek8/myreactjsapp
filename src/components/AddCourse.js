import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "./shared/FormikControl";
import CourseService from "../services/courseService";
import ResourceService from "../services/resourceService";
import {
  Grid,
  Typography,
  Container,
  Card,
  CardMedia,
  Button,
  CircularProgress,
  makeStyles,
  Stepper,
  Step,
  StepLabel,
} from "@material-ui/core";
import BackButton from "./shared/BackButton";

const validationSchema = Yup.object({
  title: Yup.string().max(25, "Max 25 characters or less").required("Required"),
  genre: Yup.string().required("Required"),
  description: Yup.string(),
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
  thumbnail: Yup.string(),
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
  nextButton: {
    margin: theme.spacing(2),
  },
}));

const getSteps = () => {
  return [
    "Provide Title",
    "Select Category",
    "Description",
    "Rate Course",
    "Display Image",
  ];
};

function AddCourse(props) {
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileDisplayError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

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
    if (!val.thumbnail || val.thumbnail === "") {
      setFileDisplayError(true);
    } else {
      let courseService = new CourseService();
      courseService.addNewCourse(val).then((res) => {
        console.log(res);
        if (res && res.id) {
          props.history.push("/course/manage");
        }
      });
    }
  };

  const renderNav = (formik, fields) => {
    return (
      <Grid container justify="flex-end">
        <Grid item>
          {activeStep !== 0 && (
            <Button
              type="button"
              color="primary"
              size="small"
              className={classes.nextButton}
              onClick={() => setActiveStep((prev) => prev - 1)}
            >
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 && (
            <Button
              type="submit"
              color="primary"
              size="small"
              variant="contained"
              className={classes.nextButton}
              onClick={() => handleNext(formik, fields)}
            >
              Next
            </Button>
          )}
          {activeStep === steps.length - 1 && (
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          )}
        </Grid>
      </Grid>
    );
  };

  const setEditorValue = (formik, e) => {
    formik.setFieldValue("description", e.editor.getData());
  };

  const handleNext = async (formik, fields) => {
    let setError = false;
    let formErrors = await formik.validateForm();

    fields.forEach((fieldName) => {
      if (formErrors[fieldName]) setError = true;
    });

    if (!setError) {
      formik.setErrors({});
      setActiveStep((prev) => prev + 1);
    }
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
      <br />
      <Grid container>
        <Formik
          isInitialValid={false}
          initialValues={{
            title: "",
            genre: "",
            description: "",
            credits: {
              criteria: 0,
              score: 0,
            },
            thumbnail: "",
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          validateOnBlur
        >
          {(formik) => (
            <Form
              encType="multipart/formdata"
              className={classes.form}
              noValidate
            >
              <Grid item xs={12} sm={9} md={6} style={{ margin: "auto" }}>
                <>
                  {activeStep === 0 && (
                    <>
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
                        required
                      />
                      {renderNav(formik, ["title"])}
                    </>
                  )}
                  {activeStep === 1 && (
                    <>
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
                        required
                      />
                      {renderNav(formik, ["genre"])}
                    </>
                  )}
                  {activeStep === 2 && (
                    <>
                      <FormikControl
                        control="richText"
                        label="Description"
                        name="description"
                        content={formik.values.description}
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
                      {renderNav(formik, ["description"])}
                    </>
                  )}
                  {activeStep === 3 && (
                    <>
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
                        required
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
                        required
                      />
                      {renderNav(formik, ["credits.criteria", "credits.score"])}
                    </>
                  )}
                  {activeStep === 4 && (
                    <Grid container>
                      <Grid item style={{ width: "100%" }}>
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
                        <Typography
                          variant="caption"
                          component="h6"
                          align="center"
                          paragraph
                        >
                          Or
                        </Typography>
                        <div style={{ textAlign: "center" }}>
                          <FormikControl
                            control="file"
                            name="selectedFile"
                            id="selectedFile"
                            onBlur={(e) => setSelectedFile(e.target.files[0])}
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                          />
                        </div>
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
                        <Typography
                          color="error"
                          variant="subtitle1"
                          component="p"
                        >
                          {fileError
                            ? "Please provide link or select a file"
                            : ""}
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
                        <Card className={classes.card} elevation={2}>
                          {formik.values.thumbnail && (
                            <CardMedia
                              component="img"
                              className={classes.cardMedia}
                              image={formik.values.thumbnail}
                              title="Thumbnail"
                            />
                          )}
                        </Card>
                        <br />
                        {renderNav()}
                      </Grid>
                    </Grid>
                  )}
                </>
              </Grid>
            </Form>
          )}
        </Formik>
      </Grid>
    </Container>
  );
}

export default AddCourse;
