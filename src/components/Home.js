import React, { useState, useEffect } from "react";
import CourseService from "../services/courseService";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles, Paper } from "@material-ui/core";
import Carousel from "react-material-ui-carousel";

const useStyles = makeStyles((theme) => ({
  slideImage: {
    height: "400px",
    width: "100%",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
  },
  instructorGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      cursor: "pointer",
    },
  },
  cardMedia: {
    paddingTop: "75%",
  },
  cardContent: {
    flexGrow: 1,
  },
}));

function Home(props) {
  const [categories, setCategories] = useState([]);
  const classes = useStyles();

  const items = [
    {
      name: "Slide1",
      imageURL:
        "https://www.persistent.com/wp-content/uploads/2019/10/fb-yoast-homepage-see-beyond-rise-above.jpg",
    },
    {
      name: "Slide2",
      imageURL: "https://www.okaloosaschools.com/files/2020-03/onlineedu.jpg",
    },
    {
      name: "Slide3",
      imageURL:
        "https://media-exp1.licdn.com/dms/image/C561BAQEo80lFFwSRJQ/company-background_10000/0?e=2159024400&v=beta&t=qT0GFCXH_k1XvlJTAGKbqlLvNaiMN7kZXN7FG1ZGd94",
    },
  ];

  useEffect(() => {
    const service = new CourseService();
    service.getAllCategories().then((catList) => {
      if (catList && catList.length > 0) {
        setCategories(catList);
      }
    });
  }, []);

  const browseByCategory = (cat) => {
    props.history.push(`/browse/${cat}`);
  };

  return (
    <div style={{ paddingTop: 25 }}>
      <Grid container justify="center">
        <Grid item xs={11} sm={11} md={10}>
          <Carousel indicators="fade" interval="3000">
            {items.map((item, i) => {
              const bImage = `url(${item.imageURL})`;
              return (
                <Paper
                  key={i}
                  className={classes.slideImage}
                  style={{ backgroundImage: bImage }}
                />
              );
            })}
          </Carousel>
        </Grid>
      </Grid>
      <Container className={classes.cardGrid} maxWidth="md">
        <Typography variant="h6" component="h4">
          Top Categories
        </Typography>
        <br />
        <Grid container spacing={4}>
          {categories.map((cat) => (
            <Grid item key={cat.name} xs={12} sm={6} md={4}>
              <Card
                className={classes.card}
                onClick={() => browseByCategory(cat.name)}
              >
                <CardMedia
                  className={classes.cardMedia}
                  image={cat.imageURL}
                  title={cat.display}
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h3">
                    {cat.display}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Container className={classes.instructorGrid} maxWidth="md">
        <Grid item>
          <Card style={{ display: "flex" }}>
            <div style={{ flex: 1 }}>
              <CardContent>
                <Typography component="h2" variant="h4">
                  Become an instructor
                </Typography>
                <br />
                <Typography variant="subtitle1" paragraph>
                  Top instructors from around the world teach millions of
                  students on Udemy. We provide the tools and skills to teach
                  what you love.
                </Typography>
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => props.history.push("/app-register/trainer")}
                >
                  Start teaching today
                </Button>
              </CardContent>
            </div>
            <Hidden xsDown>
              <CardMedia
                style={{ width: 320 }}
                image="https://designteachengage.wisc.edu/wp-content/uploads/2016/02/welcome.letter_-1.jpg"
                title="Instructor"
              />
            </Hidden>
          </Card>
        </Grid>
        {/* <Grid>
          <Card>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h4">
                Become an instructor
              </Typography>
              <Typography variant="h5" color="textSecondary" paragraph>
                Top instructors from around the world teach millions of students
                on Udemy. We provide the tools and skills to teach what you
                love.
              </Typography>
              <Button variant="contained" color="primary" size="large">
                Start teaching today
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <CardMedia
                className={classes.cardMedia}
                image="https://designteachengage.wisc.edu/wp-content/uploads/2016/02/welcome.letter_-1.jpg"
                title=""
              />
            </Grid>
          </Card>
        </Grid> */}
      </Container>
    </div>
  );
}

export default Home;

// class Home extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       categories: null,
//       classes: useStyles(),
//     };
//     this.navigate = this.navigate.bind(this);
//   }

//   navigate(genre) {
//     this.props.history.push(`/browse?genre=${genre}`);
//   }

//   async componentDidMount() {
//     const service = new CourseService();
//     const catList = await service.getAllCategories();
//     console.log(catList);

//     if (catList && catList.length > 0) {
//       this.setState({
//         categories: catList,
//       });
//     }
//   }

//   render() {
//     let categories = this.state.categories ? this.state.categories : [];
//     let classes = this.state.classes;
//     // let catElements = this.state.categories.map((cat) => {
//     //   return (
//     //     <button
//     //       key={cat.name}
//     //       className="btn btn-secondary mr-2"
//     //       onClick={() => this.navigate(cat.name)}
//     //     >
//     //       {cat.display}
//     //     </button>
//     //   );
//     // });
//     return (
//       <div style={{ paddingTop: 10 }}>
//         {/* <h2>Welcome to the world of eLearning!</h2>
//         <div className="container">{catElements}</div> */}
//         <Container maxWidth="sm">
//           <Typography
//             component="h1"
//             variant="h2"
//             align="center"
//             color="textPrimary"
//             gutterBottom
//           >
//             Welcome to the world of e-Learning!
//           </Typography>
//           <Typography
//             variant="h5"
//             align="center"
//             color="textSecondary"
//             paragraph
//           >
//             Something generic about the website and what all services Persistent
//             is offering through this, which hardly anyone will care to read.
//           </Typography>
//         </Container>
//         <Container className={classes.cardGrid} maxWidth="md">
//           <Grid container spacing={4}>
//             {categories.map((cat) => (
//               <Grid item key={cat.name} xs={12} sm={6} md={4}>
//                 <Card className={classes.card}>
//                   <CardMedia
//                     className={classes.cardMedia}
//                     image={cat.imageURL}
//                     title={cat.display}
//                   />
//                   <CardContent className={classes.cardContent}>
//                     <Typography gutterBottom variant="h5" component="h3">
//                       {cat.display}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </div>
//     );
//   }
// }

// export default Home;
