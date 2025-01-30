# Backend Task

This is Repositories for backend part. For running this app, make sure to install below requirement

- nodejs
- postgressql

# Step to install
1. clone project and run `npm install`. Notes, if you have error,  try run `npm install --force`
2. create new `.env` file and change and add key `DATABASE_URL` into `postgresql://<username>:<password>@<hostname>:<port>/<dbname>?schema=public`
3. run script `npm run migrate` to migrate database
4. run `npm start` to start server. You can also check API documentation on `<url>/documentation`