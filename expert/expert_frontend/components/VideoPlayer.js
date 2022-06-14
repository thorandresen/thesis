export default function VideoPlayer(props) {
    return (
        <div className="video-responsive">
            <iframe
                width="609"
                height="400"
                src="https://www.youtube.com/embed/cb6pFwUY2yI"
                title="YouTube video player"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
        </div>
    )
}