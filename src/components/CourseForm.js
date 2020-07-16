// import React, { Component } from "react";
// import CourseService from "../services/courseService";

// export class VideoDashboard extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       title: "",
//       description: "",
//       selectedFile: null,
//       thumbnail: "",
//     };

//     this.handleSubmit = this.handleSubmit.bind(this);
//     this.uploadFile = this.uploadFile.bind(this);
//   }

//   uploadFile(e) {
//     let addedFile = e.target.files[0];
//     if (addedFile && addedFile.type === "video/mp4") {
//       this.setState({
//         selectedFile: addedFile,
//       });
//     } else {
//       alert(
//         "Invalid file provided. Please upload video files only in mp4 format"
//       );
//     }
//   }

//   async handleSubmit(e) {
//     e.preventDefault();

//     let data = {
//       title: this.state.title,
//       description: this.state.description,
//       thumbnail: this.state.thumbnail,
//       videosrc: this.state.selectedFile.name,
//       file: this.state.selectedFile,
//     };

//     let serviceObj = new CourseService();
//     let filename = await serviceObj.addNewCourse(data);
//     if (filename) {
//       let id = filename.replace(".mp4", "");
//       this.props.history.push("/video/" + id);
//     }
//   }

//   render() {
//     let pic = this.state.thumbnail;
//     return (
//       <div className="col-12">
//         <div className="create-form">
//           <div className="row">
//             <div className="col-lg-6">
//               <form encType="multipart/form-data" onSubmit={this.handleSubmit}>
//                 <div className="form-group">
//                   <input
//                     type="text"
//                     name="title"
//                     value={this.state.title}
//                     onChange={(e) => {
//                       this.setState({ title: e.target.value });
//                     }}
//                     placeholder="Title"
//                     className="form-control"
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <textarea
//                     name="desc"
//                     value={this.state.description}
//                     placeholder="Description"
//                     onChange={(e) => {
//                       this.setState({ description: e.target.value });
//                     }}
//                     className="form-control"
//                     maxLength="500"
//                   >
//                     {this.state.description}
//                   </textarea>
//                 </div>
//                 <div className="form-group">
//                   <input
//                     type="file"
//                     name="file"
//                     onChange={this.uploadFile}
//                     className="form-control btn"
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <input
//                     type="text"
//                     name="thumbnail"
//                     placeholder="Thumbnail"
//                     onChange={(e) => {
//                       this.setState({ thumbnail: e.target.value });
//                     }}
//                     className="form-control"
//                   />
//                 </div>
//                 <div className="d-flex justify-content-center">
//                   <button type="submit" className="btn btn-secondary">
//                     Submit
//                   </button>
//                 </div>
//               </form>
//             </div>
//             <div className="img-container">
//               <img
//                 src={pic}
//                 className="img-fluid img-thumbnail"
//                 height="350"
//                 alt=""
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default VideoDashboard;
