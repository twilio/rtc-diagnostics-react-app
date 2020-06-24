import React, { useState } from 'react';
import { TestResults } from '../types';
import { Button } from '@material-ui/core';
import CopyIcon from '@material-ui/icons/FileCopy';

interface CopyResultsWidgetProps {
  results?: TestResults[];
}

export default function CopyResultsWidget({ results }: CopyResultsWidgetProps) {
  const [hasCopied, setHasCopied] = useState(false);

  if (!results) return null;

  const handleCopyResults = () => {
    const text = JSON.stringify(results, null, 2);
    navigator.clipboard.writeText(text).then(() => setHasCopied(true));
  };

  return (
    <Button onClick={handleCopyResults} variant="contained" color="secondary">
      <CopyIcon style={{ marginRight: '0.5em' }} />
      {hasCopied ? 'Copied!' : 'Copy Results'}
    </Button>
  );
}
