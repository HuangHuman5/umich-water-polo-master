import Spinner from "../spinner"
import styles from "./loading.module.css"
export default function Loading() {
    return (
        <div className = {styles.loadingCenter}>
            <Spinner size={100} thickness={140} speed={150} />
        </div>
    )
}