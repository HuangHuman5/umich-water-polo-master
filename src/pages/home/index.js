import { useState, useEffect, lazy, Suspense } from "react"
import axios from "axios"
import Post from "../../components/post";
import AliceCarousel from "react-alice-carousel";
import Image from "../../components/image"
import Paper from "@material-ui/core/Paper"
import Spinner from "../../components/spinner"
import CountUp from "../../components/countUp"
import { ErrorBoundary, useErrorHandler } from "react-error-boundary"
import ErrorFallback, { logger } from "../../components/error"
import styles from "./home.module.css";
import retry from "../../reload"
import "react-alice-carousel/lib/alice-carousel.css";

const AlumniNetwork = lazy(() => retry(() => import('../../components/alumni')));

const Loading = ({ style }) => {
	return (
		<div style={style} className={`${styles.carouselContainer} ${styles.slideshowContainer}`}>
			<Spinner size={100} thickness={140} speed={150} />
		</div>
	)
}

const Banner = () => {
	const [visible, setVisible] = useState(true);
	const [banner, setBanner] = useState({
		display: false,
		header: "",
		subheader: "",
		link: "",
		expire: ""
	});
	const [loading, setLoading] = useState(true);

	const handleError = useErrorHandler();

	const getData = async () => {
		try {
			const { data } = await axios.get('/data/banner.json');
			if (!data.display ||
				(new Date() - new Date(data.expire)) >= 0) {
				setVisible(false);
			}
			setBanner(data);
			setLoading(false);
		}
		catch (error) {
			console.log(error);
			handleError(error);
		}
	}

	useEffect(() => {
		getData();
		// eslint-disable-next-line
	}, []);

	return (
		loading ? <Loading /> :
		visible ?
			<div className={styles.bannerContainer}>
					<svg className={styles.bannerX} viewBox="0 0 16 16" onClick={() => setVisible(false)}>
						<path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
						<path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
					</svg>
					<h1 className={styles.bannerHeader}>
						<a href={`${process.env.PUBLIC_URL}${banner.link}`} className={styles.bannerLink}>
							{banner.header}
						</a>
					</h1>
					<h2 className={styles.bannerSubheader}>
						<a href={`${process.env.PUBLIC_URL}${banner.link}`} className={styles.bannerLink}>
							{banner.subheader}
						</a>
					</h2>
			</div>
		: <></>
	);
}

export default function Home() {
	return (
		<div className={styles.bodyContainer}>
			<ErrorBoundary FallbackComponent={ErrorFallback} onError={logger}>
				<Banner />
			</ErrorBoundary>
			<ErrorBoundary FallbackComponent={ErrorFallback} onError={logger}>
				<Carousel />
			</ErrorBoundary>
			<h2 className={styles.quote}>Hail to the victors.</h2>
			<div className={styles.championBanner}>
				<ErrorBoundary FallbackComponent={ErrorFallback} onError={logger}>
					<Paper className={styles.championBannerItem} elevation={3}><span><b><CountUp to={100} duration={2} />+</b></span>First Team All&#x2011;Americans</Paper>
					<Paper className={styles.championBannerItem} elevation={3}><span><b><CountUp to={3} duration={1} />x</b></span>National Champions</Paper>
					<Paper className={styles.championBannerItem} elevation={3}><span><b><CountUp to={16} duration={1} />x</b></span>Big Ten Champions</Paper>
					<Paper className={styles.championBannerItem} elevation={3}><span><b><CountUp to={100} duration={2} />+</b></span>Academic All&#x2011;Americans</Paper>
				</ErrorBoundary>
			</div>
			<div style={{ marginTop: "4rem" }}>
				<ErrorBoundary FallbackComponent={ErrorFallback} onError={logger}>
					<Updates />
				</ErrorBoundary>
			</div>
			<div style={{ marginTop: "4rem" }}>
				<h4 className={styles.homeSubTitle}>Alumni Network</h4>
				<div className={styles.alumniSubtitle}>
					Our Alumni work all across the globe and provide the team with an invaluable networking resource.
				</div>
				<ErrorBoundary FallbackComponent={ErrorFallback} onError={logger}>
					<Suspense fallback={<Loading style={{ height: "120px" }} />}>
						<AlumniNetwork />
					</Suspense>
				</ErrorBoundary>
				<ErrorBoundary FallbackComponent={ErrorFallback} onError={logger}>
					<div className={styles.imageContainer}>
						<img className={styles.recSportsLogo} src={`${process.env.PUBLIC_URL}/misc/recSportsLogo.png`} alt="Rec Sports Logo" />
					</div>
				</ErrorBoundary>
			</div>

		</div>
	)
}


function useOrientation() {
	const [orientation, setOrientation] = useState("landscape");
	useEffect(() => {
		function updateOrientation() {
			setOrientation(window.innerWidth > window.innerHeight ? "landscape" : "portrait");
		}
		window.addEventListener('resize', updateOrientation);
		updateOrientation();
		return () => window.removeEventListener('resize', updateOrientation);
	}, []);
	return orientation;
}

function Carousel() {
	const [photos, setPhotos] = useState([])
	const [loading, setLoading] = useState(true)
	const [activePhoto, setActivePhoto] = useState(0)

	const handleError = useErrorHandler()
	const orientation = useOrientation()

    const mod = (n, m) => ((n % m) + m) % m

	const slideTo = (i) => setActivePhoto(i)
	const slideNext = () => setActivePhoto(i => mod(i + 1, photos[orientation].length))
	const slidePrev = () => setActivePhoto(i => mod(i - 1, photos[orientation].length))

    const getPhotos = async () => {
		try {
			const { data } = await axios.get("/data/slideshow.json")
			setPhotos(data)
			setLoading(false)
		} catch (error) {
			console.log(error)
			handleError(error)
		}
	}

	useEffect(() => {
		getPhotos()
		// eslint-disable-next-line
	}, []);

	if (loading) {
		return (
			<Loading />
		)
	} else if (photos[orientation].length === 0) {
		return <div />
	} else return (
		<>
			<div className={styles.carouselContainer}>
				<img
					className={styles.arrow}
					onClick={() => slidePrev()}
					alt="arrow"
					src={`${process.env.PUBLIC_URL}/icons/left.svg`}
				/>

				<div className={styles.slideshowContainer}>
				<AliceCarousel
						autoPlayInterval={5000}
						infinite
						autoPlay
						animationType="slide"
						autoPlayStrategy="action"
						disableButtonsControls
						disableDotsControls
						activeIndex={activePhoto}
						onSlideChanged={e => slideTo(e.item)}
						items={photos[orientation].map((link) => {
							return (
								<Image
									key={link}
									src={`${process.env.PUBLIC_URL}/bannerPhotos/${link}`}
									alt="slideshow"
									className={styles.pictureSlides}
								/>
							)
						})}

					/>
				</div>
				<img
					className={styles.arrow}
					alt="arow"
					onClick={() => slideNext()}
					src={`${process.env.PUBLIC_URL}/icons/right.svg`}
				/>
			</div>
			<div className={styles.dotsHolder}>
				{(Array.from(Array(photos[orientation].length))).map((_, value) => {
					return (
						<div onClick={() => setActivePhoto(value)} key={value} className={`${styles.carouselDot} ${activePhoto === value ? styles.active : ""}`} />
					)
				})}
			</div>
		</>
	)
}

function Updates() {
	const [updates, setUpdates] = useState()
	const [loading, setLoading] = useState(true)
	const handleError = useErrorHandler()

	const getUpdates = async () => {
		try {
			const { data } = await axios.get("/data/news.json")
			setUpdates(data.news.slice(0, 3))
			setLoading(false)
		} catch (error) {
			console.log(error)
			handleError(error)
		}
	}

	useEffect(() => {
		getUpdates()
		// eslint-disable-next-line
	}, [])

	if (loading) {
		return (
			<>
				<Loading />
			</>
		)
	} else return (
		<>
			<h4 className={styles.homeSubTitle}>Recent Updates</h4>
			{updates.map((post, index) => {
				return (
					<div className={styles.homeUpdateContainer} key={index}>
						<Post
							date={post.date}
							title={post.title}
							index={index}
						>
							{post.content}
						</Post>
					</div>
				);
			})}
		</>
	)
}
