import React, { useCallback, useEffect, useState } from 'react';
import { useInterval } from '../hooks/use-interval';
import { Button } from './button';
import { Timer } from './timer';

import bellStart from '../sounds/src_sounds_bell-start.mp3';
import bellFinish from '../sounds/src_sounds_bell-finish.mp3';
import { secondsToMinutes } from '../utils/seconds-to-minutes';

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props) {
  const [mainTime, setMaintTme] = useState(props.pomodoroTime);
  const [timeCounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesQtdManager, setCyclesQtdManager] = useState(
    new Array(props.cycles - 1).fill(true)
  );

  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setFullWorkingTime] = useState(0);
  const [numberOfPomodoros, setnumberOfPomodoros] = useState(0);

  useInterval(
    () => {
      setMaintTme(mainTime - 1);
      if (working) setFullWorkingTime(fullWorkingTime + 1);
    },
    timeCounting ? 1000 : null
  );

  useCallback;

  const configWorking = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMaintTme(props.pomodoroTime);
    audioStartWorking.play();
  }, [
    setTimeCounting,
    setWorking,
    setResting,
    setMaintTme,
    props.pomodoroTime,
  ]);
  const configRest = useCallback(
    (long: boolean) => {
      setTimeCounting(true);
      setWorking(false);
      setResting(true);

      if (long) {
        setMaintTme(props.longRestTime);
      } else {
        setMaintTme(props.shortRestTime);
      }

      audioStopWorking.play();
    },
    [
      setTimeCounting,
      setWorking,
      setResting,
      setMaintTme,
      props.longRestTime,
      props.shortRestTime,
    ]
  );

  const verifyStepPomodoro = () => {
    if (working && cyclesQtdManager.length > 0) {
      configRest(false);
      cyclesQtdManager.pop();
    } else if (working && cyclesQtdManager.length <= 0) {
      configRest(true);
      setCyclesQtdManager(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }
  };

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');

    if (mainTime > 0) return;
    verifyStepPomodoro();
    if (working) setnumberOfPomodoros(numberOfPomodoros + 1);
    if (resting) configWorking();
  }, [
    working,
    resting,
    mainTime,
    configRest,
    setCyclesQtdManager,
    configWorking,
    cyclesQtdManager,
    numberOfPomodoros,
    props.cycles,
    completedCycles,
  ]);

  return (
    <div className='pomodoro'>
      <h2>Você está: {working ? 'Trabalhando' : 'Descansando'}</h2>
      <Timer mainTime={mainTime} />
      <div className='controls'>
        <Button text='Work' onClick={configWorking}></Button>
        <Button text='Rest' onClick={() => configRest(false)}></Button>
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timeCounting ? 'Pause' : 'Play'}
          onClick={() => setTimeCounting(!timeCounting)}
        ></Button>
      </div>

      <div className='details'>
        <p>Ciclos concluidos: {completedCycles}</p>
        <p>Horas trabalhadas: {secondsToMinutes(fullWorkingTime)}</p>
        <p>Numero de Pomodoros concluidos: {numberOfPomodoros}</p>
      </div>
    </div>
  );
}
