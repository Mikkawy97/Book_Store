const express = require('express');
const cors = require('cors');

const app = express();

const authorRoutes = require('./routes/authors');
const bookRoutes = require('./routes/books');
const storeRoutes = require('./routes/stores');
const storeBookRoutes = require('./routes/storeBooks');


app.use(cors());
app.use(express.json());

// Use the routes
app.use('/authors', authorRoutes);
app.use('/books', bookRoutes); // Ensure this line is present
app.use('/stores', storeRoutes);
app.use('/store-books', storeBookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});