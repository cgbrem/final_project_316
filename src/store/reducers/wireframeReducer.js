const initState = {
    wireframes: []
};

const wireframeReducer = (state = initState, action) => {
    switch (action.type) {
        /* IF YOU HAVE ANY WIREFRAME EDITING REDUCERS ADD THEM HERE */ 
        default:
            return state;
            break;
    }
};

export default wireframeReducer;