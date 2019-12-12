import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ControlsList from './ControlsList.js';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';

class WireframeScreen extends Component {
    state = {
        name: '',
        owner: '',
        items: '',
        currentSortCriteria: '',
        isVisible: false
    }

    render() {
        const auth = this.props.auth;
        const wireframe = this.props.wireframe;
        if(!wireframe)
            return <React.Fragment />
        if (!auth.uid) {
            return <Redirect to="/" />;
        }
       
        const controls = wireframe.controls;
        return (
            <div className="container white">
                <div class="row 1">
                    <div id="container-panel" className="col s3 grey">
                        <div id="zoom">
                            <button>&#128269;</button>
                            <button>&#128270;</button>
                            <button>Save</button>
                            <button>Close</button>
                        </div>
                        <div id="container-div">
                            <button id="container-button"></button>
                        </div>
                        Container
                        <div id="label-div">
                            <button id="label-button"></button>
                        </div>
                        Label
                        <div id="button-div">
                            <button id="button-actual"></button>
                        </div>
                        Button
                        <div id="textfield-div"> 
                            <button id="textfield-button"></button>
                        </div>
                        Textfield
                    </div>
                    <div id="wireframe" className="col s6 light-grey"> 
                        <ControlsList wireframe={wireframe} />
                    </div>
                    <div id="properties" className="col s3 white"> 
                        Properties
                        <div className="input-field">
                            <label htmlFor="fontSize">Font Size</label>
                            <input type="text" name="fontSize" id="fontSize" />
                        </div>
                        <div className="input-field">
                            <label htmlFor="backgroundColor">Background Color</label>
                            <input type="text" name="backgroundColor" id="backgroundColor" />
                        </div>
                        <div className="input-field">
                            <label htmlFor="borderColor">Border Color</label>
                            <input type="text" name="borderColor" id="borderColor" />
                        </div>    
                        <div className="input-field">
                            <label htmlFor="fontColor">Font Color</label>
                            <input type="text" name="fontColor" id="fontColor" />
                        </div>       
                        <div className="input-field">
                            <label htmlFor="borderThickness">Border Thickness</label>
                            <input type="text" name="borderThickness" id="borderThickness" />
                        </div>     
                        <div className="input-field">
                            <label htmlFor="fontColor">Border Radius</label>
                            <input type="text" name="borderRadius" id="borderRadius" />
                        </div>             
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps.match.params;
    const { wireframes } = state.firestore.data;
    const wireframe = wireframes ? wireframes[id] : null;
    if(wireframe)
      wireframe.id = id;
  
    return {
      wireframe,
      auth: state.firebase.auth,
    };
  };

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'wireframes' },
  ]),
)(WireframeScreen);