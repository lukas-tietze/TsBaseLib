import { JestConfigWithTsJest } from 'ts-jest';

import baseConfig from '../jest.config';

export default { ...baseConfig } satisfies JestConfigWithTsJest;
