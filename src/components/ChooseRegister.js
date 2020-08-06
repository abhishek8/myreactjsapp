import React from "react";
import {
  Grid,
  Container,
  Typography,
  Button,
  makeStyles,
  Toolbar,
  Paper,
  Avatar,
  CardContent,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    marginTop: theme.spacing(4),
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "80%",
  },
  avatar: {
    backgroundColor: "#FD7F39",
    width: theme.spacing(15),
    height: theme.spacing(15),
    marginBottom: theme.spacing(2),
  },
}));

function ChooseRegister(props) {
  const classes = useStyles();
  return (
    <Container maxWidth="md">
      <Grid container>
        <Grid item xs={12} sm={12} md={6} className={classes.cardGrid}>
          <Paper className={classes.card} elevation={0}>
            <Avatar
              className={classes.avatar}
              alt="Trainer"
              src="https://cdn1.iconfinder.com/data/icons/profession-avatar-flat/64/Avatar-teacher-lecturer-instructor-512.png"
            />
            <br />
            <CardContent>
              <Typography variant="h6" component="h6" gutterBottom>
                Create online video courses and contribute to our online
                community of learning.
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                gutterBottom
                paragraph
              >
                Help people learn new skills, advance their careers, and explore
                their hobbies by sharing your knowledge to our online community.
              </Typography>
            </CardContent>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                props.history.push(
                  "/app-register/trainer" + props.location.search
                )
              }
            >
              Join as Trainer
            </Button>
            <Toolbar />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={6} className={classes.cardGrid}>
          <Paper className={classes.card} elevation={0}>
            <Avatar
              className={classes.avatar}
              alt="Learner"
              src="https://cdn3.iconfinder.com/data/icons/human-resources-42/512/employee-team-business-man-avatar-512.png"
            />
            <br />
            <CardContent>
              <Typography variant="h6" component="h6" gutterBottom>
                Build skills with courses from our online learning platform.
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                gutterBottom
                paragraph
              >
                Start building credits by taking our free courses and access our
                specialized courses which will help you to excel in your career.
              </Typography>
            </CardContent>

            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                props.history.push("/app-register" + props.location.search)
              }
            >
              Join as Learner
            </Button>
            <Toolbar />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ChooseRegister;
