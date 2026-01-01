export const apiUnAuthUrl = {
  server: '/',
  apiDocsV1: '/api-docs/v1',
  userRegister: '/api/register-user',
  userLogin: '/api/login-user',
};

export const publicUrl = Object.values(apiUnAuthUrl);

const apiAuthUrl = {
  user: '/api/users',
  task: '/api/tasks',
  image: '/api/image',
  mediaLibrary: '/api/media-library',
  uploads: '/uploads',
};

export default apiAuthUrl;
