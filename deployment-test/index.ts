import { TimeSpan } from '@churill/time-span';

const ts = TimeSpan.fromHours(5).addMinutes(54).addSeconds(23);

console.log(ts.toString());
