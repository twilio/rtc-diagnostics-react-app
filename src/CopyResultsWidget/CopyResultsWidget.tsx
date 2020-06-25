import React, { useState } from 'react';
import { Button, Snackbar, makeStyles, Theme } from '@material-ui/core';
import CopyIcon from '@material-ui/icons/FileCopy';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import { TestResults } from '../types';

const useStyles = makeStyles((theme: Theme) => ({
  snackBar: {
    background: theme.palette.success.main,
  },
  successIcon: {
    verticalAlign: 'middle',
    marginRight: '0.5em',
  },
}));

interface CopyResultsWidgetProps {
  results?: TestResults[];
}

export default function CopyResultsWidget({ results }: CopyResultsWidgetProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const classes = useStyles();

  if (!results) return null;

  const handleCopyResults = () => {
    const text = JSON.stringify(results, null, 2);
    navigator.clipboard.writeText(text).then(() => setHasCopied(true));
  };

  return (
    <>
      <Snackbar
        ContentProps={{ className: classes.snackBar }}
        message={
          <span>
            <SuccessIcon className={classes.successIcon} />
            Results Copied to Clipboard
          </span>
        }
        open={hasCopied}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        autoHideDuration={3000}
        onClose={() => setHasCopied(false)}
      />
      <Button onClick={handleCopyResults} variant="contained" color="secondary">
        <CopyIcon style={{ marginRight: '0.5em' }} />
        Copy Results
      </Button>
    </>
  );
}
