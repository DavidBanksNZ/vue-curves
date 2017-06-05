var ghpages = require('gh-pages');

ghpages.publish('./', {
	src: ['index.html', 'dist/*']
});