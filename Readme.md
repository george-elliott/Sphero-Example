# sphero

## Installing Requirements

The project uses [Grunt](http://gruntjs.com).

- Install Grunt command line tools

  ```bash
  npm install -g grunt-cli
  ```

- Install dependencies in project's root directory
  
  ```bash
  baker install
  ```

## Building

To build locally, run 

```bash
grunt
```

## Hosting Locally

To host locally:

```bash
node server
```

**Note:** for local development, use `grunt watch` to watch for changes and rebuild output automatically.


## Deployment

There can be as many environments (with own names) as needed. There is no limit on that.

| Environment | Deployment command            	     |
| ----------- | ------------------------------------ |
| staging     | `grunt deploy:latest`                |
| production  | `ENV=production grunt deploy:latest` |

## Versioning

Each display can be versioned, but not necessarily, it is totally up to developer.
To deploy code to a latest branch/version, run:

	$ grunt deploy:latest

To deploy code only to a current version (specified in package.json), run:

	$ grunt deploy:current

To bump a version and deploy, use `grunt release` command (ENV variable is respected):

	$ grunt release
	$ ENV=demo grunt release

It will also tag your release using `git tag` and deploy it to GitHub.

## Embedding

  (function(env, version){
    var script = document.createElement('script');
    script.src = '//s3.amazonaws.com/cdn.getchute.com/displays/sphero/' + env + '/' + version + '/embed.js?' + new Date().getTime();
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
  })('ENVIRONMENT', 'VERSION');

**ENVIRONMENT** is usually 'production' or 'staging', **VERSION** is usually 'latest'.
