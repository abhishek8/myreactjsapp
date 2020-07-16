import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import FormikControl from "./FormikControl";
import CourseService from "../../services/courseService";
import { Grid, Typography, Container } from "@material-ui/core";

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

function CourseForm(props) {
  const [formValues, setFormValues] = useState({
    title: "",
    genre: "",
    credits: {
      criteria: 0,
      score: 0,
    },
    courseLink: "",
    thumbnail: "",
  });
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  let { params } = props.match;
  const courseId = params["id"];

  const onSubmit = (val) => {
    console.log(val);
    let courseService = new CourseService();
    if (courseId) {
      courseService.updateCourse(courseId, val).then((res) => {
        if (res && res.id) {
          props.history.push("/course/my-course");
        }
      });
    } else {
      courseService.addNewCourse(val).then((res) => {
        if (res && res.id) {
          props.history.push("/course/my-course");
        }
      });
    }
  };

  const uploadVideo = (formik) => {
    let courseService = new CourseService();
    courseService.uploadVideo(selectedFile).then((res) => {
      if (res) {
        console.log(res);
        formik.setFieldValue("courseLink", res.videoFilePath);
        formik.setFieldValue("thumbnail", res.thumbsFilePath);
      }
    });
  };

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
          credits: {
            criteria: result.credits.criteria,
            score: result.credits.score,
          },
          courseLink: result.courseLink,
          thumbnail: result.thumbnail,
        });
      });
    }
  }, [courseId]);

  return (
    <Container className="">
      <br />
      <Typography component="h4" variant="h5">
        Create
      </Typography>
      <br />
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={7}>
          <Formik
            initialValues={formValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {(formik) => (
              <Form encType="multipart/formdata">
                <FormikControl
                  control="input"
                  type="text"
                  label="Title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && formik.errors.title}
                />
                <FormikControl
                  control="select"
                  label="Genre"
                  name="genre"
                  value={formik.values.genre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  options={categories}
                  error={formik.touched.genre && formik.errors.genre}
                />
                <FormikControl
                  control="input"
                  type="number"
                  inputProps={{ min: "0", max: "15", step: "0.5" }}
                  label="Criteria"
                  name="credits.criteria"
                  value={formik.values.credits.criteria}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.credits &&
                    formik.touched.credits.criteria &&
                    formik.errors.credits &&
                    formik.errors.credits.criteria
                  }
                />
                <FormikControl
                  control="input"
                  type="number"
                  inputProps={{ min: "0", max: "15", step: "0.5" }}
                  label="Score"
                  name="credits.score"
                  value={formik.values.credits.score}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.credits &&
                    formik.touched.credits.score &&
                    formik.errors.credits &&
                    formik.errors.credits.score
                  }
                />
                <div>
                  <FormikControl
                    control="input"
                    type="text"
                    label="Link"
                    name="courseLink"
                    value={formik.values.courseLink}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.courseLink && formik.errors.courseLink
                    }
                  />
                  <h6 className="d-flex justify-content-center">Or</h6>
                  <div
                    className="form-group"
                    style={{ border: "0.5px solid grey", padding: "5px" }}
                  >
                    <label htmlFor="uploadFile">Upload Video</label>
                    <div className="custom-file">
                      <input
                        type="file"
                        name="selectedFile"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="custom-file-input"
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="selectedFile"
                      >
                        Choose file
                      </label>
                    </div>
                    {selectedFile && (
                      <div className="alert alert-secondary">
                        <label>{selectedFile.name}</label>
                      </div>
                    )}
                    <ErrorMessage name="selectedFile" />
                    <br />
                    <br />
                    <button
                      onClick={() => uploadVideo(formik)}
                      type="button"
                      className="btn btn-secondary"
                    >
                      Upload
                    </button>
                  </div>
                </div>
                <FormikControl control="submit" />
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CourseForm;
