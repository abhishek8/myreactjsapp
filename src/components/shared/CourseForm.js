import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "./FormikControl";
import CourseService from "../../services/courseService";
import {
  Grid,
  Typography,
  Container,
  Card,
  CardMedia,
  makeStyles,
} from "@material-ui/core";

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

function CourseForm(props) {
  const [formValues, setFormValues] = useState({
    title: "",
    genre: "",
    credits: {
      criteria: 0,
      score: 0,
    },
    thumbnail: "",
  });
  const [categories, setCategories] = useState([]);

  const classes = useStyles();

  let { params } = props.match;
  const courseId = params["id"];

  const onSubmit = (val) => {
    console.log(val);
    let courseService = new CourseService();
    courseService.updateCourse(courseId, val).then((res) => {
      if (res && res.id) {
        props.history.push("/course/my-course");
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
          thumbnail: result.thumbnail,
        });
      });
    }
  }, [courseId]);

  return (
    <Container>
      <br />
      <Typography component="h4" variant="h5">
        Edit
      </Typography>
      <br />
      <Grid container style={{ display: "flex" }}>
        <Formik
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {(formik) => (
            <Form encType="multipart/formdata" className={classes.form}>
              <Grid item xs={12} sm={12} md={6}>
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
                    label="Thumbnail"
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
                  <Grid container justify="center" align="center">
                    <FormikControl control="submit" />
                  </Grid>
                </div>
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
            </Form>
          )}
        </Formik>
      </Grid>
    </Container>
  );
}

export default CourseForm;
