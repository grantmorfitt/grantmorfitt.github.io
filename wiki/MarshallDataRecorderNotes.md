---
layout: default
title: Marshall Data Recorder Notes
---

# Marshall Data Recorder and Data Formatting Notes **(IN PROGRESS)**

<a href="[wiki/MarshallDataRecorderNotes.md](https://raw.githubusercontent.com/grantmorfitt/grantmorfitt.github.io/refs/heads/main/wiki/MarshallDataRecorderNotes.md)" style="
  display: inline-block;
  padding: 0px 10px;
  background-color:#e3342f;
  color: white;
  font-weight: ;
  border-radius: 6px;
  text-decoration: none;
  font-family: sans-serif;
">
  ⬇ Download Text
</a>

## MainOverview

The Marshall data recorder can be largely grouped in to two sections: The DI-2008 DAQ, and the Advanced Navigation Spatial Fog Dual. Both pieces of equipment are controlled by a python script. This script initiates a GUI that enables the user to interface with both systems at once, simplifying collection and streamlining the process into one button press.

The DI-2008 is a Voltage Data Acquisition System that collects voltages from five string potentiometers. These potentiometers are connected to the cyclic (pitch and roll axis), collective, and the right pedal. The DAQ provides a 15 volt input across the wipers of the potentiometers and the change in resistance caused by the movement of the controls changes the subsequent voltage read by each channel of the DAQ.

The second component is the Spatial FOG Dual device which records GNSS and inertial measurement data. This data is pushed to a proprietary binary file (.anpp) as defined by Advanced Navigation. Specifics are outlined in the sections below. This unit utilized two GNSS receivers, one primary and one secondary, to properly capture GPS satellite data.

## DI-2008 Data

<img src="../assets/controls_layout.jpg" alt="Helicopter Setup" width="300" height="200">
Shown above is the set up for the helicopter controls. Four string potentiometers are connected to the DI-2008 channels 1-4. 



Control Position Voltages:
**Pitch:** Increase voltage is pitch forward on cyclic. 
**Roll:** Increase voltage is cyclic roll to left
**Pedal:** Increase in voltage is increase in right rudder
**Collective:** Increase in voltage is collective up

## Dual Spatial Fog Data
The Marshall Data recorder script I wrote directly takes the binary from the Spatial Fog device and saved it to a propriatary .anpp format. .anpp files must be converted by Spatial Fog Manager Log Converter to get GNSS/Sensor Logs from Advanced Navigation device
https://www.advancednavigation.com/inertial-navigation-systems/fog-gnss-ins/spatial-fog-dual/#h-downloads

Please note that **Java 11 is required to run Spatial FOG Manager**. This caveat is noted on the website under the download page.

Infuriatingly, log files **must** be converted one log file at a time. I've talked in circles with support about this with no luck. Evidently this is not something they deem a necessary feature at this time. Oh well.

Once converted, .anpp files give you the following:
  + **Configuration.txt** - Configuration of the device
  + **DeviceInformation.txt** - static, device info. serial # etc
  + **GoogleEarthTrack.gpx** - Google earth track files
  + **GoogleEarthTrack.gpx** - Google earth track files
  + **GoogleEarthTrack.kml** - Google earth track files
  + **LogConverter.txt** - Shows version of software that did the conversion
  + **RawGNSS.csv** - Raw sensor data. tilt, velocities, lat/lons
  + **RawSensors.csv** - Sensor data from IMS. Gyroscope, magnetmometer, accelerometer
  + **State.csv** - State of GNSS and sensors. By this, I mean that this file tells you if heading is being tracked, errors that might be present in each sensor, if dual heading is active, etc. You can this of this as a sensor monitor file



Specifics for the raw GNSS data:

Velocity Down (m/s) measures velocity down in meters per second. This can be utilized for vertical speed, but must be converted to feet per minute. Velocity down shows positive for a descent, and negative for a descent. Thusly, the calculation must be negated to get vertical speed/fpm

```
Feet per minute = -1 * (Velocity Down (m/s) * 196.85)
```
Velocity East (m/s) in a similar method shows **positive** for easterly travel

Height (m) measures height MSL in meters. 
```
Height (ft) = height (m) * 3.281 
```
