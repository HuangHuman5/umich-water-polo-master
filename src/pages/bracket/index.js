import React, { useEffect, useState } from "react";
import Loading from "../../components/loading";
import axios from "axios";
import { useIsMobile } from "../../components/header";
import {
    Bracket
} from "react-tournament-bracket";
import styles from './bracket.module.css';

const TourneyBracket = () => {
    const [loading, setLoading] = useState(true);
    const [bracketData, setBracketData] = useState({});
    const isMobile = useIsMobile();

    useEffect(() => {
        const getData = async () => {
            const { data } = await axios.get('/data/bracket.json');
            setBracketData(data);
            setLoading(false)
        }
        getData();
    }, [])
    if (loading) return <Loading />
    
    return (
        <>
            <h1 className={styles.header}>2022 Big Ten Championship Bracket</h1>
            <h3 className={styles.subheader}>All games played at Canham Natatorium</h3>
            <h3 className={styles.subheader}>
                <a 
                    href="https://www.google.com/maps/dir//Canham+Natatorium,+East+Hoover+Avenue,+Ann+Arbor,+MI/@42.2692971,-83.7789467,13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x883cae36eff83e1f:0xc63b105740253336!2m2!1d-83.7438415!2d42.2693025"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    500 E Hoover Ave, Ann Arbor, MI 48104
                </a>
            </h3>
            <div className={
                isMobile ? styles.bracketContainerMobile
                    : styles.bracketContainer
            }>
                <Bracket game={bracketData} />
            </div>
        </>
    )

}
export default TourneyBracket;