@echo off
echo ========================================
echo One Chain Faucet - Request Tokens
echo ========================================
echo.

echo Wallet Address: 0xdeac1680f935c0d5265b4e0656a2436361d8adebee0adf3060ef6c06e95c89eb
echo.

echo Requesting tokens from faucet...
sui client faucet
echo.

echo Checking balance...
sui client gas
echo.

echo ========================================
echo Done!
echo ========================================
pause
