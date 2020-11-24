import React from 'react';
import clsx from 'clsx';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import { darken, lighten, makeStyles, Theme } from '@material-ui/core/styles';

type AlertProps = {
  children: React.ReactNode;
  variant: 'info' | 'error';
};

const useStyles = makeStyles((theme: Theme) => {
  const getBackgroundColor = theme.palette.type === 'light' ? lighten : darken;

  return {
    container: {
      display: 'flex',
      padding: '0.85em',
      borderRadius: theme.shape.borderRadius,
      '&:not(:last-child)': {
        marginBottom: '0.8em',
      },
      '& svg': {
        margin: '0 0.6em 0 0.3em',
        padding: '1px',
      },
    },
    contentContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    info: {
      backgroundColor: getBackgroundColor(theme.palette.info.main, 0.9),
      '& svg': {
        fill: theme.palette.info.main,
      },
    },
    error: {
      backgroundColor: getBackgroundColor(theme.palette.error.main, 0.9),
      '& svg': {
        fill: theme.palette.error.main,
      },
    },
  };
});

export default function Alert({ variant, children }: AlertProps) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.container, classes[variant])}>
      {variant === 'info' && <InfoIcon />}
      {variant === 'error' && <ErrorIcon />}
      <div className={classes.contentContainer}>{children}</div>
    </div>
  );
}
