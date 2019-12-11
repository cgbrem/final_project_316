import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireframeCard from './WireframeCard';
import { getFirestore } from 'redux-firestore';


class WireframeLinks extends React.Component {
    handleDelete = (wireframe) => {
        console.log("handleDelete");
        if(!wireframe)
            return <React.Fragment />
        const fireStore = getFirestore();
        fireStore.collection('wireframes').doc(wireframe.id).delete();
    }

    render() {
        const wireframes = this.props.wireframes;
        console.log(wireframes);
        return (
            <div className="wireframe section">
                {wireframes && wireframes.map(wireframe => (
                    <div>
                        <Link to={'/wireframe/' + wireframe.id} key={wireframe.id}>
                            <WireframeCard wireframe={wireframe} />
                        </Link>
                        <button onClick={() => this.handleDelete(wireframe)}>X</button>
                    </div>
                ))}
                
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        wireframes: state.firestore.ordered.wireframes,
        auth: state.firebase.auth,
    };
};

export default compose(connect(mapStateToProps))(WireframeLinks);