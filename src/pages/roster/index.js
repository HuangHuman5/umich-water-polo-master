import { useState, useEffect } from "react"
import Player from '../../components/player'
import ImageIntro from '../../components/imageHeader'
import Loading from "../../components/loading";
import axios from "axios"
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import useQuery from "../../components/useQuery";
import { ErrorBoundary, useErrorHandler } from "react-error-boundary"
import ErrorFallback, { logger } from "../../components/error"
import styles from "./roster.module.css"

export default function Roster() {

	const [selectedYear, setSelectedYear] = useState(0)
	const [yearOptions, setYearOptions] = useState([])
	const [loading, setLoading] = useState(true)
	const [roster, setRoster] = useState({})

	const handleError = useErrorHandler()
	const query = useQuery()

	const getData = async () => {
		try {
			const { data } = await axios.get(`/data/roster.json`)

			setRoster(data)
			const years = Object.keys(data).sort((a, b) => b - a)
			setYearOptions(years)
			let defaultYear = query.get("year")
			if (defaultYear && data[defaultYear]) {
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

	useEffect(() => {
		getData()
		// eslint-disable-next-line
	}, [])

	if (loading) {
		return <Loading />
	} else return (
		<div className={styles.rosterBody}>
			<ErrorBoundary FallbackComponent={ErrorFallback} onError={logger}>
				<TeamPhoto roster={roster} selectedYear={selectedYear} />
			</ErrorBoundary>
			<div className={styles.rosterYear}>
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
			<ErrorBoundary FallbackComponent={ErrorFallback} onError={logger}>
				<Players roster={roster} selectedYear={selectedYear} />
			</ErrorBoundary>
		</div>
	);
}

const TeamPhoto = ({ roster, selectedYear }) => {
	return !!roster[selectedYear].photo && <ImageIntro src={`${process.env.PUBLIC_URL}/rosterPhotos/${roster[selectedYear].photo}`} />
}

const Players = ({ roster, selectedYear }) => {
	return (
		roster[selectedYear].people.map((details, index) => {
			return (
				<ErrorBoundary key={`${selectedYear}-${index}`} fallback={<div>Error</div>} onError={logger}>
					<Player
						isOddIndex={index % 2}
						details={details}
					>
					</Player>
				</ErrorBoundary>
			);
		})
	)
}