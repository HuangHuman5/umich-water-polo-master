import { useState, useEffect } from "react";
import Game from "../../components/game";
import axios from "axios"
import Loading from "../../components/loading";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from '@material-ui/core/TextField';
import useQuery from "../../components/useQuery";
import CountUp from "../../components/countUp"
import { ErrorBoundary, useErrorHandler } from "react-error-boundary"
import SectionBanner from "../../components/sectionBanner"
import ErrorFallback, { logger } from "../../components/error"
import styles from "./schedule.module.css";

export default function Schedule() {

	const [selectedYear, setSelectedYear] = useState(0)
	const [yearOptions, setYearOptions] = useState([])
	const [loading, setLoading] = useState(true)
	const [schedule, setSchedule] = useState({})
	const [awards, setAwards] = useState({})

	const handleError = useErrorHandler()
	const query = useQuery()

	useEffect(() => {
		getData()
		// eslint-disable-next-line
	}, [])

	const getData = async () => {
		try {
			const [scheduleResponse, awardsResponse] = await axios.all([
				axios.get(`/data/schedule.json`).then(r => r.data),
				axios.get(`/data/awards.json`).then(r => r.data)
			])
			setSchedule(scheduleResponse)
			setAwards(awardsResponse)
			const years = [...new Set(Object.keys(scheduleResponse), Object.keys(awardsResponse))].sort((a, b) => b - a)
			setYearOptions(years)
			let defaultYear = query.get("year")
			if (defaultYear && (scheduleResponse[defaultYear] || awardsResponse[defaultYear])) {
				setSelectedYear(defaultYear)
			} else {
				setSelectedYear(years[0])
			}
			setLoading(false)
		} catch (error) {
			console.log(error)
			handleError(error)
		}
	}

	if (loading) {
		return <Loading />
	}
	else return (
		<div className={styles.scheduleBody}>
			<h2 className={styles.seasonTitle}>{selectedYear} Season</h2>
			<div className={styles.seasonBanner}>
				<ErrorBoundary FallbackComponent={ErrorFallback} onError={logger}>
					<SeasonStats selectedYear={selectedYear} schedule={schedule} />
				</ErrorBoundary>
				<div className={styles.scheduleYear}>
					<Autocomplete
						value={selectedYear}
						disableClearable
						onChange={(e, value) => setSelectedYear(value)}
						options={yearOptions}
						autoHighlight
						style={{ width: 100 }}
						renderInput={(params) => <TextField {...params} label="Year" />}
					/>
				</div>
			</div>
			<ErrorBoundary FallbackComponent={ErrorFallback} onError={logger}>
				<Tournaments schedule={schedule} selectedYear={selectedYear} />
			</ErrorBoundary>
			<ErrorBoundary FallbackComponent={ErrorFallback} onError={logger}>
				<Awards awards={awards} selectedYear={selectedYear} />
			</ErrorBoundary>
		</div >
	)
}

const Tournaments = ({ schedule, selectedYear }) => {
	return (
		!!schedule[selectedYear] &&
		< div >
			<SectionBanner>Matches</SectionBanner>
			{Object.keys(schedule[selectedYear]).map((tournament, index) => {
				return (
					<div key={`${selectedYear}-${index}`}>
						<TournBanner
							name={tournament}
							host={schedule[selectedYear][tournament].host}
							location={schedule[selectedYear][tournament].location}
							dates={schedule[selectedYear][tournament].dates}
							directions={schedule[selectedYear][tournament].directions}
						/>
						{schedule[selectedYear][tournament].bracketLink &&
							<p className={styles.bracketLink}><a href={`${process.env.PUBLIC_URL}/bracket`}>Click here</a> to view the full bracket!</p>
						}
						{
							schedule[selectedYear][tournament].TBD ?
							<p className={styles.TBDtext}> - Schedule TBD - </p> :
							// Render all games in tournament
							schedule[selectedYear][tournament].games.map(
								(game, index) => {
									return (
										<Game
											isOddIndex={index % 2}
											key={`${selectedYear}-${index}`}
											opponent={game.opponent}
											score={game.score}
											result={game.result}
											viewingLink={game.viewingLink}
											time={game.time}
											logo={game.logo}
											bTeam={game.bTeam}
											aTeam={game.aTeam}
										/>
									);
								}
							)
						}
					</div>
				);
			})}
		</div>

	)
}

const SeasonStats = ({ selectedYear, schedule }) => {

	const [yearStats, setYearStats] = useState({ wins: 0, losses: 0 })

	useEffect(() => {
		if (schedule[selectedYear]) {
			let newState = { wins: 0, losses: 0 }
			for (const tournamentTitle in schedule[selectedYear]) {
				let tournament = schedule[selectedYear][tournamentTitle]
				if (tournament.excludeInWinLossTotal) continue;
				if (tournament.TBD) continue;
				for (let i = 0; i < tournament.games.length; i++) {
					if (tournament.games[i].result === "win") {
						newState.wins += 1
					} else if (tournament.games[i].result === "loss") {
						newState.losses += 1
					}
				}
			}
			setYearStats(newState)
		}
		// eslint-disable-next-line
	}, [selectedYear])

	return (
		<div className={styles.seasonStatsContainer}>
			<div className={styles.seasonStatsItem}>
				<div><b><CountUp updateKey={yearStats.wins} to={yearStats.wins} duration={1} /></b></div>
				WINS
			</div>
			<div className={styles.seasonStatsItem}>
				<div><b><CountUp updateKey={yearStats.losses} to={yearStats.losses} duration={1} /></b></div>
				LOSSES
			</div>
		</div>
	)
}

const Awards = ({ awards, selectedYear }) => {
	return (
		!!awards[selectedYear] &&
		<div>
			<SectionBanner >End of Season Awards</SectionBanner>
			{awards[selectedYear].map((post, index) => {
				return (
					<div key={`${selectedYear}-${index}`}>
						<AwardPannel
							title={post.awardName}
							isOddIndex={index % 2}
						>
							{
								// Render all people who got award
								post.recipients.map(
									people => {
										return (
											<div key={people}>
												{people}
											</div>
										)
									}
								)
							}
						</AwardPannel>
					</div>
				)
			})}
		</div>

	)
}

const TournBanner = ({ name, location, directions, dates, host }) => {
	return (
		<div className={styles.bannerHolder}>
			<div className={styles.tournamentName}><b>{name}</b></div>
			<div className={styles.bannerRow}>
				<div className={styles.bannerDates}>{dates}</div>
				<div>@ {host}</div>
				<div className={styles.tournamentLocation} onClick={() => window.open(directions, "_blank")}>
					<img className={styles.hubIcon} alt="hub icon" src={`${process.env.PUBLIC_URL}/icons/map.png`} />
					{location}
				</div>
			</div>
		</div>
	)
}

const AwardPannel = ({ children, title, isOddIndex }) => {
	return (
		<div className={`${styles.awardBackground} ${isOddIndex ? styles.odd : ""}`}>
			<div>{title}</div>
			<div className={styles.peopleHolder}>
				<div>{children}</div>
			</div>
		</div>
	);
};