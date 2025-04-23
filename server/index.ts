// This file acts as a proxy to redirect to the server-next.js file
// Since we can't modify package.json, we're using this approach
// to make the Next.js server run instead of the Express server

import '../server-next.js';

// The server-next.js file will handle all the server functionality
// using Next.js instead of Express
