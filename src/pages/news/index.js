
import { useState, useEffect } from 'react'
import axios from "axios"
import ImageIntro from '../../components/imageHeader'
import Loading from '../../components/loading'
import Post from "../../components/post"
import { ErrorBoundary, useErrorHandler } from "react-error-boundary"
import ErrorFallback, { logger } from "../../components/error"
import styles from "./news.module.css"

export default function News() {
	return (
		<div className={styles.newsBody}>
			<ImageIntro src={`${process.env.PUBLIC_URL}/bannerPhotos/cam.jpg`} />
			<ErrorBoundary FallbackComponent={ErrorFallback} onError={logger}>
				<NewsInternals />
			</ErrorBoundary>
		</div>
	)
}

const NewsInternals = () => {
	const [news, setNews] = useState()
	const [loading, setLoading] = useState(true)
	const handleError = useErrorHandler()

	const getNews = async () => {
		try {
			const { data } = await axios.get("/data/news.json")
			setNews(data.news)
			setLoading(false)
		} catch (error) {
			console.log(error)
			handleError(error)
		}
	}

	useEffect(() => {
		getNews()
		// eslint-disable-next-line
	}, [])

	if (loading) {
		return <Loading />
	} else return (
		news.map((post, index) => {
			return (
				<div key={index} className={styles.newsPostContainer}>
					<ErrorBoundary fallback={<div>Error</div>} onError={logger}>
						<Post date={post.date} title={post.title}>
							{post.content}
						</Post>
					</ErrorBoundary>
				</div>
			)
		}))
}