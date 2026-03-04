import { useEffect, useState, useRef } from 'react'
import Confetti from 'react-confetti'
import Die from './components/Die'
import Board from './components/Board'
import { nanoid } from 'nanoid'

const randomValue = () => Math.floor(6 * Math.random()) + 1

export default function App() {

  const buttonRef = useRef(null);

  const [results, setResults] = useState(JSON.parse(localStorage.getItem("bestTime")) || []);

  const [numbers, setNumbers] = useState(() => generateAllNewDice());

  const gameWon = numbers.every(el => el.isHeld) && numbers.every(el => el.value === numbers[0].value);

  const [isGaming, setIsGaming] = useState(false);

  const [time, setTime] = useState(0);

  useEffect(() => {
      localStorage.setItem("bestTime", JSON.stringify(results));
  }, [results])

  useEffect(() => {
    if (gameWon) {
      setIsGaming(false);
      setResults(prev => [...prev, time]);
      buttonRef.current.focus(); 
    }
  }, [gameWon])

  useEffect(() => {
    let timerId;
    if (isGaming) {
      timerId = setInterval(() => {
        setTime(prev => prev + 10);
      }, 10)
    }

    return () => {
      clearInterval(timerId);
    }

  }, [isGaming])

  function formatTime(time) {
   const seconds = Math.floor(time / 1000);
   const miliseconds = Math.floor((time % 1000) / 10)  
   return `${seconds.toString().padStart(2, "0")}:${miliseconds.toString().padStart(2, "0")}`
  }
  
  function hold(id) {
    setNumbers(prev => {
      return prev.map(elem =>
        elem.id === id ? { ...elem, isHeld: !elem.isHeld } : elem
      )
    })
    setIsGaming(true);
  }

  function generateAllNewDice() {
    const nums = [];
    for (let i = 0; i < 10; i++) {
      let obj = {
        value: randomValue(),
        isHeld: false,
        id: nanoid()
      }
      nums.push(obj)
    }
    return nums;
  }

  function roll() {
    if (gameWon) {
      setNumbers(generateAllNewDice());
      setTime(0);
    }

    setNumbers(prev =>
      prev.map(elem =>
        !elem.isHeld ? { ...elem, value: randomValue() } : elem
      )
    )
    setIsGaming(true);
  }

  return (
    <>
    {gameWon && <Confetti />}

    <Board results = {results} 
        formatTime={formatTime}  
    />

    <main className='game'>
      <div className='description'>Бросайте кубики, кнопкой "Roll". Цель игры - все кубики должны быть одинаковые. Чтобы зафиксировать кубик между бросками, нажмите на него. Постарайтесь показать лучшее время!</div>

      <div className="time">Время: {formatTime(time)}</div>
      
      <div className='dice'>
        {
          numbers.map((el) =>
            <Die key={el.id} value={el.value} isHeld={el.isHeld} holdFunction={() => hold(el.id)} />)
        }
      </div>
      <button className='roll' onClick={roll} ref = {buttonRef}>
        {!gameWon ? 'Roll' : 'New Game'}
      </button>
    </main>
  </>
  )
}

