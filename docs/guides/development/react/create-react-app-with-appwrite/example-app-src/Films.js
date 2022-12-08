// Import the necessary modules. The React component
// is necessary for the Films component to extend on.
// The Appwrite Query module allows the component to
// filter results fetched from the API. Finally, the
// `appwriteDatabase` object is imported from utils.
import { Query } from 'appwrite';
import React, { Component } from 'react';
import { appwriteDatabase } from './utils';

// Create the Films class, which extends component.
class Films extends Component {
    // Establish the component's state variables.
    state = {
        newFilmName: '',
        filmsToWatchList: [],
        filmsWatchedList: []
    }

    // Have the component call the `fetchFilms`
    // function when the component loads.
    componentDidMount() {
        this.fetchFilms();
    }

    // Fetch the lists of films, assigning them to
    // the component's appropriate state variables.
    fetchFilms = () => {
        // Clear the films lists to start.
        this.setState({
            filmsToWatchList: [],
            filmsWatchedList: []
        });

        // Query the database for films where `status`
        // is `To Watch`.
        const promiseFilmsToWatch = appwriteDatabase.listDocuments('Your-Database-ID', 'Your-Collection-ID', [
            Query.equal('status', 'To Watch')
        ]);

        // Handle the query's promise. Update the
        // state variable based on the results.
        promiseFilmsToWatch.then( (response) => {
            if (response.documents && response.documents.length > 0) {
                this.setState({ ...this.state, filmsToWatchList: response.documents });
            } else {
                this.setState({ ...this.state, filmsToWatchList: [] });
            }
        }, function (error) {
            console.log(error);
        });

        // Query the database for films where `status`
        // is `Watched`.
        const promiseFilmsWatched = appwriteDatabase.listDocuments('Your-Database-ID', 'Your-Collection-ID', [
            Query.equal('status', 'Watched')
        ]);

        // Handle the query's promise. Update the
        // state variable based on the results.
        promiseFilmsWatched.then( (response) => {
            if (response.documents && response.documents.length > 0) {
                this.setState({ ...this.state, filmsWatchedList: response.documents });
            } else {
                this.setState({ ...this.state, filmsWatchedList: [] });
            }
        }, function (error) {
            console.log(error);
        });
    }

    // Update a film with a new status.
    markFilmWatched = (filmId, doMarkWatched) => {
        // Send the update to the API.
        const promiseMarkFilmStatus = appwriteDatabase.updateDocument('Your-Database-ID', 'Your-Collection-ID', filmId, doMarkWatched ? { 'status': "Watched" } : { 'status': "To Watch" });

        // Display the results from the promise
        // on the JavaScript console.
        promiseMarkFilmStatus.then( (response) => {
            console.log("Successfully updated the document.");
        }, function (error) {
            console.log(error);
        });

        // Refresh the films lists.
        this.fetchFilms();
    }

    // Add a new film.
    addNewFilm = () => {
        // Send the new film to the API.
        const promiseMarkFilmStatus = appwriteDatabase.createDocument('Your-Database-ID', 'Your-Collection-ID', 'unique()', { 'name': this.state.newFilmName });

        // Display the results from the promise
        // on the JavaScript console.
        promiseMarkFilmStatus.then( (response) => {
            console.log("Successfully submitted the new film.");
        }, function (error) {
            console.log(error);
        });

        // Refresh the films lists.
        this.fetchFilms();
    }

    // Process a list of films to assign
    // an appropriate HTML element to each.
    renderFilmsList = (filmsList) => {
        if (filmsList.length > 0) {
            return (filmsList.map((film) => {
                const filmStatusCheckbox = <input type="checkbox" onChange={ (e) => this.markFilmWatched(film.$id, e.target.checked) } checked={ film.status === "Watched" ? 'checked' : '' } />
                return (
                    <div class="filmContainer">
                        <strong>{film.name}</strong>
                        {filmStatusCheckbox}<span>Watched?</span>
                    </div>
                );
            }))
        } else {
            return (<div><strong>Empty!</strong></div>)
        }
    }

    // Render the Films component display.
    render () {
        return (
            <div>
                <div style={{ display: 'grid', columnGap: '.5em', rowGap: '1em', padding: '3em' }}>
                    <div style={{ gridColumnStart: 1, gridColumnEnd: 2 }}>
                        <h2>Films to Watch</h2>
                        <div>{ this.renderFilmsList(this.state.filmsToWatchList) }</div>
                    </div>
                    <div style={{ gridColumnStart: 2, gridColumnEnd: 3 }}>
                        <h2>Films Watched</h2>
                        <div>{ this.renderFilmsList(this.state.filmsWatchedList) }</div>
                    </div>
                </div>
                <div style={{ width: '50%', margin: 'auto' }}>
                    <h2>Add New Film</h2>
                    <div>
                        <input type="text" onChange={ (e) => { this.setState({ ...this.state, newFilmName: e.target.value }) } } />
                        <button onClick={this.addNewFilm}>Add</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Films;
