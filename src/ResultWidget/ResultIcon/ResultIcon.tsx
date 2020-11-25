import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import WarningIcon from '@material-ui/icons/ReportProblemOutlined';
import { TestResults } from '../../types';
import { rows } from '../rows';

const useStyles = makeStyles((theme: Theme) => ({
  close: {
    fill: theme.palette.error.main,
  },
  warning: {
    fill: theme.palette.warning.main,
  },
  check: {
    fill: theme.palette.success.main,
  },
}));

interface ResultIconProps {
  result?: TestResults;
}

export default function ResultIcon(props: ResultIconProps) {
  const classes = useStyles();
  const result = props.result;
  const hasError = Object.values(result?.errors ?? {}).length > 0;
  const hasWarning = result && rows.some((row) => row.getWarning?.(result));

  return (
    <>
      {hasError && <CloseIcon className={classes.close} />}
      {!hasError && hasWarning && <WarningIcon className={classes.warning} />}
      {!hasError && !hasWarning && <CheckIcon className={classes.check} />}
    </>
  );
}
