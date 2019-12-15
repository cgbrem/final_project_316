import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ControlCard from './ControlCard';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';


class ControlsList extends React.Component {

    render() {
        const wireframe = this.props.wireframe;
        const handleSelectControl = this.props.handleSelectControl;
        const controls = wireframe.controls;
        console.log("ControlsList: wireframe.id " + wireframe.id);
        return (
            <div className="wireframes section">
                {controls && controls.map(function(control) {
                    control.id = control.key;
                    const key = control.key;
                    return (
                        <div id={control.key}>
                            <ControlCard wireframe={wireframe}  control={control} id={control.id} key={control.id}/>
                        </div>
                    );})
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const wireframe = ownProps.wireframe;
    const handleSelectControl = ownProps.handleSelectControl;
    return {
        wireframe,
        handleSelectControl,
        auth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'wireframes' },
    ]),
)(ControlsList);