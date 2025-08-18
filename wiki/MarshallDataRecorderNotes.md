---
layout: default
title: Marshall Data Recorder Notes
---

# Marshall Data Recorder and Data Formatting Notes **(IN PROGRESS)**

<a href="example.txt" download="wiki/MarshallDataRecorderNotes.md" style="
  display: inline-block;
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  font-weight: bold;
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
Control Position Voltages:
**Pitch:** Increase voltage is pitch forward on cyclic. 
**Roll:** Increase voltage is cyclic roll to left
**Pedal:** Increase in voltage is increase in right rudder
**Collective:** Increase in voltage is collective up

## Dual Spatial Fog Data
.anpp files must be converted by Spatial Fog Manager Log Converter to get GNSS/Sensor Logs from Advanced Navigation device


Velocity Down (m/s) measures velocity down in meters per second. This can be utilized for vertical speed, but must be converted to feet per minute. Velocity down shows positive for a descent, and negative for a descent. Thusly, the calculation must be negated to get vertical speed/fpm

```
Feet per minute = -1 * (Velocity Down (m/s) * 196.85)
```
Velocity East (m/s) in a similar method shows **positive** for easterly travel

Height (m) measures height MSL in meters. 
```
Height (ft) = height (m) * 3.281 
```
