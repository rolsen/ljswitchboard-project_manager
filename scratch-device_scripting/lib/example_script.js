

var userData = {
	'userDisplay': {
		'rowA': {
			'columnA': {
				'name': 'current_time',
				'type': 'textField',
				'defaultValue': 'Starting...',
				'width': '100%'
			}
		},
		'rowB': {
			'columnA': {
				'name': 'dac_value',
				'type': 'textField',
				'width': '50%'
			},
			'columnB': {
				'name': 'ain_value',
				'type': 'textField',
				'width': '50%'
			}
		}
	},
	'userFunctions': {
		'setDAC': function setDAC(device, file, display, program) {
			var ainVal = device.get('AIN0');
			var dacVal = ainVal + 1;
			device.set('DAC0', dacVal);
		},
		'updateDisplay': function printResults(device, file, display, program) {
			console.log('Updating User Display...', device.get('AIN0'), device.get('DAC0'));
		},
	},
	'userSteps': {
		'basicStep': {
			'type': 'basic',
			'inputs': ['AIN0', 'AIN1'],
			'name': 'setDAC',
			'method': 'sync',
		},
		'smallDelay': {
			'type': 'delay',
			'name': 'userDelay',
			'duration': 100,
		},
		'updateDisplay': {
			'type': 'basic',
			'name': 'updateDisplay',
			'method': 'sync',
		}
	},
	'userSets': {
		'basicSet': ['basicStep', 'smallDelay', 'updateDisplay']
	},
	'userTriggers': {
		'coreTimer': {
			'type': 'timer',
			'interval': 1000,
			'set': 'basicSet',
			// Should be 'sets', a trigger can have multiple "sets" that get 
			// executed every interval.  A "set" contains a list of "steps" 
			// that get executed in that interval.

			'stopCondition': {
				'numIterations': 5
			}
		}
	},
	'enabledTriggers': ['coreTimer'],
};

exports.userData = userData;
exports.userDisplay = userData.userDisplay;
