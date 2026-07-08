#!/bin/sh

ABORT=0
echo "\n\033[33m\033[1mChecking if build tools are installed: \033[0m"

# Check if cmake is installed
if ! command -v cmake >/dev/null 2>&1; then
    echo "\033[31m\033[1mError: cmake is required to build this project but was not found." >&2
    echo "\033[32m\033[1mPlease install cmake using your system's package manager and try again." >&2
    echo "Example (macOS): brew install cmake - (Ubuntu/Debian): sudo apt install cmake\033[0m" >&2
    ABORT=1
fi

# Check if make is installed
if ! command -v make >/dev/null 2>&1; then
    echo "\033[31m\033[1mError: make is required to build this project but was not found." >&2
    echo "\033[32m\033[1mPlease install make using your system's package manager and try again." >&2
    echo "Example (macOS): brew install make - (Ubuntu/Debian): sudo apt install make\033[0m" >&2
    ABORT=1
fi

# Check if c compiler is installed
if ! command -v gcc >/dev/null 2>&1 || ! command -v clang >/dev/null 2>&1; then
    echo "\033[31m\033[1mError: c compiler (gcc or clang) is required to build this project but was not found." >&2
    echo "\033[32m\033[1mPlease install the c compiler using your system's package manager and try again.\033[0m" >&2
    ABORT=1
fi

if [ $ABORT -eq 1 ]; then
	exit 1
fi

echo "\033[32m\033[1mPASS\033[0m"

# check if hc_malloc library is installed, if not install it.
LIB="/usr/local/lib/libhc_malloc.a"

if [ ! -f $LIB ]; then
	echo "\033[1;33mInstalling hc_malloc library.\n\033[0m"
	curl -L https://yveshoebeke.github.io/install/deploy_hc_malloc.sh | sh
fi

# 1. Project source and paths.
DATA_PATH="https://yveshoebeke.github.io/data"
TAR_BALL="geheim.tar.gz"
CHECKSUMS="SHA1SUMS"

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
	shasum -s -c "$CHECKSUMS"
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
make

# 7. Get out of the temp project folder and start cleaning.
cd $OWD

# 8. Safe cleanup of the temporary folder.
echo "\n\033[33m\033[1mRemoving temporary work area.\033[0m"
rm -rf "$TMP_DIR"

# 9. Done.
echo "\n\033[32m\033[1mGEHEIM - Instalation completed.\033[0m"
exit 0

