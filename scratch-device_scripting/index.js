console.log('hello world');
var q = require('q');

var example_script;
var scriptData;
// Import a user's script
try {
	example_script = require('./lib/example_script');
	userScript = example_script.userData;
} catch(err) {
	console.error('Error including user\'s script', err);
	program.exit(1);
}



function createFakeDevice() {
	var infoStore = {};

	this.set = function(register, value) {
		infoStore[register] = value;
	};

	this.get = function(register, defaultVal) {
		var retVal = 0;
		if(typeof(infoStore[register]) !== 'undefined') {
			retVal = infoStore[register];
		} else {
			if(typeof(defaultVal) !== 'undefined') {
				retVal = defaultVal;
			}
		}
		return retVal;
	};

	var self = this;
}
var device = new createFakeDevice();

function createFakeUserDisplay() {

}
var userDisplay = new createFakeUserDisplay(userScript.userDisplay);

function createFileInterface() {

}
var fileInterface = new createFileInterface();


function createTimerScriptHandler(userData, scriptPromise) {
	this.handlerType = 'timer';
	this.userData = userData;
	this.status = {
		// Program state indicators
		'currentStep': 0,
		'numIterations': 0,

		'numSteps': userData.steps.length,
	};

	this.timerHandle = undefined;

	this.executeAsyncUserStep = function(bundle) {
		var defered = q.defer();

		try {
			var operationCallback = function(err) {
				if(err) {
					console.log('Error executing step async', bundle, err);
					defered.resolve(bundle);
				} else {
					defered.resolve(bundle);
				}
			};

			var currentStep = userData.steps[bundle.currentStep];
			console.log('Step Keys', Object.keys(currentStep));
			currentStep.func(
				device,
				fileInterface,
				userDisplay,
				bundle,
				operationCallback
			);
		} catch(err) {
			console.log('Error executing step async (thrown error)', bundle, err);
			defered.resolve(bundle);
		}
		return defered.promise;
	};

	this.executeSyncUserStep = function(bundle) {
		var defered = q.defer();
		try {
			var currentStep = userData.steps[bundle.currentStep];
			currentStep.func(
				device,
				fileInterface,
				userDisplay,
				bundle
			);
		} catch(err) {
			console.log('Error executing step sync', bundle, err);
		}
		defered.resolve(bundle);
		return defered.promise;
	};

	var basicDelayStepType = function(bundle) {
		var defered = q.defer();
		var currentStep = userData.steps[bundle.currentStep];
		var duration = currentStep.duration;
		setTimeout(function() {
			defered.resolve(bundle);
		}, duration);
		return defered.promise;
	};

	var basicStepTypes = {
		'delay': basicDelayStepType,
	};
	
	this.executeUserStep = function(bundle) {
		var defered = q.defer();

		var currentStep = userData.steps[bundle.currentStep];

		console.log(
			'  - Current Step',
			bundle.currentStep,
			bundle.numIterations,
			bundle.numSteps,
			currentStep.name
		);
		if(currentStep.type === 'basic') {
			if(currentStep.method === 'sync') {
				self.executeSyncUserStep(bundle)
				.then(defered.resolve, defered.reject);
			} else if(currentStep.method === 'async') {
				self.executeSyncUserStep(bundle)
				.then(defered.resolve, defered.reject);
			} else {
				console.log('! - Invalid method:', currentStep.method, bundle);
				defered.resolve(bundle);
			}
		} else {
			if(typeof(basicStepTypes[currentStep.type]) === 'function') {
				basicStepTypes[currentStep.type](bundle)
				.then(defered.resolve, defered.reject);
			} else {
				console.log('! - Invalid step type', currentStep.type, bundle);
				defered.resolve(bundle);
			}
		}
		return defered.promise;
	};

	this.updateProgramState = function(bundle) {
		var defered = q.defer();

		var currentStep = bundle.currentStep;
		var numSteps = bundle.numSteps;
		var numIterations = bundle.numIterations;

		currentStep += 1;
		if(currentStep >= numSteps) {
			currentStep = 0;
			numIterations += 1;
		}

		if(userData.stopCondition.numIterations) {
			if(numIterations >= userData.stopCondition.numIterations) {
				console.log('Stopping Script b/c numIterations');
				
				clearInterval(self.timerHandle);
				scriptPromise.resolve();
			}
		}

		// Update status variable
		self.status.currentStep = currentStep;
		self.status.numSteps = numSteps;
		self.status.numIterations = numIterations;

		// Un-lock step execution
		self.allowStepExecution = true;
		return defered.promise;
	};

	this.allowStepExecution = true;

	this.runStep = function() {
		if(self.allowStepExecution) {
			self.allowStepExecution = false;
			var currentStep = self.status.currentStep;
			var numSteps = self.status.numSteps;
			var numIterations = self.status.numIterations;

			self.executeUserStep({
				'currentStep': currentStep,
				'numSteps': numSteps,
				'numIterations': numIterations
			})
			.then(self.updateProgramState)
			.done();
		} else {
			console.log(
				'Delaying b/c current step is taking to long to execute',
				self.status
			);
		}
	};

	this.configureTimerHandle = function(timerHandle) {
		self.timerHandle = timerHandle;
	};

	var self = this;
}


function createScriptRunner(scriptTriggers) {
	var timers = [];
	var scriptHandlers = [];
	
	this.addTimerTrigger = function(userData) {
		var defered = q.defer();

		var timerScriptHandler = new createTimerScriptHandler(userData, defered);

		var timer = setInterval(
			timerScriptHandler.runStep,
			userData.interval
		);

		timerScriptHandler.configureTimerHandle(timer);

		timers.push(timer);
		scriptHandlers.push(timerScriptHandler);

		return defered.promise;
	};


	this.runScript = function() {
		var defered = q.defer();

		var scripts = [];

		scriptTriggers.forEach(function(scriptTrigger) {
			if(scriptTrigger.type === 'timer') {
				scripts.push(self.addTimerTrigger(scriptTrigger));
			}
		});

		q.allSettled(scripts)
		.then(function(results) {
			console.log('Finished executing scripts', results);
			defered.resolve(results);
		}, function(err) {
			defered.reject(err);
		});
		return defered.promise;
	};
	var self = this;
}


// Interpret the user script
var userTriggers = userScript.userTriggers;
var userSets = userScript.userSets;
var userFunctions = userScript.userFunctions;
var userSteps = userScript.userSteps;

var scriptTriggers = [];
// Loop through the defined triggers and build up the array of enabledTriggers
userScript.enabledTriggers.forEach(function(enabledTrigger) {
	var scriptTrigger = userTriggers[enabledTrigger];

	var desiredSteps = userSets[scriptTrigger.set];
	var scriptSteps = [];
	desiredSteps.forEach(function(desiredStep) {
		var scriptStep = userSteps[desiredStep];

		var scriptFunction = userFunctions[scriptStep.name];

		scriptStep.func = scriptFunction;
		scriptStep.op = 'bla...';
		scriptSteps.push(scriptStep);
	});


	scriptTrigger.steps = scriptSteps;

	scriptTriggers.push(scriptTrigger); 
});

console.log(JSON.stringify(scriptTriggers, null, 2));

// Create a scriptRunner object
var userProgram = new createScriptRunner(scriptTriggers);

// Execute the user-script
userProgram.runScript()
.then(function runScriptSuccess(bundle) {
	console.log('Successfully ran script', bundle);
}, function runScriptError(err) {
	console.log('Error executing script', err);
});

