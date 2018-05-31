#!/bin/sh - deprecated

clear #clears the command line screen

while true; do
	sleep 1
	echo "HERE"
done
exit


#Accepts Two args & executes the testMe.js node program:
#Arg1: true/false.  true=async, false=blocking
#Arg2: test number, see testMe.js for test descriptions

#support for various operating systems & computer names
hostname
export CUR_PC_NAME=$(hostname)
#CUR_PC_NAME=hostname
# echo $CUR_PC_NAME
if [ $CUR_PC_NAME = "Labjack-win8" ]
then
	CUR_PC_ROB_SCRIPT="./strategies/windows_standalone.rob"
	CUR_PC_ROB_JSON="./strategies/windows_standalone_lj.json"
	CUR_PC_KIPLING_EXE="ljswitchboard\\deploy\\nw.exe"
elif [ $CUR_PC_NAME = "chris-johnsons-macbook-pro-2.local" ]
then
	CUR_PC_ROB_SCRIPT="./strategies/mac_kipling_standalone.rob"
	CUR_PC_ROB_JSON="./strategies/mac_standalone.json"
	CUR_PC_KIPLING_EXE="open ljswitchboard/deploy/kipling.app"
else
	echo "no valid pc detected"
fi
#First perform logic to check the number of command line arguments, do something different if there are 0 args
if [ $# -eq 0 ]
then
	echo "There are $# args. The Arg Str is: $*"
else
	LABJACK_NODE_GIT_URL="https://github.com/chrisJohn404/LabJack-nodejs.git"
	LABJACK_SWITCHBOARD_GIT_URL="https://github.com/Samnsparky/ljswitchboard.git"
	LABJACK_SWITCHBOARD_FRAMEWORK_MANAGER="https://github.com/Samnsparky/kipling-module-framework.git"
	if [ $# -eq 2 ]
	then
		echo "There are $# args. The Arg Str is: $*"
		if [ $1 = "setup" ]
		then
			if [ $2 = "LJ-Node" ]
			then
				git clone $LABJACK_NODE_GIT_URL
			fi
			if [ $2 = "LJ-Switchboard" ]
			then
				git clone $LABJACK_SWITCHBOARD_GIT_URL
			fi
			if [ $2 = "robscript" ]
			then
				cd robscript_standalone
				#mac command:
				#python robscript.py ./strategies/mac_kipling_standalone.rob ./strategies/mac_standalone.json
				#windows command:
				python robscript.py $CUR_PC_ROB_SCRIPT $CUR_PC_ROB_JSON
				cd ..
			fi
			if [ $2 = "frameworkManager" ]
			then
				cd ljswitchboard/switchboard_modules/framework
				git clone $LABJACK_SWITCHBOARD_FRAMEWORK_MANAGER
				cd ../../..
			fi
			if [ $2 = "npm" ]
			then
				cd ljswitchboard/src
				npm install
				cd ../..
			fi
			if [ $2 = "frameworkManagerNode" ]
			then
				cd ljswitchboard/switchboard_modules/framework
				cd kipling-module-framework
				npm install
				cd ..
				cd ../../..
			fi
		fi
		if [ $1 = "git" ]
		then
			echo "git"
		fi
		if [ $1 = "test" ]
		then
			# START: REBUILDING LABJACK_NODEJS TO BE RUN OUTSIDE OF NW.EXE
			cd ljswitchboard/src
			# Determine if we need to rebuild ffi and ref
			REBUILD_FFI="false"
			REBUILD_REF="false"

			cd node_modules/labjack-nodejs/node_modules
			CUR_FILE="./ffi/build/config.gypi"
			if grep -q '"target_arch": "ia32"' $CUR_FILE; then
				echo "ffi needs to be re-built b/c of target_arch"
				REBUILD_FFI="true"
			fi
			if grep -q '"target": "0.8.6"' $CUR_FILE; then
				echo "ffi needs to be re-built b/c of target"
				REBUILD_FFI="true"
			fi
			CUR_FILE="./ref/build/config.gypi"
			if grep -q '"target_arch": "ia32"' $CUR_FILE; then
				echo "ref needs to be re-built b/c of target_arch"
				REBUILD_REF="true"
			fi
			if grep -q '"target": "0.8.6"' $CUR_FILE; then
				echo "ref needs to be re-built b/c of target"
				REBUILD_REF="true"
			fi
			cd ../../..

			if [ $REBUILD_FFI == "true" ]
			then
				echo "Rebuilding ffi"
				cd node_modules/labjack-nodejs/node_modules/ffi
				BUILD_DATA="$(node-gyp rebuild)"
				cd ../../../..
			fi
			if [ $REBUILD_REF == "true" ]
			then
				echo "Reguilding ref"
				cd node_modules/labjack-nodejs/node_modules/ref
				BUILD_DATA="$(node-gyp rebuild)"
				cd ../../../..
			fi
			cd ../..

			if [ $2 = "framework" ]
			then
				cd ljswitchboard/switchboard_modules/framework/kipling-module-framework
				echo "running test: presenter_framework_test.js"
				nodeunit presenter_framework_test.js
				cd ../../../..
			fi
			# END: REBUILDING LABJACK_NODEJS TO BE RUN OUTSIDE OF NW.EXE

			if [ $2 = "fs_facade" ]
			then
				nodeunit ljswitchboard/src/fs_facade_test.js
			fi
			if [ $2 = "LabJack-nodejs" ]
			then
				cd ljswitchboard/src
				nodeunit helper_scripts/tests/labjack-nodejs_test.js
				cd ../..
			fi
			if [ $2 = "LabJack-nodejs/" ]
			then
				cd ljswitchboard/src
				nodeunit helper_scripts/tests/labjack-nodejs_test.js
				cd ../..
			fi
			if [ $2 = "task_manager" ]
			then
				cd ljswitchboard/src
				nodeunit helper_scripts/tests/task_manager_test.js
				cd ../..
			fi
		fi
		if [ $1 = "run" ]
		then
			cd ljswitchboard/src
			node helper_scripts/$2
			cd ../..
		fi
	else
		if [ $# -eq 1 ]
		then
			echo "There are $# args. The Arg Str is: $*"

			BUILD_KIPLING="false"
			RUN_KIPLING="false"

			if [ $1 = "setupGit" ]
			then
				git clone $LABJACK_NODE_GIT_URL
				git clone $LABJACK_SWITCHBOARD_GIT_URL
			elif [ $1 = "tRun" ]
			then
				BUILD_KIPLING="false"
				RUN_KIPLING="false"
			elif [ $1 = "run" ]
			then
				BUILD_KIPLING="false"
				RUN_KIPLING="true"
				
			elif [ $1 = "build" ]
			then
				BUILD_KIPLING="true"
				RUN_KIPLING="false"
			elif [ $1 = "buildAndRun" ]
			then
				BUILD_KIPLING="true"
				RUN_KIPLING="true"
			elif [ $1 = "LJ-buildAndRun" ]
			then
				cd robscript_standalone
				python robscript.py $CUR_PC_ROB_SCRIPT $CUR_PC_ROB_JSON
				cd ..
				echo "starting kipling"
				ljswitchboard\\deploy\\nw.exe
			elif [ $1 = "kipling" ]
			then
				open ljswitchboard/deploy/kipling.app
			else
				echo "no supported 1-word functions for: $1"
			fi

			# BEGIN: Building/Running Kipling ----------------------------------
			# START: REBUILDING LABJACK_NODEJS TO BE RUN WITH NW.EXE
			cd ljswitchboard/src
			# Determine if we need to rebuild ffi and ref
			REBUILD_FFI="false"
			REBUILD_REF="false"

			cd node_modules/labjack-nodejs/node_modules
			CUR_FILE="./ffi/build/config.gypi"
			if grep -q '"target_arch": "x64"' $CUR_FILE; then
				echo "ffi needs to be re-built b/c of target_arch"
				REBUILD_FFI="true"
			fi
			# if grep -q '"target": "0.8.6"---' $CUR_FILE; then
			# 	echo "ffi needs to be re-built b/c of target"
			# 	REBUILD_FFI="true"
			# fi
			CUR_FILE="./ref/build/config.gypi"
			if grep -q '"target_arch": "x64"' $CUR_FILE; then
				echo "ref needs to be re-built b/c of target_arch"
				REBUILD_REF="true"
			fi
			# if grep -q '"target": "0.8.6"---' $CUR_FILE; then
			# 	echo "ref needs to be re-built b/c of target"
			# 	REBUILD_REF="true"
			# fi
			cd ../../..

			if [ $REBUILD_FFI == "true" ]
			then
				echo "Rebuilding ffi"
				cd node_modules/labjack-nodejs/node_modules/ffi
				BUILD_DATA="$(nw-gyp clean)"
				BUILD_DATA="$(nw-gyp configure --target=0.8.6 --arch=ia32)"
				BUILD_DATA="$(nw-gyp build)"
				cd ../../../..
			fi
			if [ $REBUILD_REF == "true" ]
			then
				echo "Reguilding ref"
				cd node_modules/labjack-nodejs/node_modules/ref
				BUILD_DATA="$(nw-gyp clean)"
				BUILD_DATA="$(nw-gyp configure --target=0.8.6 --arch=ia32)"
				BUILD_DATA="$(nw-gyp build)"
				cd ../../../..
			fi
			cd ../..
			# END: REBUILDING LABJACK_NODEJS TO BE RUN WITH NW.EXE
			
			if [ $BUILD_KIPLING == "true" ]
			then
				cd robscript_standalone
				python robscript.py $CUR_PC_ROB_SCRIPT $CUR_PC_ROB_JSON
				cd ..
			fi
			if [ $RUN_KIPLING == "true" ]
			then
				echo "starting kipling"
				$CUR_PC_KIPLING_EXE
			fi
			# END: Building/Running Kipling ------------------------------------
		else
			echo "There are $# args. The Arg Str is: $*. Individually they are:"
			COUNT=1
			for var in "$@"
			do
				echo "$COUNT: $var"
				COUNT=`expr $COUNT + 1`
			done
		fi
	fi
fi