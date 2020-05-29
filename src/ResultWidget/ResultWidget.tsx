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
import { TestWarnings } from '../types';
import { rows } from './rows';
import { round } from '../utils';

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
            const tooltipTitle = row.tooltipContent?.label;
            return (
              <TableRow key={row.label}>
                <TableCell>
                  <div className={classes.tableCellContent}>
                    {row.label}
                    {tooltipTitle && (
                      <Tooltip title={tooltipTitle} placement="top" interactive leaveDelay={250}>
                        <InfoIcon />
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                {results.map((result: any) => {
                  const value = row.getValue(result);
                  const displayValue = typeof value === 'number' ? round(value) : value;
                  const warning = row.getWarning?.(result);
                  const className = warning ? classes[warning] : undefined;
                  const tooltipContent = warning ? row.tooltipContent?.[warning] : null;

                  return (
                    <TableCell key={result.region} className={className}>
                      <div className={classes.tableCellContent}>
                        {displayValue}
                        {tooltipContent && (
                          <Tooltip title={tooltipContent} placement="top" interactive leaveDelay={250}>
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
