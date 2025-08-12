---
layout: default
title: Marshall Data Recorder Notes
---

#MainOverview

The Marshall data recorder can be largely grouped in to two sections: The DI-2008 DAQ, and the Advanced Navigation Spatial Fog Dual. Both pieces of equipment are controlled by a python script. This script initiates a GUI that enables the user to interface with both systems at once, simplifying collection and streamlining the process into one button press.

The DI-2008 is a Voltage Data Acquisition System that collects voltages from five string potentiometers. These potentiometers are connected to the cyclic (pitch and roll axis), collective, and the right pedal. The DAQ provides a 15 volt input across the wipers of the potentiometers and the change in resistance caused by the movement of the controls changes the subsequent voltage read by each channel of the DAQ.

The second component is the Spatial FOG Dual device which records GNSS and inertial measurement data. This data is pushed to a proprietary binary file (.anpp) as defined by Advanced Navigation. Specifics are outlined in the sections below. This unit utilized two GNSS receivers, one primary and one secondary, to properly capture GPS satellite data.

#DI-2008Data
