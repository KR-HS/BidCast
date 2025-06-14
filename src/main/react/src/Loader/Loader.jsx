// Loader.jsx
import React from 'react';
import {BarLoader, BounceLoader, ClipLoader, RotateLoader, ScaleLoader, SyncLoader} from "react-spinners";

const Loader = ({loading}) => {
    return (
        <div id="loader" className="fade-loader">
            <BarLoader
                color="#EA6946"
                loading={true}
                height={30}
                width={1000}
                size={300}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
};

export default Loader;
