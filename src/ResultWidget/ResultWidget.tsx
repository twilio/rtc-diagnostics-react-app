import React from 'react';
import { Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';

import mockResults from './mockResults';
import { getRegionName } from '../utils';

const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

interface Row {
  label: string;
  getValue(report: any): string | number;
}

const rows: Row[] = [
  {
    label: 'Signaling servers reachable',
    getValue: (test: any) => 'Yes',
  },
  {
    label: 'Insights Servers Reachable',
    getValue: (test: any) => 'Yes',
  },
  {
    label: 'Media Servers Reachable',
    getValue: (test: any) => 'Yes',
  },
  {
    label: 'Time To Media',
    getValue: (test: any) => 'foo',
  },
  {
    label: 'Time to Connect',
    getValue: (test: any) => 'foo',
  },
  {
    label: 'Jitter min/avg/max',
    getValue: (test: any) => {
      const jitter = test.results.preflight.stats.jitter;
      const { min, average, max } = jitter;
      return `${round(min)} / ${round(average)} / ${round(max)}`;
    },
  },
  {
    label: 'Latency (ms)',
    getValue: (test: any) => test.results.preflight.stats.rtt.average,
  },
  {
    label: 'Packet Loss',
    getValue: (test: any) => test.results.preflight.totals.packetsLostFraction,
  },
  {
    label: 'Bandwidth (kbps)',
    getValue: (test: any) => test.results.bitrate.averageBitrate,
  },
  {
    label: 'Expected Audio Quality (MOS)',
    getValue: (test: any) => test.results.preflight.stats.mos.average,
  },
  {
    label: 'Call SID',
    getValue: (test: any) => test.results.preflight.callSid,
  },
];

export default function ResultWidget(props: any) {
  const { results } = props; //{ results: mockResults } as any;

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
                <TableCell>{row.label}</TableCell>
                {results.map((result: any) => {
                  const value = row.getValue(result);
                  const displayValue = typeof value === 'number' ? round(value) : value;
                  return <TableCell key={result.region}>{displayValue}</TableCell>;
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
