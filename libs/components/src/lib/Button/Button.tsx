import { ClassAttributes, HTMLAttributes } from 'react';
import styles from './button.module.scss';

type HTMLProps<T> = ClassAttributes<T> & HTMLAttributes<T>;

export interface ButtonProps extends HTMLProps<HTMLButtonElement> {
  children: React.ReactNode | JSX.Element | JSX.Element[];
}

export function Button(props: ButtonProps) {
  const { children, ...rest } = props;
  return (
    <div className={styles['container']}>
      <button className={styles['button']}{...rest}>{props.children}</button>
    </div>
  );
}
