import React from "react";
import {
  makeStyles,
  fade,
  TextField,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  search: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    pointerEvents: "none",
    display: "flex",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  searchControl: {
    margin: theme.spacing(2),
    textAlign: "right",
  },
}));

function SearchComponent(props) {
  const classes = useStyles();

  return (
    <div className={classes.searchControl}>
      <TextField
        label="Search"
        value={props.value}
        onBlur={props.onBlur}
        onChange={props.onChange}
        InputProps={{
          endAdornment: (
            <InputAdornment>
              <IconButton onClick={props.onSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}

export default SearchComponent;

// import React from "react";
// import Form from "react-bootstrap/Form";
// import FormControl from "react-bootstrap/FormControl";
// import InputGroup from "react-bootstrap/InputGroup";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSearch } from "@fortawesome/free-solid-svg-icons";
// import Button from "react-bootstrap/Button";
// import { withRouter } from "react-router";

// class SearchComponent extends React.Component {
//   state = {
//     searchText: "",
//   };

//   handleSubmit = (event) => {
//     event.preventDefault();
//     if (this.state.searchText)
//       this.props.history.push(`/browse?filterBy=${this.state.searchText}`);
//   };

//   render() {
//     return (
//       <Form inline className="col-md-7" onSubmit={this.handleSubmit}>
//         <InputGroup className="col-md-8">
//           <FormControl
//             placeholder="Search"
//             aria-label="Search"
//             aria-describedby="searchText"
//             value={this.state.searchText}
//             onChange={(event) =>
//               this.setState({ searchText: event.target.value })
//             }
//             className="mr-sm-0"
//           />
//           <InputGroup.Append>
//             <Button variant="secondary" type="submit">
//               <FontAwesomeIcon icon={faSearch} />
//             </Button>
//           </InputGroup.Append>
//         </InputGroup>
//       </Form>
//     );
//   }
// }

// export default withRouter(SearchComponent);
