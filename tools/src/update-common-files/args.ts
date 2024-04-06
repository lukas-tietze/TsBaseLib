import { CommonArgs } from '../common-args';

export type Args = CommonArgs & {
  projectFolder: string;
  templateFolder: string;
};
