import Image from "../image"
import "./style.css"

export default function ImageHeader({ src }) {
    return <Image src = {src} alt = "section header" className = "imageHeader"/>
}