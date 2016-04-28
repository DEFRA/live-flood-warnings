
## Local test
Both the selenium jar and the chromedriver are in the /bin directory, so there shouldn't be any manual setup here, nightwatch handles the selenium server_path

`npm run test-e2e-local`

## Remote test (Sauce labs)

In your environment variable location add, populated with the saucelabs connection details:

`export SAUCE_USERNAME=
export SAUCE_ACCESS_KEY=`

If you are wanting to test your localhost using sauce labs then a tunnel will need to be created for the remote to access your local.  This is done through Sauce Connect.  See https://wiki.saucelabs.com/display/DOCS/Setting+Up+Sauce+Connect

Download from https://saucelabs.com/downloads/sc-4.3.13-linux.tar.gz

Extract the package and in the terminal in the extraction directory run:

`./bin/sc -u ${SAUCE_USERNAME} -k ${SAUCE_ACCESS_KEY} -B all`

This will need to be left running whilst the remote tests are run:

`npm run test-e2e-remote`
