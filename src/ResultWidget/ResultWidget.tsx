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
  createStyles,
  Theme,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

import mockResults from './mockResults';
import { getRegionName } from '../utils';
import { TestWarnings, TestResults } from '../types';
import { darken, fade, lighten } from '@material-ui/core/styles/colorManipulator';
import { rows } from './rows';
import { round } from '../utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      tableLayout: 'fixed',
      '& th:first-child': {
        width: '260px',
      },
      '& td, & th': {
        borderRight: `1px solid
      ${
        // Same implementation as material-ui's table borderBottom.
        theme.palette.type === 'light'
          ? lighten(fade(theme.palette.divider, 1), 0.88)
          : darken(fade(theme.palette.divider, 1), 0.68)
      }`,
      },
      '& td:last-child, & th:last-child': {
        borderRight: 'none',
      },
      '& th, & td:first-child': {
        fontWeight: 'bold',
      },
    },
    tableCellContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      wordBreak: 'break-word',
      '& svg': {
        fill: '#666',
      },
    },
    [TestWarnings.warn]: {
      background: '#ff8',
    },
    [TestWarnings.error]: {
      background: '#DE5858',
    },
  })
);

export default function ResultWidget(props: { results?: TestResults[] }) {
  // const results: any = mockResults;
  const { results } = props;
  const classes = useStyles();

  const getTableCellClass = (warning?: TestWarnings) => {
    if (warning?.includes('warn')) return classes[TestWarnings.warn];
    if (warning === TestWarnings.error) return classes[TestWarnings.error];
  };

  if (!results) return null;

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {results.map((result) => (
              <TableCell key={result.region}>{getRegionName(result)}</TableCell>
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
                {results.map((result) => {
                  const value = row.getValue(result);
                  const displayValue = typeof value === 'number' ? round(value) : value;
                  const warning = row.getWarning?.(result);
                  const className = getTableCellClass(warning);
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
