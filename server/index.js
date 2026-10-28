const { createApp } = require('./app');
const port = process.env.PORT || 3200;
createApp().listen(port, () => console.log('status page on http://localhost:' + port));
