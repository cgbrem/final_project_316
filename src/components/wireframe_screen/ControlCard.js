import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Rnd } from "react-rnd";
import { getFirestore } from 'redux-firestore';


class ControlCard extends React.Component {
    state = {
        height: this.props.control.height,
        width: this.props.control.width,
        x: 10,
        y: 10
    }


    render() {
        const control = this.props.control;
        const type = control.containerType;
        var divStyle = {
                color: control.color,
                fontSize: control.textSize,
                background: control.background,
                borderColor: control.borderColor,
                borderWidth: control.borderThickness,
                borderRadius: control.borderRadius,
                width: control.width,
                height: control.height,
                position: control.position,
                left: control.left,
                top: control.top,
                borderStyle: "solid"
            }

        console.log("control");
            return (
            <Rnd
                id={this.props.control.key}
                key={this.props.control.key}
                size={{ width: this.state.width,  height: this.state.height }}
                style={divStyle}
                position={{ x: this.state.x, y: this.state.y }}
                onClick={(e) => {
                    const {target} = e;
                    const key = this.props.control.key;
                    const newControls = this.props.wireframe.controls;
                    const editItem = newControls[key];
                    const fireStore = getFirestore();
                   
                    fireStore.collection('wireframes').doc(this.props.wireframe.id).update({selectedKey: key});
                    fireStore.collection('wireframes').doc(this.props.wireframe.id).update({text: editItem.text});
                    fireStore.collection('wireframes').doc(this.props.wireframe.id).update({color: editItem.color});
                    fireStore.collection('wireframes').doc(this.props.wireframe.id).update({textSize: editItem.textSize});
                    fireStore.collection('wireframes').doc(this.props.wireframe.id).update({background: editItem.background});
                    fireStore.collection('wireframes').doc(this.props.wireframe.id).update({borderColor: editItem.borderColor});
                    fireStore.collection('wireframes').doc(this.props.wireframe.id).update({borderThickness: editItem.borderThickness});
                    fireStore.collection('wireframes').doc(this.props.wireframe.id).update({borderRadius: editItem.borderRadius});

                }}
                onDragStop={(e, d) => {
                    this.setState({
                    x: d.x,
                    y: d.y
                  });

                    const wireframe = this.props.wireframe;
                    if(!wireframe)
                        return <React.Fragment />
                    const newControls = wireframe.controls;
                    const editControl = newControls[this.props.control.key];
                    const newLeft = this.state.x;
                    const newTop = this.state.y;
                    editControl.x = newLeft;
                    editControl.y = newTop;
                    const fireStore = getFirestore();
                    fireStore.collection('wireframes').doc(wireframe.id).update({controls: newControls});
                }}
                onResizeStop={(e, direction, ref, delta, position, key) => {
                  
                    this.setState({
                    width: ref.style.width,
                    height: ref.style.height,
                    ...position,
                  });

                    const wireframe = this.props.wireframe;
                    if(!wireframe)
                        return <React.Fragment />
                    const newControls = wireframe.controls;
                    const editControl = newControls[this.props.control.key];
                    const newWidth = this.state.width;
                    const newHeight = this.state.height;
                    editControl.width = newWidth;
                    editControl.height = newHeight;
                    const fireStore = getFirestore();
                    fireStore.collection('wireframes').doc(wireframe.id).update({controls: newControls});
                }}
              >
                {control.text}
            </Rnd>
            )   
        }       
    };

const mapStateToProps = (state, ownProps) => {
    const wireframe = ownProps.wireframe;
    const control = ownProps.control;
    const handleSelectControl = ownProps.handleSelectControl;

    return {
        wireframe,
        control,
        handleSelectControl,
        auth: state.firebase.auth,
    };
};
export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'wireframes' },
    ]),
)(ControlCard);