import React from 'react';
import Alert from '../common/Alert/Alert';
import expectedQualityRow from '../ResultWidget/rows/expectedQuality/expectedQuality';
import { getBestEdge, getEdgeName } from '../utils';
import { TestResults } from '../types';

export default function SummaryWidget({ results }: { results?: TestResults[] }) {
  if (!results) return null;

  const bestEdge = getBestEdge(results);

  if (bestEdge) {
    const bestEdgeQuality = expectedQualityRow.getValue(bestEdge);
    const bestEdgeName = getEdgeName(bestEdge);

    return (
      <div style={{ margin: '1em 1em 0' }}>
        <Alert variant="success">
          <span>
            Expected Call Quality: <strong>{bestEdgeQuality}</strong>
          </span>
        </Alert>
        <div></div>
        <Alert variant="success">
          <span>
            Recommended Edge Location: <strong>{bestEdgeName}</strong>
          </span>
        </Alert>
      </div>
    );
  } else {
    return null;
  }
}
