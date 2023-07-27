import { ClassAttributes, HTMLAttributes } from 'react';
import styles from './flex-layouts.module.scss';

type HTMLProps<T> = ClassAttributes<T> & HTMLAttributes<T>;

export interface FlexContainerProps extends HTMLProps<HTMLDivElement> {
  direction: "horizontal" | "vertical";
  children: React.ReactNode | JSX.Element | JSX.Element[];
}

export function FlexContainer(props: FlexContainerProps) {
  const { children, direction, ...rest } = props;

  const classStyle = direction === "horizontal" ? styles['horizontal-flex'] : styles['vertical-flex'];

  return (
    <div className={classStyle} {...rest}>{children}</div>
  );
}
