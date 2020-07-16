import React from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import { withRouter } from "react-router";

class SearchComponent extends React.Component {
  state = {
    searchText: "",
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.searchText)
      this.props.history.push(`/browse?filterBy=${this.state.searchText}`);
  };

  render() {
    return (
      <Form inline className="col-md-7" onSubmit={this.handleSubmit}>
        <InputGroup className="col-md-8">
          <FormControl
            placeholder="Search"
            aria-label="Search"
            aria-describedby="searchText"
            value={this.state.searchText}
            onChange={(event) =>
              this.setState({ searchText: event.target.value })
            }
            className="mr-sm-0"
          />
          <InputGroup.Append>
            <Button variant="secondary" type="submit">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>
    );
  }
}

export default withRouter(SearchComponent);
