import Paper from "@material-ui/core/Paper"
import parse from 'html-react-parser'
import styles from  "./post.module.css";

export default function Post({ children, date, title }) {
	return (
			<Paper className={styles.postContainer}>
				<div className={styles.postHeading}>
					<div>{title}</div>
					<div>{date}</div>
				</div>

				<div className={styles.postBody}>{typeof children === "string" ? parse(children) : children}</div>
			</Paper>
	);
};