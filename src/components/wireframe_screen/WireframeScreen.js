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
        userID: '',
        width: '',
        height: '',
        scale: '',
        controls: '', 
        controlSelected: '',
        fontSize: '',
        backgroundColor: '',
        borderColor: '',
        fontColor: '',
        borderThickness: '',
        borderRadius: '',
        text: '',
        lastKeyPressed: ''
    }

    addControl = (e) => {
        const { target } = e;
        var containerType = '';
        if(target.id == "container-button")
            containerType = "container";
        else if(target.id == "label-button")
            containerType = "label";
        else if(target.id == "button-actual")
            containerType = "button";
        else if(target.id == "textfield-button")
            containerType = "textfield";
        const check = containerType;
        const wireframe = this.props.wireframe;
        if(!wireframe)
            return <React.Fragment />
        var newControls = wireframe.controls;
        newControls.push({ //adds new control
            background: "white",
            borderColor: "black",
            borderRadius: "0px",
            borderThickness: "10px",
            color: "black",
            containerType: containerType,
            height: "40px",
            borderStyle: "solid",
            position: "fixed",
            left: "0px",
            top: "60px",
            text: "CONTAINERRRRRRRRRRRRRRR",
            textSize: "10px",
            width: "20px",
            key: newControls.length
        });
        this.setState({controls: newControls});
        wireframe.controls = newControls;
        const fireStore = getFirestore();
        const id = wireframe.id;
        const test = newControls;
        const doc = fireStore.collection('wireframes');
        fireStore.collection('wireframes').doc(wireframe.id).update({controls: newControls});
    }

    onDragStop = (e, d, key) => {
        var newControls = this.props.wireframe.controls;
        newControls[key].left = d.x;
        newControls[key].top = d.y;
        const fireStore = getFirestore();
        fireStore.collection('wireframes').doc(this.props.wireframe.id).update({controls: newControls});
    }


    handleChange = (e) => {
        const wireframe = this.props.wireframe;
        if(!wireframe)
            return <React.Fragment />
        var field = e.target.id;
        const newControls = wireframe.controls;
        const control = newControls[wireframe.selectedKey];
        
        if(field == "text")
            control.text = e.target.value;
        if(field == "fontColor")
            control.color = e.target.value;
        if(field == "fontSize")
            control.textSize = e.target.value;
        if(field == "backgroundColor")
            control.background = e.target.value;
        if(field == "borderColor")
            control.borderColor = e.target.value;
        if(field == "borderThickness")
            control.borderThickness = e.target.value;
        if(field == "borderRadius")
            control.borderRadius = e.target.value;

        const fireStore = getFirestore();
        fireStore.collection('wireframes').doc(this.props.wireframe.id).update({controls: newControls});
        fireStore.collection('wireframes').doc(this.props.wireframe.id).update({[e.target.id]: e.target.value});
    }

    handleDuplicate = (e) => {
        const which = e.which;
        const fireStore = getFirestore();
        const isSelected = this.props.wireframe.selectedKey;
        const wireframe = this.props.wireframe;
        if(which == 17 && isSelected != ''){
            var newControls = wireframe.controls;
            var control = newControls[isSelected];
            newControls.push({ //adds new control
                background: control.background,
                borderColor: control.borderColor,
                borderRadius: control.borderRadius,
                borderThickness: control.borderThickness,
                color: control.color,
                containerType: control.containerType,
                height: control.height,
                position: "fixed",
                left: control.left,
                top: control.top,
                text: control.text,
                textSize: control.textSize,
                width: control.width,
                key: newControls.length
            });
            this.setState({controls: newControls});
            const check = newControls;
            wireframe.controls = newControls;
            fireStore.collection('wireframes').doc(wireframe.id).update({controls: newControls});
        }
    }


    render() {
        const auth = this.props.auth;
        const wireframe = this.props.wireframe;

        if(!wireframe)
            return <React.Fragment />
        if (!auth.uid) {
            return <Redirect to="/" />;
        }
               
        const selectedText = wireframe.text;
        const selectedColor = wireframe.color;
        const selectedSize = wireframe.textSize;
        const selectedBackground = wireframe.background;
        const selectedBorderColor = wireframe.borderColor;
        const selectedBorderThickness = wireframe.borderThickness;
        const selectedBorderRadius = wireframe.borderRadius;

        return (
            <div className="container white" tabIndex="0" onKeyDown={this.handleDuplicate}>
                <div class="row 1">
                    <div id="container-panel" className="col s3 grey">
                        <div id="zoom">
                            <button>&#128269;</button>
                            <button>&#128270;</button>
                            <button>Save</button>
                            <button>Close</button>
                        </div>
                        <div id="container-div">
                            <button id="container-button" onClick={this.addControl}></button>
                        </div>
                        Container
                        <div id="label-div">
                            <button id="label-button" onClick={this.addControl}></button>
                        </div>
                        Label
                        <div id="button-div">
                            <button id="button-actual" onClick={this.addControl}></button>
                        </div>
                        Button
                        <div id="textfield-div"> 
                            <button id="textfield-button" onClick={this.addControl}></button>
                        </div>
                        Textfield
                    </div>
                    <div id="wireframe" onClick="" className="col s6 light-grey"> 
                        <ControlsList wireframe={wireframe} />
                    </div>
                    <div id="properties" className="col s3 white"> 
                        Properties
                        <div className="input-field">
                            Text
                            <input type="text" name="text" id="text" defaultValue={selectedText} onBlur={this.handleChange}/>
                        </div>
                        <div className="input-field">
                            Font Size
                            <input type="text" name="fontSize" id="fontSize" defaultValue={selectedSize} onBlur={this.handleChange}/>
                        </div>
                        <div className="input-field">
                            Background Color
                            <input type="text" name="backgroundColor" id="backgroundColor" defaultValue={selectedBackground} onBlur={this.handleChange}/>
                        </div>
                        <div className="input-field">
                            Border Color
                            <input type="text" name="borderColor" id="borderColor" defaultValue={selectedBorderColor} onBlur={this.handleChange}/>
                        </div>    
                        <div className="input-field">
                            Font Color
                            <input type="text" name="fontColor" id="fontColor" defaultValue={selectedColor} onBlur={this.handleChange}/>
                        </div>       
                        <div className="input-field">
                            Border Thickness
                            <input type="text" name="borderThickness" id="borderThickness" defaultValue={selectedBorderThickness} onBlur={this.handleChange}/>
                        </div>     
                        <div className="input-field">
                            Border Radius
                            <input type="text" name="borderRadius" id="borderRadius" defaultValue={selectedBorderRadius} onBlur={this.handleChange}/>
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