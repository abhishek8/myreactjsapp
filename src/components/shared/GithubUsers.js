// import React from 'react';
// import axios from 'axios';

// const CardList = (props) => (
//   <div>
//     {props.profiles.map(profile => <Card key={profile.id} {...profile} />)}
//   </div>
// );

// class Form extends React.Component {
//   //userNameInput = React.createRef();
//   state = { userName : ''};
//   handleSubmit = async (event) => {
//     event.preventDefault();
//     //console.log(this.userNameInput.current.value);
//     //console.log(this.state.userName);
//     await axios.get(`https://api.github.com/users/${this.state.userName}`).then(response=> {
//         this.props.onSubmit(response.data);
//         this.setState({userName: ''});
//     }).catch(error=> {
//         console.log(error);
//     });
//     //console.log(response.data);
//   };

//   render() {
//     return (
//       <form onSubmit={this.handleSubmit}>
//         <input 
//           type="text" 
//           placeholder="Github username" 
//           required 
//           //ref={this.userNameInput} 
//           value={this.state.userName} 
//           onChange={event => this.setState({ userName: event.target.value })}/>
//         <button>Add User</button>
//       </form>
//     )
//   }
// }


// class Card extends React.Component {
//   render() {
//     const profile = this.props;
//     return (
//       <div className="github-profile" key={profile.name}>
//         <img src={profile.avatar_url} alt="avatar" />
//         <div className="info">
//           <div className="name">{profile.name}</div>
//           <div className="company">{profile.company}</div>
//         </div>
//       </div>
//     );
//   }
// }


// class GithubUsers extends React.Component{

//   // constructor(props){
//   //   super(props);
//   //   this.state = {
//   //     profiles: testData,
//   //   }
//   // }
//   state = {
//     profiles: [],
//   }

//   addNewProfile = (profileData) =>{
//     this.setState(prevState=> ({ 
//       profiles: [...prevState.profiles, profileData],
//     }));
//   };

//     render(){
//         return(
//             <div style={{paddingTop:10}}>
//                 <div className="header" style={{paddingBottom:10}}>Github User App</div>
//                 <Form onSubmit={this.addNewProfile} />
//                 <CardList profiles={this.state.profiles} />
//             </div>
//         );
//     }
// };

// export default GithubUsers;