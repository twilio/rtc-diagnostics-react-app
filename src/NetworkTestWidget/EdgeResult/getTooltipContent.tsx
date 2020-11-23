import React from 'react';
import { rows } from '../../ResultWidget/rows';
import { TestResults } from '../../types';
import { Typography as TooltipTypography } from '../../ResultWidget/rows/shared';

export default function getTooltipContent(result: TestResults): React.ReactElement[] {
  if (result.errors.bitrate?.message === 'expired' || result.errors.preflight?.message === 'expired') {
    return [
      <TooltipTypography key="expired">App has expired. Please redeploy the app and try again.</TooltipTypography>,
    ];
  }

  const warnings = rows
    .map((row) => {
      const warning = row.getWarning?.(result);
      return warning ? row.tooltipContent?.[warning] : null;
    })
    .filter((content) => content !== null)
    .map((content, i) => <React.Fragment key={i}>{content}</React.Fragment>); // Adding keys to suppress dev warning

  const expectedQualityRow = rows.find((row) => row.label === 'Expected Audio Quality (MOS)');
  const expectedQualityValue = expectedQualityRow!.getValue(result);

  if (expectedQualityValue) {
    warnings.unshift(
      <TooltipTypography key="quality">Expected call quality: {expectedQualityValue}</TooltipTypography>
    );
  }

  return warnings;
}
