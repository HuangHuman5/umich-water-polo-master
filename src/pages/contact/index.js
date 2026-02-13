import { useState, useEffect } from "react"
import ImageIntro from '../../components/imageHeader'
import TextField from "@material-ui/core/TextField"
import useFormDataStore from "../../components/useFormDataStore"
import PhoneNumberInput from "../../components/phoneNumberInput"
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Typography from "@material-ui/core/Typography"
import FormHelperText from "@material-ui/core/FormHelperText"
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers"
import DateFnsUtils from "@date-io/date-fns"
import Input from "@material-ui/core/Input"
import Checkbox from "@material-ui/core/Checkbox"
import ListItemText from "@material-ui/core/ListItemText"
import Button from "@material-ui/core/Button"
import { Link } from "react-router-dom"
import { ErrorBoundary, useErrorHandler } from "react-error-boundary"
import ErrorFallback, { logger } from "../../components/error"
import styles from "./contact.module.css"


export default function ContactUs() {
	return (
		<div className={styles.contactBody} >
			<ImageIntro src={`${process.env.PUBLIC_URL}/bannerPhotos/shot.jpg`} />
			<ErrorBoundary FallbackComponent={ErrorFallback} onError={logger}>
				<Form />
			</ErrorBoundary>
		</div >
	)
}

const formTypes = ["Prospective Athlete", "Fundraising", "Potential Coach", "Alumni Visit", "Volunteering", "Sporting Event Tickets", "Tournament Hosting", "Other"]

const Form = () => {
	const { store, createHandler } = useFormDataStore()
	const [formType, setFormType] = useState({ value: "", fields: [] })
	const [shouldShowError, setShouldShowError] = useState(false)
	const [confirm, setConfirm] = useState(0)
	const handleError = useErrorHandler()

	const transform = key => {
		if (key === "gradDate") {
			let month = (store[key].value.getMonth() + 1) + ""
			return `${month.length === 1 ? "0" + month : month}/${store[key].value.getFullYear()}`
		} else if (key === "position") {
			return store[key].value.join(",")
		} else if (key === "phone") {
			return `+${store[key].value.code} ${store[key].value.number}`
		} else {
            return store[key].value || ""
        } 
	}

	const getFormLink = v => {
		if (v) {
			return "https://docs.google.com/forms/u/0/d/e/1FAIpQLSchr6uVy-1cGKMdueSmyfe7tMtd9PaPFkqIK5CSh6vdjWaphw/formResponse"
		} else {
			return "https://docs.google.com/forms/u/0/d/e/1FAIpQLScO_89MKr0Exb16QoM-zSoJa28MdF5G-LZBH7NvyrCNnhK0Bg/formResponse"
		}
	}
	const handleSubmit = async () => {
		if (formType.value === "") {
			setShouldShowError(true)
			return
		}

		try {
			let keys = formType.fields
			let submission = {}
			for (let i = 0; i < keys.length; i++) {
				if (!store[keys[i].value]?.isValid) {
					setShouldShowError(true)
					return
				}
				submission[keys[i].entry] = transform(keys[i].value)
			}
			setConfirm(1)
			await fetch(
				getFormLink(formType.value),
				{
					mode: 'no-cors',
					method: 'POST',
					body: new URLSearchParams(submission)
				})
			setConfirm(2)
		} catch (error) {
			console.log(error)
			setConfirm(3)
			handleError(error)
		}
	}

	return (
		<>
			{!confirm &&
				<ErrorBoundary FallbackComponent={ErrorFallback} onError={logger}>
					<form style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
						<div className={styles.formHolder}>
							<NameInput {...createHandler("name")} shouldShowError={shouldShowError} />
							<EmailInput {...createHandler("email")} shouldShowError={shouldShowError} />

							<PhoneInput {...createHandler("phone")} shouldShowError={shouldShowError} />
							<FormTypeSelector {...createHandler("primaryContactReason")} formType={formType} setFormType={setFormType} shouldShowError={shouldShowError} />
						</div>

						{
							formType.value === 0 && <>
								<Typography className={styles.athleteReqNote}>If you are interested in joining the team, please fill out the form below! We welcome <b>ALL</b> experience levels, so don't be discouraged if you have 0 years of experience or no water polo awards. The only requirment to join the team is the ability to swim 500 yards unassisted.</Typography>
								<AthleteForm createHandler={createHandler} shouldShowError={shouldShowError} />
							</>
						}
						{
							formType.value === 7 && <OtherContactReason {...createHandler("otherContactReason")} shouldShowError={shouldShowError} />
						}
						{
							!!formType.value && <Message {...createHandler("message")} shouldShowError={shouldShowError} />
						}
                       
						<Button style={{ marginTop: ".5rem" }} onClick={handleSubmit} variant="contained" color="primary">{shouldShowError ? "Retry Submission" : "Submit"}</Button>
                        {
                            shouldShowError && <Typography variant="caption" style = {{color:"red", maxWidth: "calc(100% - 2rem)", textAlign:"center", marginTop:"1rem"}}>Error detected. Please check each input for an error message.</Typography>
                        }
                    </form>
				</ErrorBoundary>
			}

			{!!confirm && <div style={{ display: "flex", alignItems: 'center', justifyContent: "center", flexDirection: "column", height: "100%" }}>
				<Typography style={{ marginTop: "1rem" }} variant="h5">{confirm === 1 ? "Submitting..." : confirm === 2 ? "Successfully Submitted" : "Submission Failed"}</Typography>
				{confirm !== 3 && <div style={{ margin: "1rem 0" }} className={`${styles.circleLoader} ${confirm === 2 ? styles.loadComplete : ""}`}>
					<div className={`${styles.checkmark} ${styles.draw}`} style={confirm === 2 ? undefined : { display: "none" }} />
				</div>}
				{
					confirm === 3 && <svg style={{ color: "red", margin: "1rem" }} xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" viewBox="0 0 16 16">
						<path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
						<path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
					</svg>
				}

				{confirm === 2 &&
					<Button variant="outlined" color="primary">
						<Link to="/">Return Home</Link>
					</Button>
				}
				{confirm === 3 &&
					<Button variant="outlined" color="primary" onClick={() => setConfirm(0)}>
						Try Again
					</Button>
				}
			</div>

			}
		</>
	)
}


const OtherContactReason = ({ saveValue, setIsValid, shouldShowError, storeValue }) => {
	const [state, setState] = useState(storeValue || "")

	const handleChange = e => {
		setState(e.target.value)
		saveValue(e.target.value)
		setIsValid(!!e.target.value)
	}
	const isError = shouldShowError && !state
	return <TextField style={{ margin: ".5rem 2rem", marginTop: "0", maxWidth: "calc(750px + 8rem)", width: "calc(100% - 2rem)" }} value={state} onChange={handleChange} label="*Reason for Contacting" placeholder="Subject of message" helperText={isError ? "Reason for contacting is required" : " "} error={isError} />
}

const Message = ({ saveValue, setIsValid, shouldShowError, storeValue }) => {
	const [state, setState] = useState(storeValue || "")

	const handleChange = e => {
		setState(e.target.value)
		saveValue(e.target.value)
		setIsValid(!!e.target.value)
	}
	const isError = shouldShowError && !state
	return <TextField multiline style={{ margin: ".5rem 2rem", maxWidth: "calc(750px + 8rem)", width: "calc(100% - 2rem)" }} value={state} onChange={handleChange} label="*Message" placeholder="Message content" helperText={isError ? "Message is required" : " "} error={isError} />
}

const NameInput = ({ saveValue, setIsValid, shouldShowError, storeValue }) => {
	const [state, setState] = useState(storeValue || "")

	const handleChange = e => {
		setState(e.target.value)
		saveValue(e.target.value)
		setIsValid(!!e.target.value)
	}
	const isError = shouldShowError && !state
	return <TextField style={{ margin: "1rem 2rem", width: "250px" }} value={state} onChange={handleChange} label="*Full Name" name="name" autoComplete="on" placeholder="John Doe" helperText={isError ? "Name is required" : " "} error={isError} />
}

const EmailInput = ({ saveValue, setIsValid, shouldShowError, storeValue }) => {
	const [state, setState] = useState(storeValue || "")
	const getError = v => {
		if (!v) {
			return "Email is required"
		}
		if (!(/\S+@\S+\.\S+/.test(v))) {
			return "Email is invalid"
		}
		return null
	}
	const handleChange = e => {
		setState(e.target.value)
		saveValue(e.target.value)
		setIsValid(!getError(e.target.value))
	}
	const errorText = !shouldShowError ? null : getError(state)
	return <TextField style={{ margin: "1rem 2rem", width: "250px" }} value={state} onChange={handleChange} label="*Email" name="email" autoComplete="on" placeholder="john.doe@gmail.com" helperText={errorText || " "} error={shouldShowError && !!errorText} />
}

const PhoneInput = ({ saveValue, setIsValid, shouldShowError, storeValue }) => {
	const [state, setState] = useState(storeValue || { code: "", number: "", format: "", iso2: "us" })
	const getError = v => {
		if (!v.number) {
			return "Phone is required"
		}

		if (v.format && `+${v.code} ${v.number}`.replace(/\d/g, ".") !== v.format) {
			return "Phone is invalid"
		}
		return null
	}
	const handleChange = e => {
		setState(e)
		saveValue(e)
		setIsValid(!getError(e))
	}
	const errorText = !shouldShowError ? null : getError(state)
	return <PhoneNumberInput style={{ margin: "1rem 2rem", width: "250px" }} value={state.number} disableCountryCode onChange={handleChange} label="*Phone Number" name="phone" autoComplete="on" iso2={state.iso2} defaultCountry='us' disableAreaCodes helperText={errorText || " "} error={shouldShowError && !!errorText} />
}

const FormTypeSelector = ({ formType, setFormType, shouldShowError, saveValue, setIsValid }) => {
	const getFormFields = value => {
		if (value === 0) {
			return [{ value: 'name', entry: "entry.824923744" }, { value: 'email', entry: "entry.1946615411" }, { value: 'phone', entry: "entry.1048864697" }, { value: 'hometownCity', entry: "entry.1429166208" }, { value: 'hometownState', entry: "entry.722722302" }, { value: 'gradDate', entry: "entry.1743803299" }, { value: 'degree', entry: "entry.68182095" }, { value: 'freeTime', entry: "entry.2035085070" }, { value: 'experience', entry: "entry.74751114" }, { value: 'dominantHand', entry: "entry.1054216554" }, { value: 'position', entry: "entry.470668351" }, { value: 'pastTeams', entry: "entry.1726469196" }, {value: 'awards', entry: 'entry.277926910'}, { value: 'additionalInfo', entry: "entry.1567373700" }]
		} else {
			let base = [{ value: 'name', entry: "entry.238190827" }, { value: 'email', entry: "entry.913578307" }, { value: 'phone', entry: "entry.1832837971" }]
			if (value === 7) {
				return base.concat([{ value: 'otherContactReason', entry: "entry.188853843" }, { value: 'message', entry: "entry.2055079195" }])
			} else {
				return base.concat([{ value: 'primaryContactReason', entry: "entry.188853843" }, { value: 'message', entry: "entry.2055079195" }])
			}
		}
	}
	const handleChange = e => {
		setIsValid(true)
		setFormType({ value: e.target.value, fields: getFormFields(e.target.value) })
		saveValue(formTypes[e.target.value])
	}
	return (
		<FormControl error={shouldShowError && formType.value === ""} style={{ margin: "1rem 2rem", width: "250px" }}>
			<InputLabel id="reason-label">*Reason for Contact</InputLabel>
			<Select
				labelId="reason-label"
				value={formType.value}
				onChange={handleChange}
			>
				{formTypes.map((item, index) => {
					return (
						<MenuItem key={index} value={index}>{item}</MenuItem>
					)
				})
				}
			</Select>
			{(shouldShowError && formType.value === "") ? <FormHelperText>Reason is required</FormHelperText> : <FormHelperText> </FormHelperText>}
		</FormControl>
	)
}

const HometownCityInput = ({ saveValue, setIsValid, storeValue }) => {
	const [state, setState] = useState(storeValue || "")

	useEffect(() => {
		setIsValid(true)
		// eslint-disable-next-line
	}, [])

	const handleChange = e => {
		setState(e.target.value)
		saveValue(e.target.value)
	}
	return <TextField style={{ margin: "1rem 2rem", width: "200px" }} value={state} onChange={handleChange} label="Home Town City" name="city" autoComplete="on" placeholder="Chicago" />
}

const HometownStateInput = ({ saveValue, setIsValid, storeValue }) => {
	const [state, setState] = useState(storeValue || "")

	useEffect(() => {
		setIsValid(true)
		// eslint-disable-next-line
	}, [])

	const handleChange = e => {
		setState(e.target.value)
		saveValue(e.target.value)
	}
	return <TextField style={{ margin: "1rem 2rem", width: "200px" }} value={state} onChange={handleChange} label="Home Town State" name="state" autoComplete="on" placeholder="Illinois" />
}

const GradDateInput = ({ saveValue, setIsValid, shouldShowError, storeValue }) => {
	const [state, setState] = useState(storeValue || null)
	const get10Years = () => {
		let current = new Date()
		return current.setFullYear(current.getFullYear() + 10)
	}
	const handleChange = e => {
		setState(e)
		saveValue(e)
		setIsValid(true)
	}
	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<DatePicker
				error={shouldShowError && !state}
				helperText={shouldShowError && !state ? "Expected date is required" : " "}
				maxDate={get10Years()}
				minDate={new Date()}
				style={{ margin: "1rem 2rem", width: "200px" }}
				variant="inline"
				openTo="year"
				views={["year", "month"]}
				label="*Expected Graduation Date"
				placeholder={`May ${new Date().getFullYear() + 4}`}
				value={state}
				onChange={handleChange}
			/>
		</MuiPickersUtilsProvider>
	)
}

const DegreeInput = ({ saveValue, setIsValid, shouldShowError, storeValue }) => {
	const [state, setState] = useState(storeValue || "")

	const handleChange = e => {
		setState(e.target.value)
		saveValue(e.target.value)
		setIsValid(!!e.target.value)
	}
	const isError = shouldShowError && !state
	return <TextField style={{ margin: "1rem 2rem", width: "200px" }} value={state} onChange={handleChange} label="*Expected Degree" placeholder="BA in Economics" helperText={isError ? "Expected Degree is required" : " "} error={isError} />
}

const FreeTime = ({ saveValue, setIsValid, shouldShowError, storeValue }) => {
	const [state, setState] = useState(storeValue || "")

	const handleChange = e => {
		setState(e.target.value)
		saveValue(e.target.value)
		setIsValid(!!e.target.value)
	}
	const isError = shouldShowError && !state
	return <TextField style={{ margin: "1rem 2rem", width: "200px" }} value={state} onChange={handleChange} label="*100 Yard Free Time" placeholder="51.42" helperText={isError ? "100 Freestyle Time is required" : " "} error={isError} />
}

const DominantHand = ({ saveValue, setIsValid, shouldShowError, storeValue }) => {
	const [state, setState] = useState(storeValue || "")

	const handleChange = e => {
		setState(e.target.value)
		saveValue(e.target.value)
		setIsValid(true)
	}
	return (
		<FormControl error={shouldShowError && !state} style={{ margin: "1rem 2rem", width: "200px" }}>
			<InputLabel id="dominant-label">*Dominant Hand</InputLabel>
			<Select
				labelId="dominant-label"
				value={state}
				onChange={handleChange}
			>
				<MenuItem value="right">Right</MenuItem>
				<MenuItem value="left">Left</MenuItem>
				<MenuItem value="ambidextrous">Ambidextrous</MenuItem>
			</Select>
			{(shouldShowError && !state) ? <FormHelperText>Dominant Hand is required</FormHelperText> : <FormHelperText> </FormHelperText>}
		</FormControl>
	)
}

const YearsOfExperience = ({ saveValue, setIsValid, shouldShowError, storeValue }) => {
	const [state, setState] = useState(storeValue || "")

	const handleChange = e => {
		setState(e.target.value)
		saveValue(e.target.value)
		setIsValid(!!e.target.value)
	}
	const isError = shouldShowError && !state
	return <TextField style={{ margin: "1rem 2rem", width: "200px" }} value={state} onChange={handleChange} label="*Years of Experience" placeholder="2" helperText={isError ? "Years of experience is required" : " "} error={isError} />
}
const Positions = ({ saveValue, setIsValid, shouldShowError, storeValue }) => {
	const [state, setState] = useState(storeValue || [])

	const handleChange = e => {
		let values = e.target.value
		if (values.indexOf("Unsure") > -1) {
			values = ["Unsure"]
		}
		setState(values)
		saveValue(values)
		setIsValid(!!values.length)
	}
	const positions = ["2M", "2MD", "UT", "AK", "GK", "Unsure"]
	const shouldDisable = state.length === 1 && state[0] === "Unsure"
	return (
		<FormControl error={shouldShowError && !state.length} style={{ margin: "1rem 2rem", width: "200px" }}>
			<InputLabel id="position-label">*Position</InputLabel>
			<Select
				labelId="position-label"
				placeholder="2MD, GK"
				multiple
				value={state}
				onChange={handleChange}
				input={<Input />}
				renderValue={(selected) => selected.join(', ')}
			>
				{positions.map((name, index) => (
					<MenuItem disabled={shouldDisable && name !== "Unsure"} key={index} value={name}>
						<Checkbox checked={state.indexOf(name) > -1} />
						<ListItemText primary={name} />
					</MenuItem>
				))}
			</Select>
			{(shouldShowError && !state.length) ? <FormHelperText>Position is required</FormHelperText> : <FormHelperText> </FormHelperText>}
		</FormControl>
	)
}
const PastTeams = ({ saveValue, setIsValid, storeValue }) => {
	const [state, setState] = useState(storeValue || "")

	useEffect(() => {
		setIsValid(true)
		// eslint-disable-next-line
	}, [])

	const handleChange = e => {
		setState(e.target.value)
		saveValue(e.target.value)
	}
	return <TextField multiline style={{ margin: "1rem 2rem", maxWidth: "calc(400px + 4rem)", width: "calc(100% - 4rem)" }} value={state} onChange={handleChange} label="Teams You've Played For" placeholder="Pioneer High School" />
}

const Awards = ({ saveValue, setIsValid, storeValue }) => {
	const [state, setState] = useState(storeValue || "")

	useEffect(() => {
		setIsValid(true)
		// eslint-disable-next-line
	}, [])

	const handleChange = e => {
		setState(e.target.value)
		saveValue(e.target.value)
	}
	return <TextField multiline style={{ margin: "1rem 2rem", maxWidth: "calc(400px + 4rem)", width: "calc(100% - 4rem)" }} value={state} onChange={handleChange} label="Water Polo Awards" placeholder="Michigan First Team All-State" />
}

const AdditionalInfo = ({ saveValue, setIsValid, storeValue }) => {
	const [state, setState] = useState(storeValue || "")

	useEffect(() => {
		setIsValid(true)
		// eslint-disable-next-line
	}, [])

	const handleChange = e => {
		setState(e.target.value)
		saveValue(e.target.value)
	}
	return <TextField multiline style={{ margin: "1rem 2rem", maxWidth: "calc(400px + 4rem)", width: "calc(100% - 4rem)" }} value={state} onChange={handleChange} label="Additional Info" placeholder="Optional space to provide more details and ask questions" />
}

const AthleteForm = ({ createHandler, shouldShowError }) => {
	return (
		<div className={`${styles.formHolder} ${styles.athlete}`}>
			<HometownCityInput {...createHandler("hometownCity")} />
			<HometownStateInput {...createHandler("hometownState")} />
			<GradDateInput {...createHandler("gradDate")} shouldShowError={shouldShowError} />
			<DegreeInput {...createHandler("degree")} shouldShowError={shouldShowError} />
			<FreeTime {...createHandler("freeTime")} shouldShowError={shouldShowError} />
			<YearsOfExperience {...createHandler("experience")} shouldShowError={shouldShowError} />
			<DominantHand {...createHandler("dominantHand")} shouldShowError={shouldShowError} />
			<Positions {...createHandler("position")} shouldShowError={shouldShowError} />
			<PastTeams {...createHandler("pastTeams")} />
            <Awards {...createHandler("awards")} />
			<AdditionalInfo {...createHandler("additionalInfo")} />
		</div>
	)
}

