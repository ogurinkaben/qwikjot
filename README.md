# qwikjot
Nodejs CRUD application with Authentication

## Requiremnts
* Nodejs installed
* Setup a MongoDB database. You can read up about that here https://docs.atlas.mongodb.com/tutorial/create-new-cluster/

## Run the project

### Clone the repo
```git clone https://github.com/simplytammy/qwikjot.git```

### Install dependencies
```cd qwikjot && npm install```

## Add database keys
* Create a databse.js file inside the config folder
* Copy the following code and paste in your database.js file (Use your database connection key from MongoDB)

```
	module.exports = {
		mongoURI: 'your-mongo-db-connection-key'
	}
```

### Start server
```npm run start```
