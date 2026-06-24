#!/bin/sh

# 1. Project source and paths.
#DATA_PATH="http://localhost/data"
DATA_PATH="https://yveshoebeke.github.io/data"
TAR_BALL="geheim.tar.gz"
OWD=$(pwd)

# 2. Create a safe temporary directory to untar the code.
TMP_DIR=$(mktemp -d -t installer.XXXXXX)
echo "\n\033[33m\033[1mTemporary work directory:\033[0m"
echo "\033[33m[\033[32m$TMP_DIR\033[33m]\033[0m"
cd $TMP_DIR

# 3. Get the tar ball and extract.
echo "\n\033[33m\033[1mRetrieving build package:\033[0m"
echo "\033[33m[\033[32m$iDATA_PATH/$TAR_BALL\033[33m]\033[0m"
curl -SL "$DATA_PATH/$TAR_BALL" -o "$TAR_BALL"

# 4. Extract project files
echo "\n\033[33m\033[1mExtracting project files:\033[0m"
tar -xvzf "$TAR_BALL"

# 5. Check checksums of source
if command -v shasum >/dev/null 2>&1; then
	echo "\033[33m\033[1m\nChecking source integrity.\033[0m"
	shasum -s -c doc/geheim.shasum
	if [ $? -eq 0 ]; then
		echo "\033[32m\033[1mPASS: All files verified successfully.\033[0m"
	else
		echo "\033[31m\033[1mFAIL: One or more checksums failed.\nAborting.\033[0m"
		exit 1
	fi
else
    echo "\033[31m\033[1mUnable to check integrity, continueing without.\033[0m"
fi

# 6. Now we evoke cmake and build it.
echo "\n\033[33m\033[1mStart build process:\033[0m"
cmd/build.sh

# 7. Get out of the temp project folder and start cleaning.
cd $OWD

# 8. Safe cleanup of the temporary folder.
echo "\n\033[33m\033[1mRemoving temporary work area.\033[0m"
rm -rf "$TMP_DIR"

# 9. Done.
echo "\n\033[32m\033[1mGEHEIM - Instalation completed.\033[0m"
exit 0

