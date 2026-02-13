import Image from "../image";
import Divider from "@material-ui/core/Divider"
import styles from "./game.module.css";

export default function Game({ isOddIndex, opponent, score, result, viewingLink, logo, time: gameTime, bTeam, aTeam }) {
	const time = new Date(gameTime);

	const options = {
		day: "numeric",
		month: "numeric",
		hour: "numeric",
		minute: "numeric",
		weekday: "short",
		timeZone: "America/Detroit",
		timeZoneName: "shortGeneric"
	}
	const dateString = time.toLocaleDateString("en-us", options);

	return (
		<div className={`${styles.gameContainer} ${isOddIndex ? styles.odd : ""}`}>
			<div className={styles.gameCardInfo}>

				<Image
					containerStyle={{ margin: "1rem" }}
					alt="opponent"
					className={styles.rivalLogo}
					src={`${process.env.PUBLIC_URL}/schools/${logo}`}
				/>
				<div className={styles.gameInfoText}>
					<div>{dateString}</div>
					{bTeam ? <div><b>{"B TEAM vs. " + opponent.toUpperCase()}</b></div>
						: aTeam ? <div><b>{"A TEAM vs. " + opponent.toUpperCase()}</b></div>
						: <div><b>{"vs. " + opponent.toUpperCase()}</b></div>}
				</div>
			</div>
			<Divider variant="middle" className={styles.mobileScoreDivider} />
			<div className={styles.scoreContainer}>
				{score !== "N/A" && <div className={styles.scoreReport}><b>{score}</b></div>}

				{result && <img
					alt="gameResultLogo"
					className={styles.imageResult}
					src={`${process.env.PUBLIC_URL}/icons/${result}.svg`}
				/>}
			</div>

			{viewingLink && (
				<div
					onClick={() => window.open(viewingLink, "_blank")}
					className={styles.playbackRecording}
				>
					Watch Here
					<svg className={styles.youtubeStream} fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 157.507 109.01"><path fill="none" d="M63.607 30.302v48.915l39.3-24.715-39.3-24.2z" /><path d="M154.107 17.002a19.581 19.581 0 00-13.9-13.8c-12.3-3.2-61.5-3.2-61.5-3.2s-48.3-.2-60.6 3c-6.8 1.8-13.3 7.3-15.1 14-3.3 12.2-3 37.5-3 37.5s-.3 25.3 3 37.5c1.8 6.7 8.4 12.2 15.1 14 12.3 3.3 60.6 3 60.6 3s48.3.2 60.6-3c6.8-1.8 13.1-7.3 14.9-14 3.3-12.1 3.3-37.5 3.3-37.5s-.1-25.3-3.4-37.5zm-90.5 62.215V30.302l39.3 24.2z" /></svg>
				</div>
			)}
		</div>
	);
}