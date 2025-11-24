@echo off
echo ========================================
echo One Chain Game Logger Deployment
echo ========================================
echo.

echo Step 1: Check balance
echo ----------------------------------------
sui client gas
echo.

echo Step 2: Build Move package
echo ----------------------------------------
cd move-contracts\game-logger
sui move build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)
echo.

echo Step 3: Deploy to One Chain
echo ----------------------------------------
sui client publish --gas-budget 100000000 --skip-dependency-verification
echo.

echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Copy the Package ID from above
echo 2. Add to .env: NEXT_PUBLIC_GAME_LOGGER_PACKAGE_ID=your_package_id
echo 3. Restart development server
echo.
pause
