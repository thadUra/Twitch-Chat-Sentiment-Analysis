// import { useState } from 'react';

function Sentiment ({
    sentiment
}) {

    const getFill = () => {
        return `${sentiment}%`;
    }

    const getColor = () => {
        if( sentiment >= 65 ) return "#00FF00";
        else if( sentiment <= 35 ) return "#FF0000";
        else return "#ffa500";
    }

    const getColorBG = () => {
        if( sentiment >= 65 ) return "rgba(0, 255, 0, 0.35)";
        else if( sentiment <= 35 ) return "rgba(255, 0, 0, 0.35)";
        else return "rgba(255, 165, 0, 0.35)";
    }

    return (
        <div
            style={{height: "10px", width: "100%", backgroundColor: `${getColorBG()}`}}
        >
            <div
                style={{ height: "10px", backgroundColor: `${getColor()}`, width: `${getFill()}`, transition: "width 1s", transitionTimingFunction: "ease-in-out"}}
            >
            </div>
        </div>
    )
}

export default Sentiment;