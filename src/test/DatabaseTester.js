import React from 'react'
import { connect } from 'react-redux';
import wireframeJson from './WireFrameTestData.json';
import { getFirestore } from 'redux-firestore';

class DatabaseTester extends React.Component {
    // since the database is public we can
    // do this any time without having to
    // log in
    handleClear = () => {
        const fireStore = getFirestore();
        fireStore.collection('wireframes').get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                console.log("deleting " + doc.id);
                fireStore.collection('wireframes').doc(doc.id).delete();
            })
        });
    }

    handleReset = () => {
        const fireStore = getFirestore();
        wireframeJson.wireframes.forEach(wireframeJson => {
            fireStore.collection('wireframes').add({
                    key: wireframeJson.key,
                    name: wireframeJson.name,
                    userID: wireframeJson.userID,
                    width: wireframeJson.width,
                    height: wireframeJson.height,
                    controls: wireframeJson.controls,
                    date: new Date().getTime()
                }).then(() => {
                    console.log("DATABASE RESET");
                }).catch((err) => {
                    console.log(err);
                });
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.handleClear}>Clear Database</button>
                <button onClick={this.handleReset}>Reset Database</button>
            </div>
        )
    }
}

const mapStateToProps = function (state) {
    return {
        auth: state.firebase.auth,
        firebase: state.firebase
    };
}

export default connect(mapStateToProps)(DatabaseTester);