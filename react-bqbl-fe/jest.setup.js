// jest.setup.js
import { TextDecoder, TextEncoder } from 'util';

import 'whatwg-fetch';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
