import "./loadingContainer.scss"

export default function LoadingContainer() {

    const color = ()=>{
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        return `#${randomColor}`
    }

    return (
        <div className="loadingContainer">
            <div className="wrapper">
                <div className="ball ball1" style={{backgroundColor:color()}}></div>
                <div className="ball ball2" style={{backgroundColor:color()}}></div>
                <div className="ball ball3" style={{backgroundColor:color()}}></div>
            </div>
            <p>It's loading bro chill...</p>
        </div>
    );
}