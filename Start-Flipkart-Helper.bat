@echo off
setlocal
title Flipkart Listing Helper

echo.
echo  ############################################################
echo  #                                                          #
echo  #              FLIPKART LISTING HELPER                     #
echo  #                                                          #
echo  ############################################################
echo.
echo          LISTING HELPER CONTROL PANEL
echo.

echo Starting Flipkart Listing Helper...
start "Flipkart Listing Helper API" /B cmd /c "python main.py >nul 2>&1"
echo [OK] Server launch requested.
echo [OK] Open the extension and load a profile.
endlocal