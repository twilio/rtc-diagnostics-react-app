import React from 'react';
import { TestWarnings, TestResults } from '../../types';
import { Link as LinkImpl, Typography as TypographyImpl } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

export type RowLabel =
  | 'Signalling Servers Reachable'
  | 'Media Servers Reachable'
  | 'Time To Connect'
  | 'Time to Media'
  | 'Jitter min/avg/max'
  | 'Latency (ms) min/avg/max'
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
  label: React.ReactNode;
  [TestWarnings.warn]?: React.ReactNode;
  [TestWarnings.error]?: React.ReactNode;
  [TestWarnings.warnTurn]?: React.ReactNode;
  [TestWarnings.warnTurnTCP]?: React.ReactNode;
  [TestWarnings.warnTurnUDP]?: React.ReactNode;
};

export const Link = ({ children, href }: { children: string; href: string }) => (
  <LinkImpl href={href} target="_blank" rel="noopener" style={{ color: 'inherit', textDecoration: 'underline' }}>
    {children}
  </LinkImpl>
);

const StyledTypography = styled(TypographyImpl)({
  '&:not(:last-child)': {
    marginBottom: '0.6em',
  },
});

export const Typography = ({ children }: { children: React.ReactNode }) => (
  <StyledTypography variant="body2">{children}</StyledTypography>
);
