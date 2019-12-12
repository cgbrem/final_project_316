import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import Container from 'react-materialize/lib/Container';


class ControlCard extends React.Component {
    render() {
        const control = this.props.control;
        const type = control.containerType;
        var divStyle = {
                color: "blue",
                textSize: "50px",
                background: "white",
                borderColor: "blue",
                borderThickness: "10px",
                borderRadius: "0px",
                width: "50px",
                height: "50px",
                xCoordinate: "200",
                yCoordinate: "145"
        }
        if(type == "button"){
            return(
            <button id={control.key} style={divStyle}>
                {control.text}
            </button>  
            )     
        }
        else{
            return (
            <div id={control.key} style={divStyle}>
                {control.text}
            </div>  
            )   
        }       
    };
}
const mapStateToProps = (state, ownProps) => {
    const wireframe = ownProps.wireframe;
    const control = ownProps.control;
    return {
        wireframe,
        control,
        auth: state.firebase.auth,
    };
};
export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'wireframes' },
    ]),
)(ControlCard);