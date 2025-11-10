export const apiUnAuthUrl = {
  server: '/',
  apiDocs: '/api-docs',
  userRegister: '/api/register-user',
  userLogin: '/api/login-user',
};

export const publicUrl = Object.values(apiUnAuthUrl);

const apiAuthUrl = {
  task: '/api/tasks',
  image: '/api/image',
  mediaLibrary: '/api/media-library',
  uploads: '/uploads',
};

export default apiAuthUrl;
