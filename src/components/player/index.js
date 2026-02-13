import Image from "../image"
import Divider from "@material-ui/core/Divider"
import styles from "./player.module.css";

function Player({ isOddIndex, details }) {
	const { isCaptian, hometown, bio, headshot, name } = details
	return (
		<div className={`${styles.playerContainer} ${isOddIndex ? styles.odd : ""}`}>
				{headshot && <Image alt="headshot" className={styles.playerHeadshot} src={`${process.env.PUBLIC_URL}/rosterPhotos/${headshot}`} />}

				<div className={styles.playerInfo}>
					<div className={styles.playerInfoRow}>
						<div className={styles.playerName}>
							{name}
							{isCaptian && <img className={styles.captianMedal} alt="captian" src={`${process.env.PUBLIC_URL}/icons/captain.svg`} />}
						</div>
						<Divider variant="middle" className={styles.mobilePlayerDivider} />
						<div className={styles.playerHometown}> {hometown}</div>
					</div>

					<div className={styles.playerBio}>{bio}</div>
				</div>
		</div>
	)
}


export default Player



