import React, { useEffect } from 'react';
import { useState } from 'react';
import { styled } from 'styled-components';
import useInterval from '../hooks/useInterval';
import { recordTimer } from '../axios/api/chat'
import { useMutation } from 'react-query';

function Stopwatch(props) {

    const [isStarted, setIsStarted] = useState(true)

    const [seconds, setSeconds] = useState(0)
    const [mins, setMins] = useState(0)
    const [hours, setHours] = useState(0)

    const [prevSendS, setPrevSendS] = useState(0)
    const [prevSendM, setPrevSendM] = useState(0)
    const [prevSendH, setPrevSendH] = useState(0)

    const [sendSeconds, setSendSeconds] = useState(0)
    const [sendMins, setSendMins] = useState(0)
    const [sendHours, setSendHours] = useState(0)

    const recordTimerMutation = useMutation(recordTimer, {
        onSuccess: (response) => {
            console.log("시간기록", response)
        }
    })
    
    // 타이머 버튼 클릭
    const startStopWatch = () => {
        const satting = () => {
            if (isStarted) {
                console.log("타이머 일시정지")
                setIsStarted(false)
                // 전송할 값
                setSendSeconds((prevSendSeconds) => {
                    setPrevSendS(prevSendSeconds)
                    return seconds
                })
                setSendMins((prevSendMins) => {
                    setPrevSendM(prevSendMins)
                    return mins
                })
                setSendHours((prevSendHours) => {
                    setPrevSendH(prevSendHours)
                    return hours
                })
            } else {
                console.log("타이머 재시작")
                setIsStarted(true)
            }
        }
        satting()
    }

    // 값 변경 될때마다 간격 계산 -> 서버 통신
    useEffect(() => {
        if (!isStarted) {
            const settingPrevTimeString = () => {
                // 직전에 보낸 샌드값
                let ss = prevSendS
                let mm = prevSendM
                let hh = prevSendH
                if (prevSendS > 9) {
                    ss = prevSendS
                } else {
                    ss = '0' + prevSendS
                }
                if (prevSendS > 9) {
                    mm = prevSendM
                } else {
                    mm = '0' + prevSendM
                }
                if (prevSendS > 9) {
                    hh = prevSendH
                } else {
                    hh = '0' + prevSendH
                }
                return hh + ":" + mm + ":" + ss
            }
            console.log("직전에 보낸 샌드값", settingPrevTimeString())

            const settingTimeString = () => {
                // 현재 샌드값
                let ss = sendSeconds
                let mm = sendMins
                let hh = sendHours
                if (sendSeconds > 9) {
                    ss = sendSeconds
                } else {
                    ss = '0' + sendSeconds
                }
                if (sendMins > 9) {
                    mm = sendMins
                } else {
                    mm = '0' + sendMins
                }
                if (sendHours > 9) {
                    hh = sendHours
                } else {
                    hh = '0' + sendHours
                }
                return hh + ":" + mm + ":" + ss
            }
            console.log("지금 보낸 샌드값", settingTimeString())


            const calculateTimeDiff = (prevTime, currentTime) => {
                const prevDate = new Date(`1970-01-01T${prevTime}`);
                const currentDate = new Date(`1970-01-01T${currentTime}`);

                const prevTimestamp = prevDate.getTime();
                const currentTimestamp = currentDate.getTime();

                const timeDiff = currentTimestamp - prevTimestamp;

                // 타임스탬프 차이를 이용하여 시, 분, 초 계산
                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                const mins = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

                // 시간을 포맷팅하여 반환
                return `${hours > 9 ? hours : '0' + hours}:${mins > 9 ? mins : '0' + mins}:${seconds > 9 ? seconds : '0' + seconds}`
            }

            // axios 호출
            recordTimerMutation.mutate(calculateTimeDiff(settingPrevTimeString(), settingTimeString()))
            console.log("간격, ", calculateTimeDiff(settingPrevTimeString(), settingTimeString()))
        }
    }, [sendSeconds])

    // 타이머
    useInterval(() => {
        if (isStarted) {
            setSeconds(seconds + 1)
            if (seconds === 59) {
                setSeconds(0)
                setMins(mins + 1)
            }
            if (mins === 59) {
                setMins(0)
                setHours(hours + 1)
            }
        }
    }, 1000)

    return (
        <TimerWrap>
            <Timer><p>{hours > 9 ? hours : '0' + hours}:{mins > 9 ? mins : '0' + mins}:{seconds > 9 ? seconds : '0' + seconds}</p></Timer>
            <TimerButton isStarted={isStarted} onClick={() => { startStopWatch(isStarted) }}>
                {isStarted ? '' : ''}
            </TimerButton>
        </TimerWrap>
    );
}
export const TimerWrap = styled.div`
    display: flex;
    justify-content: space-between;
    width: 150px;
    height: 39px;
`
export const Timer = styled.div`
    height: 39px;
    display: flex;
    align-items: center;
    p {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 29px;
    vertical-align: middle;
    color: #00F0FF;
    }
`
export const TimerButton = styled.div`
    width:37px;
    height:37px;
    background-color: transparent;
    background-image: ${(props) => 
        props.isStarted?`url(${process.env.PUBLIC_URL}/image/timerOff.webp)`:`url(${process.env.PUBLIC_URL}/image/timerOn.webp)`
    };
    border-radius: 50%;
    &:hover {
    background-color: rgba(187,187,187,255);
    }
`

export default Stopwatch;