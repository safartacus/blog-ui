const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();

// Gzip sıkıştırma
app.use(compression());

// Static dosyaları serve et
app.use(express.static(path.join(__dirname, 'dist/blog-ui')));

// Tüm route'ları index.html'e yönlendir
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/blog-ui/index.html'));
});

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});