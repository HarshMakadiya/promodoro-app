import React, { useState, useEffect } from "react";
import user from "../../handler/User";

function PomodoroTimer({ isLoggedIn }) {
  const defaultWorkTime = 25 * 60;
  const defaultBreakTime = 5 * 60;
  const [workTime, setWorkTime] = useState(defaultWorkTime);
  const [breakTime, setBreakTime] = useState(defaultBreakTime);
  const [isWorking, setIsWorking] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("worktime"))
      setWorkTime(localStorage.getItem("worktime"));

    if (localStorage.getItem("breaktime"))
      setBreakTime(localStorage.getItem("breaktime"));
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setWorkTime(defaultWorkTime);
      setBreakTime(defaultBreakTime);
    } else {
      setWorkTime(localStorage.getItem("worktime"));
      setBreakTime(localStorage.getItem("breaktime"));
    }
  }, [isLoggedIn]);
  // Timer logic
  useEffect(() => {
    let interval;

    if (isRunning && isWorking) {
      interval = setInterval(() => {
        if (workTime > 0) {
          setWorkTime(workTime - 1);
          localStorage.setItem("worktime", workTime - 1);
        } else {
          setWorkTime(1500);
          localStorage.setItem("worktime", 1500);
          user.updateTimer(1500, breakTime);
          // Switch to break timer when work timer completes
          setIsWorking(false);
        }
      }, 1000);
    } else if (isRunning && !isWorking) {
      interval = setInterval(() => {
        if (breakTime > 0) {
          setBreakTime(breakTime - 1);
          localStorage.setItem("breaktime", breakTime - 1);
        } else {
          setBreakTime(300);
          localStorage.setItem("breaktime", 300);
          user.updateTimer(workTime, 300);
          // Switch to work timer when break timer completes
          setIsWorking(true);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isWorking, workTime, breakTime]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  const handleReset = () => {
    setIsRunning(false);
    setIsWorking(true);
    setWorkTime(defaultWorkTime);
    setBreakTime(defaultBreakTime);
    localStorage.setItem("worktime", defaultWorkTime);
    localStorage.setItem("breaktime", defaultBreakTime);
  };
  return (
    <div className="bg-gray-100 h-full">
      {!isLoggedIn ? (
        <div className="flex justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-md w-80 text-center">
            <h2 className="text-2xl font-semibold mb-4">Please Log In</h2>
            <p className="text-gray-600">
              You need to log in to access this page.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className=" bg-white shadow-md rounded-lg p-6 m-auto mt-10">
            <h2 className="text-2xl font-semibold mb-4">
              {isWorking ? "Work Timer" : "Break Timer"}
            </h2>
            <div className="text-9xl font-weight-400 text-center text-blue-500 mb-4">
              {formatTime(isWorking ? workTime : breakTime)}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                className={
                  isRunning
                    ? "bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
                    : "bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
                }
                onClick={() => {
                  setIsRunning(!isRunning);
                }}
              >
                {isRunning ? "Pause" : "Start"}
              </button>

              <button
                className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
                onClick={handleReset}
              >
                Reset
              </button>

              <button
                className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
                onClick={() => setIsWorking(!isWorking)}
              >
                Toggle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PomodoroTimer;
