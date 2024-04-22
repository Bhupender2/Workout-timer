import { memo, useCallback, useEffect, useState } from "react";
import clickSound from "./ClickSound.m4a";

const Calculator = memo(function Calculator({ workouts, allowSound }) {
  // memoize these two components so that they will not get render
  const [number, setNumber] = useState(workouts.at(0).numExercises);
  const [sets, setSets] = useState(3);
  const [speed, setSpeed] = useState(90);
  const [durationBreak, setDurationBreak] = useState(5);

  const [duration, setDuration] = useState(0); // we want to change the duration

  // const playSound =  useCallback(function () {
  //   if (!allowSound) return;
  //   const sound = new Audio(clickSound);
  //   sound.play();
  // },[allowSound])

  // const duration = (number * sets * speed) / 60 + (sets - 1) * durationBreak; // here its a derived state
  useEffect(() => {
    setDuration((number * sets * speed) / 60 + (sets - 1) * durationBreak);
    // playSound() old method
  }, [number, sets, speed, durationBreak]);

  const mins = Math.floor(duration);
  const seconds = (duration - mins) * 60;

  // use effect for synchronising sound with duration change this is the best method beacuse memoizing the sound function and writing playsound is not a good method and on clicking the mute button it will reset the duration which we change with - + button beacuse allow sound function changes and it will re run the useeffect and it will set the duration back to normal beacuse we didnt chnage the 4 state

  useEffect(() => {
    function playSound() {
      if (!allowSound) return;
      const sound = new Audio(clickSound);
      sound.play();
    }
    playSound();
  }, [allowSound, duration]); // on duration derived state variable change effect will run

  useEffect(
    function () {
      document.title = `Your ${number} exercises workout`;
    },
    [number]
  );
  // usE effect able to access the outside scope state variable even the parent component already rendered  only because of closure

  function handleDec() {
    setDuration((duration) => (duration > 1 ? Math.ceil(duration) - 1 : 0));
    // playSound() old method
  }
  function handleInc() {
    setDuration((duration) => Math.floor(duration) + 1);
    // playSound() old method
  }

  return (
    <>
      <form>
        <div>
          <label>Type of workout</label>
          <select value={number} onChange={(e) => setNumber(+e.target.value)}>
            {workouts.map((workout) => (
              <option value={workout.numExercises} key={workout.name}>
                {workout.name} ({workout.numExercises} exercises)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>How many sets?</label>
          <input
            type="range"
            min="1"
            max="5"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
          <span>{sets}</span>
        </div>
        <div>
          <label>How fast are you?</label>
          <input
            type="range"
            min="30"
            max="180"
            step="30"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          />
          <span>{speed} sec/exercise</span>
        </div>
        <div>
          <label>Break length</label>
          <input
            type="range"
            min="1"
            max="10"
            value={durationBreak}
            onChange={(e) => setDurationBreak(e.target.value)}
          />
          <span>{durationBreak} minutes/break</span>
        </div>
      </form>
      <section>
        <button onClick={handleDec}>–</button>
        <p>
          {mins < 10 && "0"}
          {mins}:{seconds < 10 && "0"}
          {seconds}
        </p>
        <button onClick={handleInc}>+</button>
      </section>
    </>
  );
});

export default Calculator;
