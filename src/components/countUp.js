import { useState } from "react";
import VisibilitySensor from 'react-visibility-sensor';
import { CountUp as CountUpInternal } from 'use-count-up'

export default function CountUp({ to, from, duration, updateKey }) {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <VisibilitySensor onChange={elemIsVisible => setIsVisible(elemIsVisible || isVisible)} active={!isVisible}>
            <span>
                <CountUpInternal start={from} isCounting={isVisible} end={to} duration={duration} autoResetKey={updateKey} />
            </span>
        </VisibilitySensor>
    )
}