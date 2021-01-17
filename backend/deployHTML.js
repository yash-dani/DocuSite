var shell = require('shelljs');
shell.cp('test.html', 'my-site/public/index.html');
shell.cd('my-site');
a = shell.exec('wrangler publish', function(code, stdout, stderr) {
	//var testUrl = stdout.match(/'(https?:[^\s]+)'/),
    //onlyUrl = testUrl && testUrl[1];
    console.log(stderr.split('\n')[5]);
});