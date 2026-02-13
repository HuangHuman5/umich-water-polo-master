import styles from "./sectionBanner.module.css";

export default function Sub ({ children }){
	return (
		<div className={styles.sectionBanner}>
			{children}
		</div>
	);
};