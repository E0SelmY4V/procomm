# Scpos Inter-Process Communication Library

*procomm* can make file-to-file IPC come ture.
Through elegant method chain, you can let the JS file running in different processes communicate alone with each other by "listen" and "tell".

## Initialization

To initialize *procomm*, you need:

```javascript
const procomm = require('procomm')(__filename);
// or
import procommIniter from 'procomm';
const procomm = procommIniter(__filename);
```

## Usage

Send message to JS file `./dad.js` running in father process:

```javascript
procomm.tell('dad', 'hello');
```

Send message to `./folder/son.js` in child process:

```javascript
const subProce = child_process.fork(path.join(__dirname, 'folder/son'));
procomm.reProce(subProce).tell('folder/son', 'hello');
```

Listen message from `../dad.js` in father process:

```javascript
procomm.listen('../dad', msg => console.log(msg));
```

Listen message from `/home/test/son.js` in child process:

```javascript
const subProce = child_process.fork('/home/test/son');
procomm.reProce(subProce).listen('/home/test/son.js', msg => console.log(msg));
```
