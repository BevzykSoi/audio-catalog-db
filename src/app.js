const express = require('express');
const volleyball = require('volleyball');
const helmet = require('helmet');
const cors = require('cors');
const swagger = require('swagger-ui-express');
const swaggerApi = require('./api.json');
const path = require('path');
const cloudinary = require('cloudinary').v2;

require('dotenv').config();
require('./config/db');
require('./config/passport');

const app = express();
const apiRouter = require('./routes/apiRouter');
const errorHandler = require('./middlewares/errorHandler');
const staticFolderPath = path.join(process.cwd(), 'public');

const authApi = require('./docs/auth.json');
const audiosApi = require('./docs/audios.json');
const usersApi = require('./docs/users.json');
const playlistsApi = require('./docs/playlists.json');
const commentsApi = require('./docs/comments.json');

const userSchemaApi = require('./docs/schemas/User.json');
const profileSchemaApi = require('./docs/schemas/Profile.json');
const audioSchemaApi = require('./docs/schemas/Audio.json');
const playlistSchemaApi = require('./docs/schemas/Playlist.json');
const commentSchemaApi = require('./docs/schemas/Comment.json');

swaggerApi.paths = {
  ...authApi,
  ...audiosApi,
  ...usersApi,
  ...playlistsApi,
  ...commentsApi,
};

swaggerApi.components.schemas = {
  ...userSchemaApi,
  ...profileSchemaApi,
  ...audioSchemaApi,
  ...playlistSchemaApi,
  ...commentSchemaApi,
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.static(staticFolderPath));
app.use(express.json());
app.use(volleyball);
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use('/docs', swagger.serve, swagger.setup(swaggerApi));

app.use('/api/v1', apiRouter);
app.use(errorHandler);

module.exports = app;
