import React, { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web'
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectCount,
} from './counterSlice';
import styles from './Counter.module.css';
import {Menu} from "../../menu/Menu";
import { useNavigate } from 'react-router-dom';

export const Counter: React.FC = () => {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  const incrementValue = Number(incrementAmount) || 0;
  const { initialized } = useKeycloak()

  if (!initialized) {
    return <div>Loading...</div>
  }

  return (
      <div>
        <Menu />

        <div className={styles.row}>
          <button
              className={styles.button}
              aria-label="Decrement value"
              onClick={() => dispatch(decrement())}
          >
            -
          </button>
          <span className={styles.value}>{count}</span>
          <button
              className={styles.button}
              aria-label="Increment value"
              onClick={() => dispatch(increment())}
          >
            +
          </button>
        </div>
        <div className={styles.row}>
          <input
              className={styles.textbox}
              aria-label="Set increment amount"
              value={incrementAmount}
              onChange={(e) => setIncrementAmount(e.target.value)}
          />
          <button
              className={styles.button}
              onClick={() => dispatch(incrementByAmount(incrementValue))}
          >
            Add Amount
          </button>
          <button
              className={styles.asyncButton}
              onClick={() => dispatch(incrementAsync(incrementValue))}
          >
            Add Async
          </button>
          <button
              className={styles.button}
              onClick={() => dispatch(incrementIfOdd(incrementValue))}
          >
            Add If Odd
          </button>
        </div>
      </div>
  );
}
