import { useState } from "react"
import Spinner from "./spinner"

export default function Image({ src, containerStyle, alt, className }) {
    const [isLoaded, setIsLoaded] = useState(false)

    const imgStyle = {
        objectFit: "cover",
        opacity: isLoaded ? 1 : 0,
        filterBrightness: isLoaded ? 100 : 0,
        filterSaturate: isLoaded ? 100 : 20,
        transition: `filterBrightness ${500 * 0.75}ms cubic-bezier(0.4, 0.0, 0.2, 1),
            filterSaturate ${500}ms cubic-bezier(0.4, 0.0, 0.2, 1),
            opacity ${500 / 2}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
    }

    const loaderContainerStyle = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...containerStyle
    }

    return (
        <div style={{...containerStyle, position: "relative" }} className={className}>
            <img src={src} onLoad={() => setIsLoaded(true)} style={imgStyle} alt={alt} className = {className}/>
            {!isLoaded && <div style={loaderContainerStyle} >
                <Spinner size={100} thickness={140} speed={150} />
            </div>}
        </div>
    )
}
