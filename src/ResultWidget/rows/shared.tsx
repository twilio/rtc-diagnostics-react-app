import React from 'react';
import { TestWarnings, TestResults } from '../../types';
import { Link as LinkImpl } from '@material-ui/core';

export type RowLabel =
  | 'Signaling Servers Reachable'
  | 'Media Servers Reachable'
  | 'Time To Connect'
  | 'Time to Media'
  | 'Jitter min/avg/max'
  | 'Latency (ms)'
  | 'Packet Loss'
  | 'Bandwidth (kbps)'
  | 'Expected Audio Quality (MOS)'
  | 'Call SID';

export type Row = {
  label: RowLabel;
  getValue(testResults: TestResults): string | number | undefined;
  getWarning?(testResults: TestResults): TestWarnings;
  tooltipContent?: TooltipContent;
};

export type TooltipContent = {
  label: React.ReactElement;
  [TestWarnings.warn]?: React.ReactElement;
  [TestWarnings.error]?: React.ReactElement;
};

export const Link = ({ children, href }: { children: string; href: string }) => (
  <LinkImpl href={href} target="_blank" rel="noopener" style={{ color: 'inherit', textDecoration: 'underline' }}>
    {children}
  </LinkImpl>
);
