import React, { useRef, useEffect } from 'react';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    position: 'relative',
    margin: '1em',
    height: '4px',
    '& div': {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
    },
  },
  progress: {
    background: theme.palette.secondary.main,
    right: '100%',
  },
  background: {
    right: 0,
    background: fade(theme.palette.secondary.main, 0.2),
  },
}));

export default function ProgressBar({ position, duration }: { position: number; duration: number }) {
  const classes = useStyles();
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = progressBarRef.current;
    if (el) {
      setTimeout(() => {
        el.style.transition = `right ${duration}s linear`;
        el.style.right = `${String(100 - position)}%`;
      });
    }
  }, [duration, position]);

  return (
    <div className={classes.container}>
      <div className={classes.progress} ref={progressBarRef}></div>
      <div className={classes.background}></div>
    </div>
  );
}
