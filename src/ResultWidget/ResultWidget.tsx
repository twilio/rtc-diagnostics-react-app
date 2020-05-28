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

enum TestColors {
  good = 'green',
  warn = 'yellow',
  bad = 'red',
}

const useStyles = makeStyles({
  tableCellContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& svg': {
      fill: '#666',
    },
  },
  [TestColors.good]: {
    background: '#fff',
  },
  [TestColors.warn]: {
    background: '#ff8',
  },
  [TestColors.bad]: {
    background: '#f88',
  },
});

const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

interface Row {
  label: string;
  getValue(report: any): string | number;
  getColor?(report: any): TestColors;
}

const rows: Row[] = [
  {
    label: 'Signaling servers reachable',
    getValue: (test: any) => 'Yes',
    getColor: (test: any) => TestColors.good,
  },
  {
    label: 'Media Servers Reachable',
    getValue: (test: any) => 'Yes',
    getColor: (test: any) => TestColors.good,
  },
  {
    label: 'Time To Connect',
    getValue: (test: any) => 'N/A',
    getColor: (test: any) => TestColors.good,
  },
  {
    label: 'Time to Media',
    getValue: (test: any) => test.results.preflight.networkTiming.peerConnection.duration,
    getColor: (test: any) => TestColors.good,
  },
  {
    label: 'Jitter min/avg/max',
    getValue: (test: any) => {
      const jitter = test.results.preflight.stats.jitter;
      const { min, average, max } = jitter;
      return `${round(min)} / ${round(average)} / ${round(max)}`;
    },
    getColor: (test: any) => (test.results.preflight.stats.jitter.average < 30 ? TestColors.good : TestColors.bad),
  },
  {
    label: 'Latency (ms)',
    getValue: (test: any) => test.results.preflight.stats.rtt.average,
    getColor: (test: any) => (test.results.preflight.stats.rtt.average < 200 ? TestColors.good : TestColors.bad),
  },
  {
    label: 'Packet Loss',
    getValue: (test: any) => `${test.results.preflight.totals.packetsLostFraction}%`,
    getColor: (test: any) => (test.results.preflight.totals.packetsLostFraction < 3 ? TestColors.good : TestColors.bad),
  },
  {
    label: 'Bandwidth (kbps)',
    getValue: (test: any) => test.results.bitrate.averageBitrate,
    getColor: (test: any) => {
      if (test.results.bitrate.averageBitrate < 40) {
        return TestColors.bad;
      }
      if (test.results.bitrate.averageBitrate < 100) {
        return TestColors.warn;
      }
      return TestColors.good;
    },
  },
  {
    label: 'Expected Audio Quality (MOS)',
    getValue: (test: any) => test.results.preflight.stats.mos.average,
    getColor: (test: any) => TestColors.good,
  },
  {
    label: 'Call SID',
    getValue: (test: any) => test.results.preflight.callSid,
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
                  const color = row.getColor?.(result);
                  const className = color ? classes[color!] : undefined;
                  return (
                    <TableCell key={result.region} className={className}>
                      <div className={classes.tableCellContent}>
                        {displayValue}
                        {(color === TestColors.bad || color === TestColors.warn) && (
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
