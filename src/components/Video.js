import React from "react";
import ReactPlayer from "react-player";
import CourseService from "../services/courseService";
import AppUtils from "../utilities/AppUtils";
//import VideoPlayer from "react-video-js-player";

class Video extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course: null,
    };
    this.handleComplete = this.handleComplete.bind(this);
    this.postRating = this.postRating.bind(this);
  }

  async componentDidMount() {
    let { params } = this.props.match;
    let serviceObj = new CourseService();
    let courseDetails = await serviceObj.getCourseById(params.id);

    if (courseDetails) {
      this.setState({
        course: courseDetails,
      });
    }
  }

  handleComplete(e) {
    console.log("Ended");
    this.setState({
      isCompleted: true,
    });
  }

  async postRating(e) {
    e.preventDefault();
    let { params } = this.props.match;
    let service = new CourseService();
    let result = await service.postRating({
      courseId: params.id,
      rating_value: Number(this.state.rating),
    });
    if (result && result.success) {
      alert(result.message);
    }
  }

  render() {
    let renderPlayer = <div>Loading...</div>;
    let course = this.state.course;
    if (course) {
      renderPlayer = (
        <>
          <ReactPlayer
            url={course.courseLink}
            light={course.thumbnail}
            controls={true}
            className="course-video"
            onEnded={this.handleComplete}
          />
          <h3>{course.title}</h3>
          <h6>{course.author.name}</h6>
          <h6>
            {course.publishedDate
              ? AppUtils.formatDateString(course.publishedDate)
              : "Not verified yet"}
          </h6>
          <div>
            {this.state.isCompleted && (
              <>
                <h3>Completed</h3>
                <select
                  name="rating"
                  value={this.state.rating}
                  onChange={(e) => this.setState({ rating: e.target.value })}
                >
                  <option value="5">5</option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                </select>
                <button onClick={this.postRating}>Post Rating</button>
              </>
            )}
          </div>
        </>
      );
    }
    return <div className="container course-desc">{renderPlayer}</div>;
  }
}

export default Video;
