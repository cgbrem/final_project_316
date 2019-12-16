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
        oldWidth: '',
        oldHeight: '',
        scale: '',
        controls: '', 
        oldControls: '',
        controlSelected: '',
        fontSize: '',
        backgroundColor: '',
        borderColor: '',
        fontColor: '',
        borderThickness: '',
        borderRadius: '',
        text: '',
        oldUpdate: false
    }

    addControl = (e) => {
        const { target } = e;
        var containerType = '';
        const check = containerType;
        const wireframe = this.props.wireframe;
        if(!wireframe)
            return <React.Fragment />
        var newControls = wireframe.controls;
        if(target.id == "container-button"){
            containerType = "container";
            newControls.push({ //adds new control
                background: "white",
                borderColor: "black",
                borderRadius: "3px",
                borderThickness: "2px",
                color: "black",
                containerType: containerType,
                height: "50px",
                borderStyle: "solid",
                position: "fixed",
                left: "0px",
                top: "0px",
                text: "",
                textSize: "10px",
                width: "100px",
                key: newControls.length
            });
        }
        else if(target.id == "label-button"){
            containerType = "label";
            newControls.push({ //adds new control
                background: "white",
                borderColor: "",
                borderRadius: "3px",
                borderThickness: "0px",
                color: "black",
                containerType: containerType,
                height: "15px",
                borderStyle: "solid",
                position: "fixed",
                left: "0px",
                top: "0px",
                text: "Prompt for Input:",
                textSize: "10px",
                width: "80px",
                key: newControls.length
            });
        }
        else if(target.id == "button-actual"){
            containerType = "button";
            containerType = "label";
            newControls.push({ //adds new control
                background: "lightgrey",
                borderColor: "black",
                borderRadius: "3px",
                borderThickness: "1px",
                color: "black",
                containerType: containerType,
                height: "25px",
                borderStyle: "solid",
                position: "fixed",
                left: "0px",
                top: "0px",
                text: "Submit",
                textSize: "15px",
                width: "100px",
                key: newControls.length
            });
        }
        else if(target.id == "textfield-button"){
            containerType = "textfield";
            newControls.push({ //adds new control
                background: "white",
                borderColor: "black",
                borderRadius: "3px",
                borderThickness: "1px",
                color: "grey",
                containerType: containerType,
                height: "25px",
                borderStyle: "solid",
                position: "fixed",
                left: "0px",
                top: "0px",
                text: "Input",
                textSize: "15px",
                width: "125px",
                key: newControls.length
            });
        }
        
        this.setState({controls: newControls});
        wireframe.controls = newControls;
        const fireStore = getFirestore();
        const id = wireframe.id;
        const test = newControls;
        const doc = fireStore.collection('wireframes');
        fireStore.collection('wireframes').doc(wireframe.id).update({controls: newControls, isSelected: newControls.length-1});
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
            fireStore.collection('wireframes').doc(wireframe.id).update({controls: newControls, isSelected: newControls.length-1});
        }

        if(which == 46 && isSelected != ''){
            
            wireframe.controls.splice(isSelected,1);

            for(var i = isSelected; i < wireframe.controls.length; i++) {
                wireframe.controls[i].key = wireframe.controls[i].key-1;
            }
            const newControls = wireframe.controls;
            const fireStore = getFirestore();
            fireStore.collection('wireframes').doc(wireframe.id).update({ controls: newControls });
        }
    }

    handleSave = (e) => {
        const newControls = this.props.wireframe.controls;
        const newWidth = this.props.wireframe.width;
        const newHeight = this.props.wireframe.height;
        this.setState({oldUpdate: false, oldControls: newControls, oldWidth: newWidth, oldHeight: newHeight});
    }

    handleClose = (e) => {
        const fireStore = getFirestore();
        const newControls = this.state.oldControls;
        const newWidth = this.state.oldWidth;
        const newHeight = this.state.oldHeight;
        fireStore.collection('wireframes').doc(this.props.wireframe.id).update({ controls: newControls, width: newWidth, height: newHeight });
        this.setState({oldUpdate: false});
    }

    handleWireframe = (e) => {
        if(e.target.id == "wireframeHeight"){
            this.setState({height: e.target.value});
        }
        if(e.target.id == "wireframeWidth"){
            this.setState({width: e.target.value});
        }
    }

    handleUpdate = (e) => {
        const fireStore = getFirestore();
        fireStore.collection('wireframes').doc(this.props.wireframe.id).update({ height: this.state.height, width: this.state.width });
    }

    handleUnselect = (e) => {
        const fireStore = getFirestore();
        fireStore.collection('wireframes').doc(this.props.wireframe.id).update({ isSelected: '' });
    }


    render() {
        const auth = this.props.auth;
        const wireframe = this.props.wireframe;

        if(!wireframe)
            return <React.Fragment />
        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        if(!this.state.oldUpdate) {
            this.setState({oldControls: this.props.wireframe.controls,
                            oldUpdate: true,
                            oldWidth: this.props.wireframe.width,
                            oldHeight: this.props.wireframe.height})
        }

               
        const selectedText = wireframe.text;
        const selectedColor = wireframe.color;
        const selectedSize = wireframe.textSize;
        const selectedBackground = wireframe.background;
        const selectedBorderColor = wireframe.borderColor;
        const selectedBorderThickness = wireframe.borderThickness;
        const selectedBorderRadius = wireframe.borderRadius;
        const wireframeHeight = wireframe.height;
        const wireframeWidth = wireframe.width;

        return (
            <div className="container white" tabIndex="0" onClick={this.handleUnselect}onKeyDown={this.handleDuplicate}>
                <div class="row 1">
                    <div id="container-panel" className="col s3 grey">
                        <div id="zoom">
                            <button className="waves-effect waves-light btn">&#128269;</button>
                            <button className="waves-effect waves-light btn">&#128270;</button>
                            <button className="waves-effect waves-light btn"onClick={this.handleSave}>Save</button>
                            <Link to={'/'}>
                                <button className="waves-effect waves-light btn" onClick={this.handleClose}>Close</button>
                            </Link>
                        </div>
                        <div id="container-div">
                            <button id="container-button" style={{background: "white",
                                    borderColor: "black",
                                    marginTop: "25px",
                                    borderRadius: "3px",
                                    borderThickness: "2px",
                                    height: "50px",
                                    borderStyle: "solid",
                                    width: "100px"}} onClick={this.addControl}></button>
                        </div>
                        Container
                        <div id="label-div">
                            <button id="label-button" style={{ background: "white",
                                            borderColor: "",
                                            borderRadius: "3px",
                                            marginTop: "25px",
                                            borderThickness: "0px",
                                            height: "15px",
                                            borderStyle: "solid",
                                            fontSize: "10px",
                                            width: "93px"}} onClick={this.addControl}>Prompt for Input:</button>
                        </div>
                        Label
                        <div id="button-div">
                            <button id="button-actual" style={{
                                background: "lightgrey",
                                borderColor: "black",
                                borderRadius: "3px",
                                marginTop: "25px",
                                borderThickness: "1px",
                                color: "black",
                                height: "25px",
                                borderStyle: "solid",
                                textSize: "15px",
                                width: "100px"}} onClick={this.addControl}>Submit</button>
                        </div>
                        Button
                        <div id="textfield-div"> 
                            <button id="textfield-button" style={{
                                background: "white",
                                borderColor: "black",
                                borderRadius: "3px",
                                borderThickness: "1px",
                                marginTop: "25px",
                                color: "lightgrey",
                                height: "25px",
                                borderStyle: "solid",
                                textSize: "15px",
                                width: "125px"}}  onClick={this.addControl}>Input</button>
                        </div>
                        Textfield
                    </div>
                    <div id="wireframe" onClick="" className="col s6 light-grey"> 
                        <div id="actualWireframe" style={{height: wireframeHeight, width: wireframeWidth, background: 'grey' }}>
                        </div>
                        <ControlsList wireframe={wireframe} />
                    </div>
                    <div id="properties" className="col s3 white"> 
                        <h6><strong>Properties</strong></h6>
                        <div className="input-field" id="change" style={{marginTop: "0px", marginBottom: "0px"}}>
                            <strong>Text</strong>
                            <input type="text" name="text" id="text" style={{height: "20px"}} defaultValue={selectedText} onBlur={this.handleChange}/>
                        </div>
                        <div className="input-field" id="change" style={{marginTop: "0px", marginBottom: "0px"}}>
                            <strong>Font Size</strong>
                            <input type="text" name="fontSize" style={{height: "20px"}}  id="fontSize" defaultValue={selectedSize} onBlur={this.handleChange}/>
                        </div>
                        <div className="input-field" id="change" style={{marginTop: "0px", marginBottom: "0px"}}>
                            <strong>Background Color</strong>
                            <input type="text" name="backgroundColor" style={{height: "20px"}} id="backgroundColor" defaultValue={selectedBackground} onBlur={this.handleChange}/>
                        </div>
                        <div className="input-field" style={{marginTop: "0px", marginBottom: "0px"}}>
                            <strong>Border Color</strong>
                            <input type="text" name="borderColor" style={{height: "20px"}} id="borderColor" defaultValue={selectedBorderColor} onBlur={this.handleChange}/>
                        </div>    
                        <div className="input-field" style={{marginTop: "0px", marginBottom: "0px"}}>
                            <strong>Font Color</strong>
                            <input type="text" name="fontColor" style={{height: "20px"}} id="fontColor" defaultValue={selectedColor} onBlur={this.handleChange}/>
                        </div>       
                        <div className="input-field" style={{marginTop: "0px", marginBottom: "0px"}}>
                            <strong>Border Thickness</strong>
                            <input type="text" name="borderThickness" style={{height: "20px"}} id="borderThickness" defaultValue={selectedBorderThickness} onBlur={this.handleChange}/>
                        </div>     
                        <div className="input-field" style={{marginTop: "0px", marginBottom: "0px"}}>
                            <strong>Border Radius</strong>
                            <input type="text" name="borderRadius" style={{height: "20px"}} id="borderRadius" defaultValue={selectedBorderRadius} onBlur={this.handleChange}/>
                        </div> 
                        <div className="input-field" style={{marginTop: "0px", marginBottom: "0px"}}>
                            <strong>Wireframe Width</strong>
                            <input type="text" name="wireframeWidth" style={{height: "20px"}} id="wireframeWidth" defaultValue={this.state.width} onBlur={this.handleWireframe}/>
                        </div>  
                        <div className="input-field" style={{marginTop: "0px", marginBottom: "0px"}}>
                            <strong>Wireframe Height</strong>
                            <input type="text" name="wireframeHeight" style={{height: "20px"}} id="wireframeHeight" defaultValue={this.state.height} onBlur={this.handleWireframe}/>
                        </div>
                        <button className="waves-effect waves-light btn" id="update" onClick={this.handleUpdate}> Update
                        </button>              
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