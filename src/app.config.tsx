const devConfig = {};

//const prodConfig = {};

const config = getConfig();

/*function getConfig() {
	if (process.env.NODE_ENV === "production") {
		return prodConfig;
	} else {
		return devConfig;
	}
}*/

function getConfig() {
	return devConfig;
}

export default config;
