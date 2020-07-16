import React from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

function VideoPreview(props) {
  let courses = props.courseList;
  let heading = "No Courses Available";
  if (courses && courses.length > 0) heading = "Courses Available";

  const confirmDeleteCourse = (course) => {
    confirmAlert({
      title: course.title,
      message: "Are you sure you want to delete this course ?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            props.removeCourse(course);
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
      closeOnEscape: false,
      closeOnClickOutside: false,
    });
  };

  const cardList = courses.map((course) => {
    return (
      <div className="col-md-4" key={course._id}>
        <div className="card course-card" height="75">
          <div className="card-body" height="75">
            <img
              src={course.thumbnail}
              alt=""
              style={{ width: "250px", height: "150px" }}
            />
            <h5 className="card-title">{course.title}</h5>
            <div className="">
              <button
                onClick={() => props.history.push("/video/" + course._id)}
                className="btn btn-outline-secondary"
                style={{ margin: "0.3rem" }}
              >
                Visit Course
              </button>
              {!props.isReviewer && (
                <>
                  <button
                    onClick={() =>
                      props.history.push(`/course/create/${course._id}`)
                    }
                    className="btn btn-outline-danger"
                    style={{ margin: "0.3rem" }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    style={{ margin: "0.3rem" }}
                    onClick={() => confirmDeleteCourse(course)}
                  >
                    Remove
                  </button>
                </>
              )}
              {props.isReviewer && (
                <>
                  <button
                    onClick={() => props.validateCourse(course._id, true)}
                    className="btn btn-outline-secondary"
                    style={{ margin: "0.3rem" }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => props.validateCourse(course._id, false)}
                    className="btn btn-outline-danger"
                    style={{ margin: "0.3rem" }}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div>
      <h2>{heading}</h2>
      <div className="row">{cardList}</div>
    </div>
  );
}

export default VideoPreview;
