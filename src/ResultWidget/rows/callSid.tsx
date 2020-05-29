import { Row } from './shared';
import { TestResults } from '../../types';

const row: Row = {
  label: 'Call SID',
  getValue: (testResults: TestResults) => testResults?.results?.preflight?.callSid,
};

export default row;
