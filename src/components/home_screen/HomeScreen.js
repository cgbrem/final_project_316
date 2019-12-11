import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import WireframeLinks from './WireframeLinks';
import { getFirestore } from 'redux-firestore';

class HomeScreen extends Component {

    handleNewWireframe = (e) => {
        const { target } = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));

        const fireStore = getFirestore();
        fireStore.collection('wireframes').add({
            key: "you need to change this",
            name: "Untitled",
            userID: "you need to change this",
            width: "50",
            height: "50",
            controls: new Array(),
            date: new Date().getTime()
        });
    }

    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m4">
                        <WireframeLinks />
                    </div>

                    <div className="col s8">
                        <div className="banner">
                            @wireframe<br />
                            Wireframe Maker
                        </div>
                        
                        <div className="home_new_list_container">
                            <Link to={this.props.history.location.pathname}>
                                <button className="home_new_list_button" onClick={this.handleNewWireframe}>
                                    Create a New Wireframe
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        firebase: state.firebase
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
      { collection: 'wireframes', orderBy: ['date', 'desc'] },
    ]),
)(HomeScreen);