import React from 'react';
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  makeStyles,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

import mockResults from './mockResults';
import { getRegionName } from '../utils';
import { TestWarnings, TestResults } from '../types';

const useStyles = makeStyles({
  tableCellContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& svg': {
      fill: '#666',
    },
  },
  [TestWarnings.warn]: {
    background: '#ff8',
  },
  [TestWarnings.error]: {
    background: '#f88',
  },
});

const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

interface Row {
  label: string;
  getValue(testResults: TestResults): string | number | undefined;
  getWarning?(testResults: TestResults): TestWarnings;
}

export const rows: Row[] = [
  {
    label: 'Signaling servers reachable',
    getValue: (testResults: TestResults) => 'Yes',
    getWarning: (testResults: TestResults) => TestWarnings.none,
  },
  {
    label: 'Media Servers Reachable',
    getValue: (testResults: TestResults) => 'Yes',
    getWarning: (testResults: TestResults) => TestWarnings.none,
  },
  {
    label: 'Time To Connect',
    getValue: (testResults: TestResults) => 'N/A',
    getWarning: (testResults: TestResults) => TestWarnings.none,
  },
  {
    label: 'Time to Media',
    getValue: (testResults: TestResults) => testResults?.results?.preflight?.networkTiming?.peerConnection?.duration,
    getWarning: (testResults: TestResults) => TestWarnings.none,
  },
  {
    label: 'Jitter min/avg/max',
    getValue: (testResults: TestResults) => {
      const jitter = testResults?.results?.preflight?.stats?.jitter;
      if (jitter) {
        const { min, average, max } = jitter;
        return `${round(min)} / ${round(average)} / ${round(max)}`;
      }
    },
    getWarning: (testResults: TestResults) =>
      (testResults?.results?.preflight?.stats?.jitter?.average ?? 0) < 30 ? TestWarnings.none : TestWarnings.error,
  },
  {
    label: 'Latency (ms)',
    getValue: (testResults: TestResults) => testResults?.results?.preflight?.stats?.rtt?.average,
    getWarning: (testResults: TestResults) =>
      (testResults?.results?.preflight?.stats?.rtt?.average ?? 0) < 200 ? TestWarnings.none : TestWarnings.error,
  },
  {
    label: 'Packet Loss',
    getValue: (testResults: TestResults) => `${testResults?.results?.preflight?.totals?.packetsLostFraction}%`,
    getWarning: (testResults: TestResults) =>
      (testResults?.results?.preflight?.totals?.packetsLostFraction ?? 0) < 3 ? TestWarnings.none : TestWarnings.error,
  },
  {
    label: 'Bandwidth (kbps)',
    getValue: (testResults: TestResults) => testResults?.results?.bitrate?.averageBitrate,
    getWarning: (testResults: TestResults) => {
      if ((testResults?.results?.bitrate?.averageBitrate ?? 0) < 40) {
        return TestWarnings.error;
      }
      if ((testResults?.results?.bitrate?.averageBitrate ?? 0) < 100) {
        return TestWarnings.warn;
      }
      return TestWarnings.none;
    },
  },
  {
    label: 'Expected Audio Quality (MOS)',
    getValue: (testResults: TestResults) => testResults?.results?.preflight?.stats?.mos?.average,
    getWarning: (testResults: TestResults) => TestWarnings.none,
  },
  {
    label: 'Call SID',
    getValue: (testResults: TestResults) => testResults?.results?.preflight?.callSid,
  },
];

export default function ResultWidget(props: any) {
  // const results = mockResults;
  const { results } = props;
  const classes = useStyles();

  if (!results) return null;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {results.map((result: any) => (
              <TableCell key={result.region}>{getRegionName(result.region)}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            return (
              <TableRow key={row.label}>
                <TableCell>
                  <div className={classes.tableCellContent}>
                    {row.label}
                    <Tooltip title="More information can be displayed here." placement="top">
                      <InfoIcon />
                    </Tooltip>
                  </div>
                </TableCell>
                {results.map((result: any) => {
                  const value = row.getValue(result);
                  const displayValue = typeof value === 'number' ? round(value) : value;
                  const color = row.getWarning?.(result);
                  const className = color ? classes[color!] : undefined;
                  return (
                    <TableCell key={result.region} className={className}>
                      <div className={classes.tableCellContent}>
                        {displayValue}
                        {(color === TestWarnings.error || color === TestWarnings.warn) && (
                          <Tooltip title="More information can be displayed here." placement="top">
                            <InfoIcon />
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
