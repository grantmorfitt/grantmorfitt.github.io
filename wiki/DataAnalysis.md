---
layout: default
title: Vertiport Data Analysis Script
---
{% raw %}
'''python
# -*- coding: utf-8 -*-
"""
@author: Grant Morfitt
"""
# %% Import Dependencies
import glob
import pandas as pd
import os
import numpy as np
import math
from haversine import haversine, Unit

#from plotly.subplots import make_subplots
#import plotly.graph_objects as go
#import plotly.io as io

# %% Import data
root = f'C:\\Users\g.morfitt\Documents\Vertiport Study II Analysis'
outputPath = f'{root}'
simPath =f'{root}\\Data\\'

referenceSheetPath = f'{root}\\Master Compiled Run Sheet.csv'
referenceSheet_cols = ['filename', 'pilot', 'date', 'start_heading_true', 'start_heading_mag', 'start_altitude_ft', 'grant_scenario_predic', 'temp_ From Lacey File','Scenario', 'Re-ran (T/F)', 'Needs Further Investigation', 'Notes']
referenceSheet = pd.read_csv(referenceSheetPath, engine='python', encoding = 'cp1252', skiprows=2, names = referenceSheet_cols)

helipadLocation = (40.7007261256937, -74.00856919065693)


simdata_cols = ['aircraft_type','Datetime','Aerofly_Out_Simulation_Time','Aerofly_Out_Aircraft_Latitude','Aerofly_Out_Aircraft_Longitude','Aerofly_Out_Aircraft_Altitude','Aerofly_Out_Aircraft_TrueAltitude','Aerofly_Out_Aircraft_MagneticHeading','Aerofly_Out_Aircraft_TrueHeading','Aerofly_Out_Aircraft_Pitch','Aerofly_Out_Aircraft_Bank','Aerofly_Out_Aircraft_GroundSpeed','Aerofly_Out_Aircraft_GroundTrack','Aerofly_Out_Instrument_IndicatedAirspeed','Aerofly_Out_Aircraft_TrueAirspeed','Aerofly_Out_Aircraft_VerticalSpeed','Aerofly_Out_Instrument_PressureAltitude','Aerofly_Out_Aircraft_AirTemperature','Aerofly_Out_Aircraft_Crashed','Aerofly_Out_Aircraft_FuelMass','CLS_U','Aerofly_Out_Aircraft_Height','Aerofly_Out_Aircraft_HeightCargo','Aerofly_Out_Aircraft_HeightLoad','Aerofly_Out_Aircraft_Hydraulics_MainLinePressure','Aerofly_Out_Aircraft_Hydraulics_MainRotorServo0Pressure','Aerofly_Out_Aircraft_Hydraulics_MainRotorServo1Pressure','Aerofly_Out_Aircraft_Hydraulics_MainRotorServo2Pressure','Aerofly_Out_Aircraft_Hydraulics_TailRotorActuatorPressure','Aerofly_Out_Aircraft_OnGround','Aerofly_Out_Aircraft_RawAirTemperature','Aerofly_Out_Aircraft_Universialtime','Aerofly_Out_Aircraft_Velocity','Aerofly_Out_Aircraft_Vortex','Aerofly_Out_Crash_ExcessiveLandingRate','Aerofly_Out_Crash_ExcessiveLoadFactor','Aerofly_Out_Crash_FirstLimitExceeded','Aerofly_Out_Crash_HighAirspeed','Aerofly_Out_Crash_HighRotorSpeed','Aerofly_Out_Crash_LowRotorSpeed','Aerofly_Out_Crash_SlingLoadExcessiveGroundSpeed','Aerofly_Out_Crash_SlingLoadExcessiveLandingRate','Aerofly_Out_Crash_UpsetPitchAttitudeAirborne','Aerofly_Out_Crash_UpsetPitchAttitudeGround','Aerofly_Out_Crash_UpsetRollAttitudeAirborne','Aerofly_Out_Crash_UpsetRollAttitudeGround','Aerofly_Out_Instrument_CarburetorTemperature','Aerofly_Out_Instrument_EngineTorqueFraction','Aerofly_Out_Instrument_FuelFlow','Aerofly_Out_Instrument_GeneratorContactorCurrent','Aerofly_Out_PressureSettingPilot','Aerofly_Out_Simulation_Fps','Aerofly_Out_Simulation_NavigationCycle','Aerofly_Out_Simulation_Pause','Aerofly_Out_Simulation_SelectedTriangles','Avionics_GTN650_Out_ComActive','Avionics_GTN650_Out_ComStandby','Avionics_GTN650_Out_ComVolume','Avionics_GTN650_Out_NavActive','Avionics_GTN650_Out_NavStandby','Avionics_GTN650_Out_NavVolume','Avionics_GTN650_Out_Squelch','Avionics_GTN650_Out_VLOCorGPS','Aerofly_Out_Aircraft_RotorRotationSpeed','Aerofly_Out_Instrument_EngineNR','Aerofly_Out_Instrument_EngineNP','Aerofly_Out_Aircraft_EngineRotationSpeed','Aerofly_Out_Instrument_EngineRotationSpeed','Aerofly_Out_Aircraft_Acceleration','Aerofly_Out_Aircraft_AngularVelocity','Aerofly_Out_Aircraft_AngleOfAttack','Aerofly_Out_Aircraft_SideSlip','Aerofly_In_Weather_Wind_Direction','Aerofly_In_Weather_Wind_Speed','Aerofly_In_Weather_Wind_VerticalSpeed','Aerofly_In_Aircraft_WindshearX','Aerofly_In_Aircraft_WindShearY','Aerofly_In_Aircraft_WindShearZ','Ios_FlightAssistance_ClimbRate_Enabled','Ios_FlightAssistance_ForwardSpeed_Enabled','Ios_FlightAssistance_Pedals_Enabled','Ios_FlightAssistance_SideSpeed_Enabled','Ios_FlightAssistance_Throttle_Enabled','Ios_Weight_Cargo','Ios_Weight_Fuel','Ios_Weight_LHSideCargo','Ios_Weight_Passenger_Front','Ios_Weight_Passenger_Back1','Ios_Weight_Passenger_Back2','Ios_Weight_Passenger_Back3','Ios_Weight_Passenger_Back4','Ios_Weight_Pilot','Ios_Weight_RearCargo','Ios_Weight_RHSideCargo','Symbol_Detected','Symbol_Distinguished']


dataDict = {} #Keys will be the file name, value will be the data dict
count = 0
for root, dirs, files in os.walk(simPath) : #Import Data into a dataframe. This is seperate so it only has to be run once per analysis session
        for x in files:
            if (x.endswith(".csv")):
                    filePath = os.path.join(root, x)
                    #print(filePath)
                    if (len(simPath) > 0):
                        #csvData[x] = filePath
                        currentFile = pd.read_csv(filePath, on_bad_lines = 'warn', engine='python', encoding = 'cp1252', skiprows=1, names = simdata_cols)
                        dataDict[x] = currentFile
                        count = count + 1
                        print(f"Importing {x} | {count}/NaN" )  
count = 0

#%% Function Decleration
def ParsePertinentData(inputDf: pd.DataFrame) -> tuple:
    """
    

    Parameters
    ----------
    inputDf : pd.DataFrame
        takes in the first row of a dataframe with data

    Returns
    -------
    tuple
        returns the important data in a tuple

    """

    
    latitude: float = math.degrees(float(inputDf['Aerofly_Out_Aircraft_Latitude']))
    longitude: float = -(360 - math.degrees(float(inputDf['Aerofly_Out_Aircraft_Longitude'])))
    coordinate: tuple = (latitude, longitude)
    
    altitude: float = float(inputDf['Aerofly_Out_Aircraft_Altitude'])
    airspeed: float = float(inputDf['Aerofly_Out_Instrument_IndicatedAirspeed'])
    time: str = inputDf['Datetime'].split(" ")[1]
   
    distanceToHelipad: float = haversine(helipadLocation, coordinate, unit = Unit.NAUTICAL_MILES)
    
    returnValue = (coordinate, altitude, airspeed, time, distanceToHelipad)
    
    return returnValue

def ReturnScenarioInfo(aircraft: str, scenarioNum: str) -> tuple:
    
    if scenarioNum == 'fam':
        return [aircraft, 'fam']
    
    try:  
       scenarioNum = int(scenarioNum)  
    except:
        scenarioNum = 0
    
    if aircraft == "R22":
        print('r22')
        match (scenarioNum):
            case 1:
                print("x")
                return ['statue 81', 'h']
            case 2:
                return ['brooklyn 81', 'easav']
            case 3:
                return ['bridge 81', 'brokenwheel']
            case 4:
                return ['statue 61', 'brokenwheel']
            case 5:
                return ['bridge 61', 'easav'] 
            case 6:
                return ['brookyln 61', 'h']
            case 7:
                return ['statue 81', 'easav']
            case 8:
                return ['bridge 81', 'easav']
            case 9:
                return ['brookyln 81', 'brokenwheel']
            case 10:
                return ['brooklyn 61', 'h']
            case 11:
                return ['statue 61', 'easav']
            case 12:
                return ['statue 61', 'h']
            case 13:
                return ['brookly 61', 'easav']
            case 14:
                return ['statue 81', 'brokenwheel']
            case 15:
                return ['brooklyn 61', 'easav']
            case 16:
                return ['bridge 61', 'brokenwheel']
            case 17:
                return ['bridge 81', 'h']
            case 18:
                return ['bridge 61', 'h']
                
            case _: 
                return ["",""]
                
        
    if aircraft == "H125":
        print("h125")
        match (scenarioNum):
            case 1:
                return ['bridge 61', 'h']
            case 2:
                return ['statue 81', 'h']
            case 3:
                return ['brooklyn 81', 'easav']
            case 4:
                return ['bridge 81', 'brokenwheel']
            case 5:
                return ['statue 61', 'brokenwheel'] 
            case 6:
                return ['bridge 61', 'easav']
            case 7:
                return ['brooklyn 81', 'h']
            case 8:
                return ['statue 81', 'easav']
            case 9:
                return ['bridge 81', 'h']
            case 10:
                return ['bridge 81', 'easav']
            case 11:
                return ['brooklyn 81', 'brokenwheel']
            case 12:
                return ['brooklyn 61', 'h']
            case 13:
                return ['statue 61', 'easav']
            case 14:
                return ['statue 61', 'h']
            case 15:
                return ['brooklyn 61', 'brokenwheel']
            case 16:
                return ['statue 81', 'brokenwheel']
            case 17:
                return ['brooklyn 61', 'easav']
            case 18:
                return ['bridge 61', 'brokenwheel']
                
            case _: 
                return ["",""]
    
    
    return ['', '']

# %% Run initial organization/processing

count:int = 0;
files_total:int = len(dataDict) - 1

resultCols = ['filename','pilot','date', 'scenarionumber', 'scenario', 'symbol','symboldetected_time','symboldetected_lat,lon','symboldetected_alt', 
                  'symboldetected_distance', 'symboldistinguish_time', 'symboldistinguish_lat,lon',
                  'symboldistinguish_alt', 'symboldistinguish_distance']

outputFrame: pd.DataFrame= pd.DataFrame(index = range(1), columns = resultCols )

for i,j in enumerate(dataDict):
    count += 1
    currentPilot = ""
    currentScenario = ""
    currentAircraft = ""
    approachDirAlt = ""
    helipadSymbol = ""
    tempResultFrame = pd.DataFrame(index = range(1), columns = resultCols ) #only holds info for one file at a time

    print(f"Processing {j}| {count}/{files_total}")
    
    #Here's where we pull scenario/pilot data from the reference master sheet

    currentFile: pd.DataFrame = dataDict[j]
    referenceData = referenceSheet.loc[referenceSheet['filename'] == j]
    
    if len(referenceData) > 0:   #Is the data empty?
        currentPilot = referenceData['pilot'].item()
        currentScenario= referenceData['Scenario'].item()

        if currentPilot[0:1].upper() == "R":
            currentAircraft = "R22"
        if currentPilot[0:1].upper() == "H":
            currentAircraft = "H125"
 
        scenarioDetails = ReturnScenarioInfo(currentAircraft, currentScenario)
        approachDirAlt = scenarioDetails[0]
        helipadSymbol = scenarioDetails[1]
        
    if len(currentFile) > 1:
        aircraftType: str = currentFile['aircraft_type'][0]
        currentDate: str = currentFile['Datetime'][1].split(" ")[0]
    
    
    tempResultFrame['filename'] = j
    tempResultFrame['pilot'] = currentPilot
    tempResultFrame['date'] = currentDate
    tempResultFrame['scenarionumber'] = currentScenario #We need to use the function I just wrote to pull the actual scenario names/app direction.
    

    
    tempResultFrame['scenario'] = approachDirAlt
    tempResultFrame['symbol'] = helipadSymbol
    
    # This section is for detecting the symbol
    symbolDetected: pd.DataFrame = currentFile.loc[currentFile['Symbol_Detected'] == "True"]
    if (len(symbolDetected) > 0): #Make sure the pilot actually detected a symbol
        
        symbolDetected_firstRow: pd.Series = symbolDetected.iloc[0]

        pertData = ParsePertinentData(symbolDetected_firstRow)
        #(coordinate, altitude, airspeed, time, distanceToHelipad)
         
        tempResultFrame['symboldetected_time'] = pertData[3] 
        tempResultFrame['symboldetected_lat,lon'] = str(pertData[0])
        tempResultFrame['symboldetected_alt'] = str(pertData[1])
        tempResultFrame['symboldetected_distance'] = str(pertData[4])
        
    if (len(symbolDetected) == 0): #Make sure the pilot actually detected a symbol
        tempResultFrame['symboldetected_time'] = 0 
        tempResultFrame['symboldetected_lat,lon'] = 0
        tempResultFrame['symboldetected_alt'] = 0
        tempResultFrame['symboldetected_distance'] = 0

    # Distinguishing the symbol
    symbolDist: pd.DataFrame = currentFile.loc[currentFile['Symbol_Distinguished'] == "True"]
    if (len(symbolDist) > 0): #Make sure the pilot actually detected a symbol
        
        symbolDist_firstRow: pd.Series = symbolDist.iloc[0]

        pertData = ParsePertinentData(symbolDist_firstRow)
         #(coordinate, altitude, airspeed, time, distanceToHelipad)
         
        tempResultFrame['symboldistinguish_time'] = pertData[3] 
        tempResultFrame['symboldistinguish_lat,lon'] = str(pertData[0])
        tempResultFrame['symboldistinguish_alt'] = str(pertData[1])
        tempResultFrame['symboldistinguish_distance'] = str(pertData[4])
        
    if (len(symbolDist) == 0): #Make sure the pilot actually detected a symbol
       tempResultFrame['symboldistinguish_time'] = 0
       tempResultFrame['symboldistinguish_lat,lon'] = 0
       tempResultFrame['symboldistinguish_alt'] = 0
       tempResultFrame['symboldistinguish_distance'] = 0
       
    outputFrame = pd.concat([outputFrame,tempResultFrame], ignore_index = True)
outputFrame.to_csv(f'{outputPath}\\output.csv')

'''
{% endraw %}

  
