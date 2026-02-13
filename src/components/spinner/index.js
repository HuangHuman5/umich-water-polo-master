import styles from './spinner.module.css';

const defaultProps = {
    color: '#38ad48',
    size: 50,
    style: {},
};


const normalizeSize = (size) => (
    parseFloat(size.toString()).toString() === size.toString()
        ? `${size}px`
        : size.toString()
);


const withSharedProps = (Component) => {
    const Wrapper = (props) => {
        const {
            color, size, style, ...otherProps
        } = props;
        const componentProps = {
            ...otherProps,
            style: {
                color,
                overflow: 'visible',
                width: normalizeSize(size),
                ...style,
            },
        };

        return <Component {...componentProps} />;
    };

    Wrapper.defaultProps = defaultProps;

    return Wrapper;
};


const SecondaryColorSpinnerProps = {
    ...defaultProps,
    secondaryColor: 'rgba(0,0,0,0.44)'
};

const Component = ({
    secondaryColor,
    speed,
    still,
    thickness,
    ...svgProps
}) => {
    const strokeWidth = 4 * (thickness / 100);
    return (
        <svg fill="none" {...svgProps} viewBox="0 0 66 66">
            <defs>
                <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#05a" />
                    <stop offset="100%" stopColor="#0a5" />
                </linearGradient>
            </defs>
            <circle
                cx="33"
                cy="33"
                fill="none"
                r="28"
                stroke="transparent"
                strokeWidth={strokeWidth}
            />
            <circle
                cx="33"
                cy="33"
                fill="none"
                r="28"
                stroke="url(#linear)"
                strokeDasharray="1, 174"
                strokeDashoffset="306"
                strokeLinecap="round"
                strokeWidth={strokeWidth}
                className={styles.spinner}
                style={{animationTimingFunction:"linear", animationIterationCount:"infinite", animationDuration: `${140 / speed}s`}}
            />
        </svg>
    );
};

Component.defaultProps = SecondaryColorSpinnerProps;

export default withSharedProps(Component);