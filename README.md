# walkfs
Recursively walk over filesystem directories.

## install
```
npm install walkfs
```

## usage
### iterator mode
#### walkfs(directory, iterator, [oncomplete])

```
var walkfs = require('walkfs');

walkfs('/tmp', function(entry, next) {
	console.log(entry);
	// {
	//   type: 'file|directory|link',
	//   path: <item path>,
	//   stat: <stat object>
	// }
	next();
}, function(err) {
	console.log('completed');
})
```

### event emitter mode
#### walkfs(directory).on('file|link|directory|path|error|end', handler)

```
var walkfs = require('walkfs');
walkfs('/tmp')
.on('path', function(entry) {
	// emitted for all directories, links and files with the entry object specified above.
})
.on('file', function(entry) {
	// emitted for all files with the entry object specified above.
})
.on('link', function(entry) {
	// emitted for all links with the entry object specified above.
})
.on('directory', function(entry) {
	// emitted for all directories with the entry object specified above.
})
.on('error', function(err) {
	console.log('error: ' + err.message);
})
.on('end', function() {
	console.log('completed');
})
```

## license
MIT