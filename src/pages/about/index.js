import { useState, useEffect } from "react";
import axios from "axios"
import Loading from "../../components/loading";
import Post from "../../components/post";
import SectionBanner from "../../components/sectionBanner"
import ImageIntro from '../../components/imageHeader'
import Image from '../../components/image'
import parse from 'html-react-parser'
import { ErrorBoundary, useErrorHandler } from "react-error-boundary"
import ErrorFallback, { logger } from "../../components/error"
import styles from './about.module.css';

export default function About() {
	return (
		<div className={styles.aboutContainer}>
			<ImageIntro src={`${process.env.PUBLIC_URL}/bannerPhotos/team2.jpg`} />
			<AboutBody />
		</div>
	)
}

function AboutBody() {

	const [loading, setLoading] = useState(true)
	const [about, setAbout] = useState({})
	const handleError = useErrorHandler()

	const getData = async () => {
		try {
			const { data } = await axios.get(`/data/about.json`)
			setAbout(data)
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

	return (
		<>
			<ErrorBoundary FallbackComponent={ErrorFallback} onError={logger}>
				<div style={{ margin: "1rem 0" }}>
					<Post>
						{
							loading ? <Loading /> : parse(about.body)
						}
					</Post>
				</div>
			</ErrorBoundary>
            
            {
				loading ? <Loading /> :
					<>
						<SectionBanner>Coaches</SectionBanner>
						<ErrorBoundary FallbackComponent={ErrorFallback} onError={logger}>
							<PeopleContainer eboard={about.coaches} />
						</ErrorBoundary>
					</>
			}

			{
				loading ? <Loading /> :
					<>
						<SectionBanner>Executive Board</SectionBanner>
						<ErrorBoundary FallbackComponent={ErrorFallback} onError={logger}>
							<PeopleContainer eboard={about.eboard} />
						</ErrorBoundary>
					</>
			}

		</>

	)
}

const PeopleContainer = ({ eboard }) => {
	return (
		eboard.map((post, index) => {
			return (
				<div key={index} className={`${styles.PeopleContainer} ${index % 2 ? styles.odd : ""}`}>
					<ErrorBoundary fallback={<div>Error</div>} onError={logger}>
						<div className={styles.executiveRole}>{post.role}</div>
						<Position people={post.people} />
					</ErrorBoundary>
				</div>
			)
		})

	)
}

function Position({ people }) {
	return (
		<div className={styles.executiveContainer}>
			{
				people.map((item, index) => {
					return (
						<ErrorBoundary key={index} fallback={<div>Error</div>} onError={logger}>
							<Person details={item} />
						</ErrorBoundary>
					)
				})
			}
		</div>
	)
}

const Person = ({ details }) => {
	return (
		<div className={styles.executiveInfo}>
			{details.headshot && <Image alt="headshot" className={styles.executiveHeadshot} src={`${process.env.PUBLIC_URL}/executiveHeadshots/${details.headshot}`} />}
			<div className={styles.executiveName}>{details.name}</div>
		</div>
	)
}