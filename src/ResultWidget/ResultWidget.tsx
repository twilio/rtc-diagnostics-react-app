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
  Typography,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

import ResultIcon from './ResultIcon/ResultIcon';
import { getBestEdge, getEdgeName } from '../utils';
import { TestWarnings, TestResults } from '../types';
import { darken, fade, lighten } from '@material-ui/core/styles/colorManipulator';
import { rows } from './rows';

const useStyles = makeStyles((theme: Theme) => {
  const getBackgroundColor = theme.palette.type === 'light' ? lighten : darken;
  return createStyles({
    table: {
      tableLayout: 'fixed',
      borderTop: `1px solid ${theme.palette.divider}`,
      '& td, & th': {
        width: '260px',
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
        fill: '#000',
      },
    },
    headerContent: {
      display: 'flex',
      '& p': {
        fontWeight: 'bold',
        marginLeft: '12px',
      },
    },
    bestEdgeCell: {
      background: getBackgroundColor(theme.palette.success.main, 0.9),
    },
    [TestWarnings.warn]: {
      background: getBackgroundColor(theme.palette.warning.main, 0.9),
    },
    [TestWarnings.error]: {
      background: getBackgroundColor(theme.palette.error.main, 0.9),
    },
  });
});

export default function ResultWidget(props: { results?: TestResults[] }) {
  const { results } = props;
  const classes = useStyles();

  const getTableCellClass = (isBestEdge: boolean, warning?: TestWarnings) => {
    if (warning?.includes('warn')) return classes[TestWarnings.warn];
    if (warning === TestWarnings.error) return classes[TestWarnings.error];
    if (isBestEdge) return classes.bestEdgeCell;
  };

  if (!results) return null;

  const bestEdge = getBestEdge(results);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {results.map((result) => {
              const isBestEdge = !!bestEdge && bestEdge.edge === result.edge;
              const className = getTableCellClass(isBestEdge);
              const edgeName = getEdgeName(result) + (isBestEdge ? ' (Recommended)' : '');
              return (
                <TableCell key={result.edge} className={className}>
                  <div className={classes.headerContent}>
                    <ResultIcon result={result} />
                    <Typography>{edgeName}</Typography>
                  </div>
                </TableCell>
              );
            })}
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
                  const warning = row.getWarning?.(result);
                  const className = getTableCellClass(!!bestEdge && bestEdge.edge === result.edge, warning);
                  const tooltipContent = warning ? row.tooltipContent?.[warning] : null;

                  return (
                    <TableCell key={result.edge} className={className}>
                      <div className={classes.tableCellContent}>
                        {value}
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
