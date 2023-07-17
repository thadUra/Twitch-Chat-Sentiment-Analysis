function Progress ({
    count
}) {
    const getFill = () => {
        return `${Math.min(100,count)}%`;
    }
    return (
        <div
            style={{width: "12px", height: "300px", backgroundColor: "#b09fd2"}}
        >
            <div
                style={{ width: "12px", backgroundColor: "#6441a5",height: `${getFill()}`, transition: "height 1s", transitionTimingFunction: "ease-in-out"}}
            >
            </div>
        </div>
    )
}

export default Progress;