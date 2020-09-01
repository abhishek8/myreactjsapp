import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "./FormikControl";
import CourseService from "../../services/courseService";

import { Button, Typography, CircularProgress } from "@material-ui/core";

const validationSchema = Yup.object({
  title: Yup.string().max(25, "Max 25 characters or less").required("Required"),
  courseLink: Yup.string().max(
    500,
    "Link has exceeded max length. Please use URL compression or choose another"
  ),
});

function CreateVideo(props) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const handleSubmit = async (val) => {
    if (val.courseLink === "" && selectedFile === null) {
      setFileError(true);
      return;
    }

    if (selectedFile) {
      setUploadingFile(true);
      let courseService = new CourseService();
      const res = await courseService.uploadVideo(selectedFile);
      setUploadingFile(false);
      if (res) {
        console.log(res);
        const newContent = {
          subtitle: val.title,
          contentType: "VIDEO",
          sourceLinks: {
            videosrc: res.videoFilePath,
            thumbnail: res.thumbsFilePath,
          },
        };
        props.create(newContent, props.sectName);
      } else {
        setFileError(true);
      }
    } else if (val.courseLink !== "") {
      const newContent = {
        subtitle: val.title,
        contentType: "VIDEO",
        sourceLinks: {
          videosrc: val.courseLink,
        },
      };
      props.create(newContent);
    } else setFileError(true);
  };

  return (
    <Formik
      initialValues={{ title: "", courseLink: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnBlur
    >
      {(formik) => (
        <Form encType="multipart/formdata" style={{ width: "100%" }} noValidate>
          <FormikControl
            control="input"
            label="Title"
            name="title"
            size="small"
            value={formik.values.title}
            onChange={formik.handleChange}
            required
          />
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
            id={props.id}
            name={props.id}
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
            <Typography color="error" variant="subtitle1" component="p">
              Please provide link or select a file
            </Typography>
          )}
          <br />
          <Button variant="contained" color="primary" type="submit" edge="end">
            Upload
          </Button>
          <br />
          {uploadingFile && (
            <Typography color="secondary" variant="subtitle1" component="span">
              <CircularProgress />
              Uploading file to server, please wait...
            </Typography>
          )}
        </Form>
      )}
    </Formik>
  );
}

export default CreateVideo;
