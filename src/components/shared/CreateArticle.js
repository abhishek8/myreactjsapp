import React from "react";
import { Formik, Form } from "formik";
import FormikControl from "./FormikControl";
import * as Yup from "yup";
import ResourceService from "../../services/resourceService";

function CreateArticle(props) {
  const validationSchema = Yup.object({
    subtitle: Yup.string()
      .max(25, "Max 25 characters or less")
      .required("Required"),
    textContent: Yup.string()
      .max(500, "Max 500 characters or less")
      .required("Required"),
  });

  const onSubmit = (val) => {
    const service = new ResourceService();
    service.uploadHTMLFile(val.textContent).then((res) => {
      if (res.success) {
        const newContent = {
          subtitle: val.subtitle,
          contentType: "ARTICLE",
          sourceLinks: {
            contentsrc: res.data.path,
          },
          textContent: val.textContent,
        };
        props.create(newContent);
      }
    });
  };

  const setEditorValue = (formik, e) => {
    formik.setFieldValue("textContent", e.editor.getData());
  };

  return (
    <Formik
      initialValues={{ subtitle: "", textContent: "" }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Form style={{ width: "100%" }}>
          <div>
            <FormikControl
              control="input"
              type="text"
              label="Title"
              name="subtitle"
              size="small"
              value={formik.values.subtitle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.subtitle &&
                formik.errors.subtitle &&
                formik.errors.subtitle !== ""
              }
              required
            />
            <FormikControl
              control="richText"
              label="Description"
              name="textContent"
              content={formik.values.textContent}
              events={{
                blur: (e) => setEditorValue(formik, e),
                change: (e) => setEditorValue(formik, e),
              }}
              error={
                formik.touched.textContent &&
                formik.errors.textContent &&
                formik.errors.textContent !== ""
              }
            />
            <FormikControl control="submit" />
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CreateArticle;
