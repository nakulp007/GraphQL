import React, { Component } from 'react';
//to make react understand apollo and gql
import { graphql } from 'react-apollo';
import { getBooksQuery } from '../queries/queries';

// components
import BookDetails from './BookDetails';


class BookList extends Component {
  constructor(props){
    super(props);
    this.state = {
      selected: null,
    };
  }

  displayBooks(){
    var data = this.props.data;
    if(data.loading){
      return(<div>Loading books...</div>);
    }else{
      return data.books.map(book => {
        return(
          <li key={book.id} onClick={ (e)=> {this.setState({ selected: book.id })} }>{book.name}</li>
        )
      })
    }
  }

  render() {
    return (
      <div>
        <ul id="book-list">
            { this.displayBooks() }
        </ul>
        <BookDetails bookId={this.state.selected} />
      </div>
    );
  }
}

//take graphql package from react-apollo
//use it to bind the query getBooksQuery
//to component BookList
//then inside the component, 
//you will have access to all the data that comes from the query
//it is stored in component's props
export default graphql(getBooksQuery)(BookList);
